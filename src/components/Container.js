import React, { Component, useState, useCallback } from "react";
import { useWeb3Context } from "web3-react";
import { useAppContext } from '../context'
import HeaderBar from "./HeaderBar";
import CoffeeCard from "./CoffeeCard";
import CoffeeActions from "./CoffeeActions";
import { Heading } from "rimble-ui";
import affogato_horizontal from "../assets/affogato-horizontal.png";
import nativo from "../assets/nativo.jpg";
import Loading from "./Loading";
import useAxios from "axios-hooks";

export default function Container({
  coffeeHash = "",
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
  //let coffeeInfo
  const [{ data, loading, error }, refetch] = useAxios(
    `https://ipfs.infura.io/ipfs/${coffeeHash}`
  );

  if (!coffeeHash) {
    return <Loading />;
  }

  // TODO: Change loader to contexct
  if (loading) {
    return <Loading />;
  }
  if (error) return <Heading.h3>Error...</Heading.h3>;

  return (
    <span className="wrapper">
      <HeaderBar
        setShowConnect={setShowConnect}
        accountBalance={accountBalance}
      />
      <Heading.h1 variant="primary">Dynamic Priced Coffee Sale</Heading.h1>
      <Heading.h4>Invest, Trade, Redeem and Brew your Coffee</Heading.h4>
      <div className="coffee-container">
        <CoffeeCard
          coffeeData={data}
          selectedTokenSymbol={selectedTokenSymbol}
          setSelectedTokenSymbol={setSelectedTokenSymbol}
          ready={ready}
          unlock={unlock}
          validateBuy={validateBuy}
          buy={buy}
          totalSupply={totalSupply}
          reserveWCCToken={reserveWCCToken}
          reserveWCCETH={reserveWCCETH}
          calculateEthPrice={calculateEthPrice}
          currentTransactionHash={currentTransaction.hash}
          currentTransactionType={currentTransaction.type}
          currentTransactionAmount={currentTransaction.amount}
          setCurrentTransaction={setCurrentTransaction}
          clearCurrentTransaction={clearCurrentTransaction}
          setShowConnect={setShowConnect}
        />
        <CoffeeActions
            coffeeData={data}
            selectedTokenSymbol={selectedTokenSymbol}
            setSelectedTokenSymbol={setSelectedTokenSymbol}
            ready={ready}
            unlock={unlock}
            validateBuy={validateBuy}
            buy={buy}
            totalSupply={totalSupply}
            reserveWCCToken={reserveWCCToken}
            reserveWCCETH={reserveWCCETH}
            calculateEthPrice={calculateEthPrice}
            currentTransactionHash={currentTransaction.hash}
            currentTransactionType={currentTransaction.type}
            currentTransactionAmount={currentTransaction.amount}
            setCurrentTransaction={setCurrentTransaction}
            clearCurrentTransaction={clearCurrentTransaction}
            setShowConnect={setShowConnect}
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
