import React, { useState } from "react";
import { Navbar } from "../Navbar";
import { Summary } from "../Summary";
import { Transfer } from "../Transfer";
import { Transactions } from "../Transactions";
import Banner from "../../assets/banner.png";
import "./styles.css";

export const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="home-page">
      <Transfer isOpen={isOpen} setIsOpen={setIsOpen} />
      <Navbar setIsOpen={setIsOpen} />
      <Summary />
      <Transactions />
      <img src={Banner} alt="banner" />
    </div>
  );
};
