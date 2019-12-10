import React, { Component } from "react";
import { Button, Box, Card, Heading, Image, Flex } from "rimble-ui";
import contentStrings from "../constants/Localization";
import Checkout from "./Checkout";
import RedeemCoffee from "./RedeemCoffee";
require("dotenv").config();

export default function CoffeeActions({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  totalSupply,
  dollarize,
  dollarPrice,
  reserveWCCToken,
  pending,
  currentTransactionHash,
  currentTransactionType,
  currentTransactionAmount,
  setCurrentTransaction,
  clearCurrentTransaction,
  setShowConnect
}) {
  return (
    <div className="coffee-actions">
      <Checkout
          selectedTokenSymbol={selectedTokenSymbol}
          setSelectedTokenSymbol={setSelectedTokenSymbol}
          ready={ready}  
          unlock={unlock}
          validateBuy={validateBuy}
          buy={buy}  
          totalSupply={totalSupply}
          dollarize={dollarize}
          dollarPrice={dollarPrice}
          reserveWCCToken={reserveWCCToken}
          currentTransactionHash={currentTransactionHash}
          currentTransactionType={currentTransactionType}
          currentTransactionAmount={currentTransactionAmount}
          setCurrentTransaction={setCurrentTransaction}
          clearCurrentTransaction={clearCurrentTransaction}
          setShowConnect={setShowConnect}
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
