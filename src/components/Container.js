import React, { Component, useState, useCallback } from "react";
import { useWeb3Context } from "web3-react";
import { useAppContext } from '../context'
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
  ready,
  unlock,
  validateBuy,
  buy,

  totalSupply,
  dollarPrice,
  reserveWCCToken,
  reserveWCCETH,
  calculateEthPrice,
  accountBalance
}) {
  const { account } = useWeb3Context();
  const [currentTransaction, _setCurrentTransaction] = useState({})
  const setCurrentTransaction = useCallback((hash, type, amount) => {
    _setCurrentTransaction({ hash, type, amount })
  }, [])
  const clearCurrentTransaction = useCallback(() => {
    _setCurrentTransaction({})
  }, [])
  const [state, setState] = useAppContext()
  const [showConnect, setShowConnect] = useState(false);

  if (!coffeeHash) {
    return <Heading.h3>Loading...</Heading.h3>;
  }

  return (
    <span className="wrapper">
      <HeaderBar
        setShowConnect={setShowConnect}
        accountBalance={accountBalance}
      />
      <Heading.h1>Dynamic Priced Coffee Sale</Heading.h1>
      <Heading.h4>Invest, Trade, Redeem and Brew your Coffee</Heading.h4>
      <div className="coffee-container">
        <CoffeeCard
          coffeeHash={coffeeHash}
          selectedTokenSymbol={selectedTokenSymbol}
          setSelectedTokenSymbol={setSelectedTokenSymbol}
          ready={ready}
          unlock={unlock}
          validateBuy={validateBuy}
          buy={buy}
          totalSupply={totalSupply}
          dollarPrice={dollarPrice}
          reserveWCCToken={reserveWCCToken}
          reserveWCCETH={reserveWCCETH}
          calculateEthPrice={calculateEthPrice}
          currentTransactionHash={currentTransaction.hash}
          currentTransactionType={currentTransaction.type}
          currentTransactionAmount={currentTransaction.amount}
          setCurrentTransaction={setCurrentTransaction}
          clearCurrentTransaction={clearCurrentTransaction}
          setShowConnect={setShowConnect}
          showConnect  
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
