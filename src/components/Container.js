import React, { Component, useState, useCallback } from "react";
import { useWeb3Context } from "web3-react";
import HeaderBar from "./HeaderBar";
import CoffeeCard from "./CoffeeCard";
import CoffeeActions from "./CoffeeActions";
import { Heading } from "rimble-ui";
import affogato_horizontal from "../assets/affogato-horizontal.png";
import nativo from "../assets/nativo.jpg";

export default function Container({ 
  coffeeHash, 
  selectedTokenSymbol, 
  setSelectedTokenSymbol, 
  validateBuy,
  totalSupply, 
  dollarPrice, 
  reserveWCCToken, 
  reserveWCCETH, 
  calculateEthPrice
 }) {
  const { account } = useWeb3Context();
  const [showConnect, setShowConnect] = useState(false);

  if (!coffeeHash) {
    return <Heading.h3>Loading...</Heading.h3>;
  }

  return (
    <span className="wrapper">
      <HeaderBar setShowConnect={setShowConnect} />
      <Heading.h1>Dynamic Priced Coffee Sale</Heading.h1>
      <Heading.h4>Invest, Trade, Redeem and Brew your Coffee</Heading.h4>
      <div className="coffee-container">
        <CoffeeCard 
          coffeeHash={coffeeHash} 
          selectedTokenSymbol={selectedTokenSymbol}
          setSelectedTokenSymbol={setSelectedTokenSymbol}
          validateBuy={validateBuy}
          totalSupply={totalSupply} 
          dollarPrice={dollarPrice}
          reserveWCCToken={reserveWCCToken}
          reserveWCCETH={reserveWCCETH}
          calculateEthPrice={calculateEthPrice} 
        />
        <CoffeeActions 
          coffeeHash={coffeeHash} 
          selectedTokenSymbol={selectedTokenSymbol}
          setSelectedTokenSymbol={setSelectedTokenSymbol}
          validateBuy={validateBuy}
          totalSupply={totalSupply} 
          dollarPrice={dollarPrice}
          reserveWCCToken={reserveWCCToken}
          reserveWCCETH={reserveWCCETH}
        />
      </div>
      <div className="credits">
        <div>
          <p>Brought to you by</p>
        </div>
        <div className="logos">
          <img src={affogato_horizontal} alt="affogato" className="affogato" />
          <b>+</b>
          <img src={nativo} alt="nativo" className="nativo" />
        </div>
      </div>
    </span>
  );
}
