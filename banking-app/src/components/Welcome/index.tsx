import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { ACTION } from "../../redux/reducer";
import { authenticateUser } from "../../service";
import { Register } from "../Register";
import { StyledTextFieldStandardSmall } from "../../ui/TextField";
import { ButtonBlack, ButtonRed } from "../../ui/Button";
import { FlexContainer } from "../../ui/Container";
import WelcomeImage from "../../assets/welcome.png";
import Logo from "../../assets/logo.png";

import "./styles.css";

interface FormValues {
  userId: string;
  pin: string;
}

export const Welcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    userId: "",
    pin: "",
  });

  const handleOnClickLogin = async () => {
    const result = await authenticateUser(formValues.userId, formValues.pin);
    if (result) {
      dispatch({ type: ACTION.ADD_USER, payload: result });
      navigate("/home");
    } else {
      setIsError(true);
    }
  };

  const handleOnClickRegister = () => {
    setIsOpen(true);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isError) {
      setIsError(false);
    }
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <div>
      <Snackbar
        open={openAlert}
        onClose={handleCloseAlert}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={handleCloseAlert}>
          Account created successfully!
        </Alert>
      </Snackbar>
      <Register isOpen={isOpen} setIsOpen={setIsOpen} setOpenAlert={setOpenAlert} />
      <FlexContainer
        className="welcome-page"
        style={{
          backgroundImage: `url(${WelcomeImage})`,
        }}
      >
        <div className="welcome-page-card">
          <div className="welcome-page-card-content">
            <img src={Logo} alt="logo" style={{ maxWidth: "50%" }} />
            <div className="text-field-container">
              <StyledTextFieldStandardSmall
                name="userId"
                label="User ID"
                error={isError}
                onChange={handleOnChange}
              />
              <StyledTextFieldStandardSmall
                name="pin"
                label="PIN"
                error={isError}
                helperText={isError && "Incorrect User ID or PIN."}
                onChange={handleOnChange}
              />
            </div>
            <ButtonRed className="login-button" onClick={handleOnClickLogin}>
              LOGIN
            </ButtonRed>
            <ButtonBlack className="register-button" onClick={handleOnClickRegister}>
              REGISTER
            </ButtonBlack>
          </div>
        </div>
      </FlexContainer>
    </div>
  );
};
