import React from "react";
import { Button, Heading } from "rimble-ui";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";
import { amountFormatter } from "../factory";
import Checkout from "./Checkout";
import Redeem from "./Redeem";
import "../App.scss";
import drip from "../assets/drip.png";
import pour from "../assets/pour.png";
import useAxios from "axios-hooks";

require("dotenv").config();

export default function CoffeeCard({
  coffeeData,
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  burn,
  accountBalance,
  totalSupply,
  reserveWCCToken,
  reserveWCCETH,
  calculateEthPrice,
  currentTransactionHash,
  currentTransactionType,
  currentTransactionAmount,
  setCurrentTransaction,
  clearCurrentTransaction,
  setShowConnect,
  web3Connect,
  provider,
  setProvider,
  account,
  setAccount
}) {
  let { coffee, farmer } = coffeeData;
  let cupProfile = coffee.cupProfile[0];
  let usdBalance = 0;
  let ethPrice = 0;
  const [{ data, loading, error }, refetch] = useAxios(
    "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,USD"
  );

  if (data && reserveWCCETH && reserveWCCToken) {
    ethPrice = amountFormatter(
      calculateEthPrice(reserveWCCETH, reserveWCCToken),
      18,
      3
    );
    let ethPrice2 = amountFormatter(
      calculateEthPrice(reserveWCCETH, reserveWCCToken),
      18,
      5
    );
    usdBalance = parseFloat(ethPrice2 * data.USD).toFixed(2);
  }

  return (
    <div className="coffee-card">
      <div className="coffee-image"></div>
      <div className="product-title">
        <Heading.h4 color={colors.brown.base} textAlign="left">
          Honduran {coffee.variety}
        </Heading.h4>
        <Heading.h6 textAlign="left" color="#b4600b">
          {cupProfile.notes}
        </Heading.h6>
        <Heading.h2 color={colors.brown.base} textAlign="left">
          Premium Specialty Coffee
        </Heading.h2>
        <p>
          This single-origin premium lot from producer <i>{farmer.name}</i> was
          tokenized into <b>CAFE</b> tokens using{" "}
          <a
            href="https://makerdao.com/en/"
            target="_blank"
            rel="noopener noreferrer"
          >
            DAI
          </a>{" "}
          as collateral and added to a pool in{" "}
          <a
            href={`${process.env.REACT_APP_UNISWAP_URL}/swap?inputCurrency=${process.env.REACT_APP_WCC_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Uniswap
          </a>
          . You can redeem the <b>CAFE</b> for one bag of freshly roasted
          specialty coffee.
        </p>
        <p>
          Learn more{" "}
          <a
            href="https://medium.com/affogato-network/cafe-dynamically-priced-coffee-fc1d0a5ec98d"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            here
          </a>
        </p>
      </div>
      <div className="product-details">
        <ul>
          <li>
            <Heading.h5>Cup Profile</Heading.h5>
            {cupProfile.aroma}{" "}
            <a
              className="cup-profile"
              href="https://profile.affogato.co/QmdPAaN2uVUuLBY3RpWrmQADYn8pcShaZGt16vWQcaZRAm"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              See complete profile
            </a>
          </li>
          <li>
            <Heading.h5>Package</Heading.h5>340g, {coffee.process},{" "}
            {coffee.actions[0].description} Roast
          </li>
          {/* <li>
            <Heading.h5>Process</Heading.h5> {coffee.Process}
          </li> */}
          {/* <li>
            <Heading.h5>Specialty Coffee Score</Heading.h5>
            {coffee.elevation}
            /100
          </li> */}
          <li>
            <Heading.h5>Best for</Heading.h5>
            <img src={pour} alt="pour over coffee" className="pour" />
            <img src={drip} alt="drip machine" className="drip" />
          </li>
        </ul>
        <Heading.h4 color={colors.brown.base}>
          {reserveWCCToken &&
            reserveWCCETH &&
            `${ethPrice} ETH / $${usdBalance}`}
        </Heading.h4>
        <Heading.h5 color="#b4600b">
          {reserveWCCToken &&
            `${amountFormatter(reserveWCCToken, 18, 0)} / ${totalSupply} ${
              contentStrings.available
            }`}
        </Heading.h5>
        <div className="button-wrapper mb-3">
          <Redeem burn={burn} balanceCAFE={accountBalance} account={account} />
          <Checkout
            selectedTokenSymbol={selectedTokenSymbol}
            setSelectedTokenSymbol={setSelectedTokenSymbol}
            ready={ready}
            unlock={unlock}
            validateBuy={validateBuy}
            buy={buy}
            totalSupply={totalSupply}
            ethPrice={ethPrice}
            ethToUSD={data}
            reserveWCCToken={reserveWCCToken}
            currentTransactionHash={currentTransactionHash}
            currentTransactionType={currentTransactionType}
            currentTransactionAmount={currentTransactionAmount}
            setCurrentTransaction={setCurrentTransaction}
            clearCurrentTransaction={clearCurrentTransaction}
            setShowConnect={setShowConnect}
            web3Connect={web3Connect}
            provider={provider}
            setProvider={setProvider}
            account={account}
            setAccount={setAccount}
          />
          {/* <Button
            as="a"
            href={`${process.env.REACT_APP_UNISWAP_URL}/swap?inputCurrency=${process.env.REACT_APP_WCC_ADDRESS}`}
            target="\_blank"
            variant="primary"
            className="trade"
          >
            Swap
          </Button> */}
        </div>
      </div>
    </div>
  );
}
