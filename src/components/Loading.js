import React from "react";
import loading from "../assets/coffee-glass.png";
import { Heading } from "rimble-ui";
import "./Loading.scss";

const Loading = () => (
  <div className="loading-wrapper">
    <img src={loading} alt="loading..." className="breathing-icon" />
    <Heading.h3>Loading...</Heading.h3>
  </div>
);

export default Loading;
