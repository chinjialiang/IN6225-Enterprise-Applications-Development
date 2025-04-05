import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ACTION } from "../../redux/reducer";
import { Button } from "@mui/material";
import { BlockContainer, FlexContainer } from "../../ui/Container";
import Icon from "../../assets/dbs.png";
import LogoutIcon from "@mui/icons-material/Logout";

import "./styles.css";

interface NavbarProps {
  setIsOpen: (isOpen: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOnClickLogout = () => {
    dispatch({ type: ACTION.REMOVE_TRANSACTIONS });
    dispatch({ type: ACTION.REMOVE_TRANSACTIONS });
    navigate("/");
  };

  const handleOnClickTransfer = () => {
    setIsOpen(true);
  };
  return (
    <BlockContainer className="nav-bar">
      <FlexContainer className="nav-bar-content-top">
        <img src={Icon} alt="icon" height="80%" />
        <Button className="logout-button" endIcon={<LogoutIcon />} onClick={handleOnClickLogout}>
          Logout
        </Button>
      </FlexContainer>
      <FlexContainer className="nav-bar-content-bottom">
        <Button className="view-button">
          <p className="main-header">My Accounts</p>
          <p className="sub-header">Summary</p>
        </Button>
        <Button className="view-button" onClick={handleOnClickTransfer}>
          <p className="main-header">Transfer</p>
          <p className="sub-header">Local or Overseas</p>
        </Button>
        <Button className="view-button">
          <p className="main-header">Pay</p>
          <p className="sub-header">Bills and Cards</p>
        </Button>
        <Button className="view-button">
          <p className="main-header">Cards</p>
          <p className="sub-header">Activate and Manage</p>
        </Button>
        <Button className="view-button">
          <p className="main-header">Plan</p>
          <p className="sub-header">Your Finances</p>
        </Button>
        <Button className="view-button">
          <p className="main-header">Invest</p>
          <p className="sub-header">Manage your Wealth</p>
        </Button>
        <Button className="view-button">
          <p className="main-header">Apply</p>
          <p className="sub-header">New Products</p>
        </Button>
        <Button className="view-button">
          <p className="main-header">Request</p>
          <p className="sub-header">Statement or Services</p>
        </Button>
      </FlexContainer>
    </BlockContainer>
  );
};
