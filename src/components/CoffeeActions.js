import React, { Component } from "react";
import { Button, Box, Card, Heading, Image, Flex } from "rimble-ui";
import contentStrings from "../constants/Localization";
import BuyCoffee from "./BuyCoffee";
import RedeemCoffee from "./RedeemCoffee";

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
          <Button variant="custom" className="sell">
            Swap
          </Button>
        </div>
        {/* <RedeemCoffee /> */}
    </div>    
  );  
}

