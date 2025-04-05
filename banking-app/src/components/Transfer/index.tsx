import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { ACTION, RootReducer } from "../../redux/reducer";
import { transferFund } from "../../service";
import { User } from "../types";
import { Dialog, TextField } from "@mui/material";
import { formatAccountNumber, unformatAccountNumber } from "../../utils";
import { StyledTextFieldOutlinedSmall } from "../../ui/TextField";
import { ButtonGray, ButtonRed } from "../../ui/Button";
import { BlockContainer, FlexContainer } from "../../ui/Container";
import { TextBoldFontsize24, TextRed, Text } from "../../ui/Topography";

import "./styles.css";

interface TransferProps {
  user: User;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface FormValues {
  recipientName: string;
  recipientAccount: string;
  fromAccount: string;
  transferAmount: string;
  comments: string;
}

export const TransferComponent: React.FC<TransferProps> = ({ isOpen, setIsOpen, user }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState({
    status: false,
    message: "",
  });
  const [formValues, setFormValues] = useState<FormValues>({
    recipientName: "",
    recipientAccount: "",
    fromAccount: formatAccountNumber(user.accountNumber),
    transferAmount: "",
    comments: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError({ status: false, message: "" });
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnClickTransfer = async () => {
    const result = await transferFund(
      unformatAccountNumber(formValues.fromAccount),
      unformatAccountNumber(formValues.recipientAccount),
      parseFloat(formValues.transferAmount)
    );
    if (result?.data) {
      dispatch({ type: ACTION.ADD_TRANSACTIONS, payload: [result?.data] });
      dispatch({
        type: ACTION.UPDATE_ACCOUNT_BALANCE,
        payload: user.accountBalance - parseFloat(formValues.transferAmount),
      });
      setIsOpen(false);
    } else if (result.error) {
      setError({ status: true, message: result.error });
    }
  };

  const handleOnclickCancel = () => {
    setFormValues({
      recipientName: "",
      recipientAccount: "",
      fromAccount: formatAccountNumber(user.accountNumber),
      transferAmount: "",
      comments: "",
    });
    setIsOpen(false);
  };

  console.log("formValues :>> ", formValues);

  return (
    <Dialog open={isOpen} onClose={handleOnclickCancel}>
      <BlockContainer className="fund-transfer-card">
        <TextBoldFontsize24>Transfer Funds to Another Bank's Account</TextBoldFontsize24>
        <Text>TO</Text>
        <hr />
        <FlexContainer className="button-group">
          <Text>Recipient's Name</Text>
          <StyledTextFieldOutlinedSmall name="recipientName" onChange={handleOnChange} />
        </FlexContainer>
        <FlexContainer className="button-group">
          <Text>Recipient's Account</Text>
          <TextField
            name="recipientAccount"
            size="small"
            variant="outlined"
            onChange={handleOnChange}
          />
        </FlexContainer>
        <Text>FROM</Text>
        <hr />
        <FlexContainer className="button-group">
          <Text>From Account</Text>
          <StyledTextFieldOutlinedSmall
            name="fromAccount"
            defaultValue={formatAccountNumber(user.accountNumber)}
            disabled={true}
            onChange={handleOnChange}
          />
        </FlexContainer>
        <FlexContainer className="button-group">
          <Text>Transfer Amount</Text>
          <StyledTextFieldOutlinedSmall name="transferAmount" onChange={handleOnChange} />
        </FlexContainer>
        <FlexContainer className="button-group">
          <Text>Comments for Recipient</Text>
          <StyledTextFieldOutlinedSmall name="comments" onChange={handleOnChange} />
        </FlexContainer>
        {error.status && (
          <FlexContainer style={{ justifyContent: "center" }}>
            <TextRed>Transfer Funds Failed: {error.message}</TextRed>
          </FlexContainer>
        )}
        <FlexContainer className="navigation-button-group">
          <ButtonGray variant="contained" onClick={handleOnclickCancel}>
            Cancel
          </ButtonGray>
          <ButtonRed variant="contained" onClick={handleOnClickTransfer}>
            Transfer
          </ButtonRed>
        </FlexContainer>
      </BlockContainer>
    </Dialog>
  );
};

const mapStateToProps = (state: RootReducer) => {
  const user = state.data.user;
  return { user };
};

export const Transfer = connect(mapStateToProps)(TransferComponent);
