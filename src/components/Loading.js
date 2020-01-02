import React from "react";
import loading from "../assets/coffee-glass.png";
import "./Loading.scss";

const Loading = () => (
  <div className="loading-wrapper">
    <img src={loading} alt="loading..." className="breathing-icon" />
    <h3>Loading...</h3>
  </div>
);

export default Loading;
