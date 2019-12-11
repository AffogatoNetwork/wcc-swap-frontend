import React, { Component } from "react";
import { Button, Box, Card, Heading, Image, Flex } from "rimble-ui";
import Checkout from "./Checkout";
import { amountFormatter } from "../factory";
import useAxios from "axios-hooks";

require("dotenv").config();

export default function CoffeeActions({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  totalSupply,
  reserveWCCToken,
  reserveWCCETH,    
  calculateEthPrice,
  currentTransactionHash,
  currentTransactionType,
  currentTransactionAmount,
  setCurrentTransaction,
  clearCurrentTransaction,
  setShowConnect
}) {
  let usdBalance = 0;
  let ethPrice = 0;
  const [{ data, loading, error }, refetch] = useAxios(
    "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,USD"
  );

  if (data && reserveWCCETH && reserveWCCToken) {
    ethPrice = amountFormatter(calculateEthPrice(reserveWCCETH, reserveWCCToken), 18, 3);
    let ethPrice2 = amountFormatter(calculateEthPrice(reserveWCCETH, reserveWCCToken), 18, 5);
    usdBalance = parseFloat(ethPrice2 * data.USD).toFixed(2);
  }

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
          ethPrice={ethPrice}
          usdBalance={usdBalance}
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
