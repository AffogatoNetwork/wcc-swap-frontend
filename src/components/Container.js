import React, { Component, useState, useCallback } from "react";
import { useWeb3Context } from "web3-react";
import HeaderBar from "./HeaderBar";
import CoffeeCard from "./CoffeeCard";
import CoffeeActions from "./CoffeeActions";
import { Heading } from "rimble-ui";

export default function Container({ coffeeHash, selectedTokenSymbol, setSelectedTokenSymbol, totalSupply, dollarPrice, reserveWCCToken }) {
  const { account } = useWeb3Context();
  const [showConnect, setShowConnect] = useState(false);

  const coffeeBagInfo = {
    price: 25.98,
    available: 90,
    total: 100
  };
  if (!coffeeHash) {
    return <Heading.h3>Loading...</Heading.h3>;
  }

  return (
    <>
      <HeaderBar setShowConnect={setShowConnect} />
      <div className="coffee-container">
        <CoffeeCard 
            coffeeHash={coffeeHash} 
            totalSupply={totalSupply} 
            dollarPrice={dollarPrice}            
            reserveWCCToken={reserveWCCToken} 
        />
        <CoffeeActions 
            totalSupply={totalSupply} 
            selectedTokenSymbol={selectedTokenSymbol}
            setSelectedTokenSymbol={setSelectedTokenSymbol}
            dollarPrice={dollarPrice}            
            reserveWCCToken={reserveWCCToken}
            coffeeBagInfo={coffeeBagInfo} 
        />
      </div>
    </>
  );
}
