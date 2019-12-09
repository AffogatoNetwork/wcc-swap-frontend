import React, { Component } from "react";
import { Button, Box, Card, Heading, Image, Flex } from "rimble-ui";
import contentStrings from "../constants/Localization";
import BuyCoffee from "./BuyCoffee";
import RedeemCoffee from "./RedeemCoffee";
require("dotenv").config();

export default function CoffeeActions({
  coffeeHash,
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  validateBuy,
  totalSupply,
  dollarPrice,
  reserveWCCToken,
  reserveWCCETH
}) {
  return (
    <div className="coffee-actions">
      <BuyCoffee
        selectedTokenSymbol={selectedTokenSymbol}
        setSelectedTokenSymbol={setSelectedTokenSymbol}
        validateBuy={validateBuy}
        totalSupply={totalSupply}
        dollarPrice={dollarPrice}
        reserveWCCToken={reserveWCCToken}
      />

      <div className="button-wrapper">
        <Button
          as="a"
          href={`${process.env.REACT_APP_UNISWAP_URL}/swap?inputCurrency=${process.env.REACT_APP_WCC_ADDRESS}`}
          target="\_blank"
          variant="custom"
          className="sell"
        >
          Swap
        </Button>
      </div>
      {/* <RedeemCoffee /> */}
    </div>
  );
}
