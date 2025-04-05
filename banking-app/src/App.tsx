import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Welcome } from "./components/Welcome";
import { Home } from "./components/Home";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Welcome} />
        <Route path="home" Component={Home} />
      </Routes>
    </BrowserRouter>
  );
};
