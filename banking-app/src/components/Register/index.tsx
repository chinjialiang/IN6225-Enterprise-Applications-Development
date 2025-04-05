import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { registerUser } from "../../service";
import { StyledTextFieldOutlinedSmall } from "../../ui/TextField";
import { ButtonGray, ButtonRed } from "../../ui/Button";
import { BlockContainer, FlexContainer } from "../../ui/Container";
import { Text, TextBoldFontsize24, TextRed } from "../../ui/Topography";

import "./styles.css";

interface RegisterProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setOpenAlert: (isOpen: boolean) => void;
}

export const Register: React.FC<RegisterProps> = ({ isOpen, setIsOpen, setOpenAlert }) => {
  const [isError, setIsError] = useState(false);
  const [formValues, setFormValues] = useState({
    userId: "",
    pin: "",
    name: "",
    amount: "",
  });
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnClickRegister = async () => {
    const { userId, pin, name, amount } = formValues;
    if (userId === "" || pin === "" || name === "" || amount === "") {
      return;
    }
    const result = await registerUser(userId, pin, name, parseFloat(amount));
    if (result) {
      setIsOpen(false);
      setOpenAlert(true);
    } else {
      setIsError(true);
    }
  };

  const handleOnclickCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleOnclickCancel}>
      <BlockContainer className="register-card">
        <TextBoldFontsize24>Register an Account</TextBoldFontsize24>
        <FlexContainer className="button-group">
          <Text>User ID</Text>
          <StyledTextFieldOutlinedSmall name="userId" onChange={handleOnChange} />
        </FlexContainer>
        <FlexContainer className="button-group">
          <Text>PIN</Text>
          <StyledTextFieldOutlinedSmall name="pin" onChange={handleOnChange} />
        </FlexContainer>
        <FlexContainer className="button-group">
          <Text>Name</Text>
          <StyledTextFieldOutlinedSmall name="name" onChange={handleOnChange} />
        </FlexContainer>
        <FlexContainer className="button-group">
          <Text>Amount</Text>
          <StyledTextFieldOutlinedSmall name="amount" onChange={handleOnChange} />
        </FlexContainer>
        <FlexContainer style={{ justifyContent: "center" }}>
          {isError && <TextRed>User already exists</TextRed>}
        </FlexContainer>
        <FlexContainer className="navigation-button-group">
          <ButtonGray onClick={handleOnclickCancel}>Cancel</ButtonGray>
          <ButtonRed onClick={handleOnClickRegister}>Register</ButtonRed>
        </FlexContainer>
      </BlockContainer>
    </Dialog>
  );
};
