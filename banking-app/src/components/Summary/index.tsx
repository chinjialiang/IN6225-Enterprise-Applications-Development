import React from "react";
import { connect } from "react-redux";
import { RootReducer } from "../../redux/reducer";
import { User } from "../types";
import { formatCurrency } from "../../utils";
import { TextBold, TextBoldFontsize20, TextFontsize12, Text } from "../../ui/Topography";
import { BlockContainer, FlexContainer } from "../../ui/Container";
import moment from "moment";

import "./styles.css";

interface SummaryComponentProps {
  user: User;
}

export const SummaryComponent: React.FC<SummaryComponentProps> = ({ user }) => {
  return (
    <FlexContainer className="summary-card">
      <BlockContainer className="summary-card-content-left">
        <TextBold>Welcome</TextBold>
        <TextBoldFontsize20>{user.name}</TextBoldFontsize20>
        <TextFontsize12>
          Your last login was on {""}
          {moment.unix(user.lastLogin).format("DD MMM YYYY hh:mm a")}
        </TextFontsize12>
      </BlockContainer>
      <BlockContainer className="summary-card-content-right">
        <TextBold className="financial-overview-text">Your Financial Overview</TextBold>
        <FlexContainer style={{ justifyContent: "space-between" }}>
          <Text className="financial-overview-text-sub">Cash & Investments</Text>
          <Text className="financial-overview-text-sub">{formatCurrency(user.accountBalance)}</Text>
        </FlexContainer>
        <hr />
      </BlockContainer>
    </FlexContainer>
  );
};

const mapStateToProps = (state: RootReducer) => {
  const user = state.data.user;
  return { user };
};

export const Summary = connect(mapStateToProps)(SummaryComponent);
