import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./common/Header";
import Footer from "./common/Footer";

const RootLayout = () => {
  return (
    <div>
      <Header />
      <div style={{ minHeight: "90vh" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
  