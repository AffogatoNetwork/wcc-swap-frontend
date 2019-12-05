import React, { Component } from "react";
import { Button, Box, Card, Heading, Image, Flex } from "rimble-ui";
import contentStrings from "../constants/Localization";
import BuyCoffee from "./BuyCoffee";
import RedeemCoffee from "./RedeemCoffee";

class CoffeeActions extends Component {
  render() {
    return (
      <div className="coffee-actions">
        <BuyCoffee coffeeBagInfo={this.props.coffeeBagInfo} />

        <div className="button-wrapper">
          <Button variant="custom" className="sell">
            Swap
          </Button>
        </div>
        {/* <RedeemCoffee /> */}
      </div>
    );
  }
}

export default CoffeeActions;
