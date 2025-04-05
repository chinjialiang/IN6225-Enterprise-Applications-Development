import React, { useEffect, useState } from "react";
import { ACTION, RootReducer } from "../../redux/reducer";
import { connect, useDispatch } from "react-redux";
import {
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { fetchTransactionsByAccountId } from "../../service";
import { Transaction, User } from "../types";
import { formatAccountNumber, formatCurrency } from "../../utils";
import moment from "moment";
import { Moment } from "moment";
import { BlockContainer, FlexContainer } from "../../ui/Container";
import { TextBoldFontsize14, TextFontsize12, TextFontsize24 } from "../../ui/Topography";

import "./styles.css";

interface TransactionsComponentProps {
  user: User;
  transactions: Transaction[];
}

interface DateFilter {
  dateFrom: Moment | null;
  dateTo: Moment | null;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const datePickerStyles = {
  "& .MuiInputBase-input": {
    height: "2px",
    width: "100px",
    fontSize: "10px",
  },
};

export const TransactionsComponent: React.FC<TransactionsComponentProps> = ({
  user,
  transactions,
}) => {
  const dispatch = useDispatch();
  const [items, setItems] = useState<Transaction[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    dateFrom: moment().subtract({ months: 3 }),
    dateTo: moment(),
  });

  const retrieveTransactions = async (accountId: string) => {
    const transactions = await fetchTransactionsByAccountId(accountId);
    dispatch({ type: ACTION.ADD_TRANSACTIONS, payload: transactions });
    setItems(transactions);
  };

  useEffect(() => {
    if (items.length === 0) {
      retrieveTransactions(user.accountNumber);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (transactions) {
      setItems(transactions);
    }
  }, [transactions]);

  const handleOnClickReset = () => {
    setDateFilter({
      dateFrom: moment().subtract({ months: 3 }),
      dateTo: moment(),
    });
  };

  const filteredItems =
    dateFilter.dateFrom && dateFilter.dateTo
      ? items.filter((item) => {
          const itemDate = moment.unix(item.dateTime);
          const startDate = dateFilter.dateFrom!.set({ hour: 0, minute: 0, second: 0 });
          const endDate = dateFilter.dateTo!.set({ hour: 23, minute: 59, second: 59 });
          return itemDate >= startDate && itemDate <= endDate;
        })
      : items;

  return (
    <BlockContainer className="transactions-card ">
      <TextFontsize24>Transaction History</TextFontsize24>
      <FlexContainer className="transaction-history-filter-card">
        <BlockContainer>
          <TextFontsize12 style={{ marginTop: "0px" }}>Transaction From</TextFontsize12>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              format="DD-MM-YYYY"
              name="dateFrom"
              value={dateFilter.dateFrom}
              onChange={(newDate) => setDateFilter({ ...dateFilter, dateFrom: newDate })}
              sx={datePickerStyles}
            />
          </LocalizationProvider>
        </BlockContainer>
        <BlockContainer>
          <TextFontsize12 style={{ marginTop: "0px" }}>Transaction To</TextFontsize12>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              format="DD-MM-YYYY"
              name="dateTo"
              value={dateFilter.dateTo}
              onChange={(newDate) => setDateFilter({ ...dateFilter, dateTo: newDate })}
              sx={datePickerStyles}
            />
          </LocalizationProvider>
        </BlockContainer>
        <BlockContainer style={{ marginTop: "30px" }}>
          <Button className="transaction-history-go-button ">Go</Button>
        </BlockContainer>
        <BlockContainer style={{ marginTop: "30px" }}>
          <Button className="transaction-history-reset-button" onClick={handleOnClickReset}>
            Reset
          </Button>
        </BlockContainer>
      </FlexContainer>
      <TextBoldFontsize14>
        DBS Multiplier Account {formatAccountNumber(user.accountNumber)}
      </TextBoldFontsize14>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell align="left">Transaction ID</StyledTableCell>
              <StyledTableCell align="left">To Account / From Account</StyledTableCell>
              <StyledTableCell align="left">Debit (Withdrawal)</StyledTableCell>
              <StyledTableCell align="left">Credit (Deposit)</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <StyledTableRow
                key={item.transactionId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell component="th" scope="row">
                  {moment.unix(item.dateTime).format("DD MMM YYYY hh:mm a")}
                </StyledTableCell>
                <StyledTableCell align="left">{item.transactionId}</StyledTableCell>
                <StyledTableCell align="left">
                  {item.fromAccount === user.accountNumber
                    ? formatAccountNumber(item.toAccount)
                    : formatAccountNumber(item.fromAccount)}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {item.fromAccount === user.accountNumber ? formatCurrency(item.amount) : ""}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {item.toAccount === user.accountNumber ? formatCurrency(item.amount) : ""}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </BlockContainer>
  );
};

const mapStateToProps = (state: RootReducer) => {
  const user = state.data.user;
  const transactions = state.data.transactions;
  return { user, transactions };
};

export const Transactions = connect(mapStateToProps)(TransactionsComponent);
