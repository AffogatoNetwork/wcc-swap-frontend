import React from "react";
import { Button, Heading } from "rimble-ui";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";
import { amountFormatter } from "../factory";
import Checkout from "./Checkout";
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
    console.log("USD " + data);
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
          Honduran {coffeeData.coffee.Variety}
        </Heading.h4>
        <Heading.h6 textAlign="left">{coffeeData.coffee.notes}</Heading.h6>
        <Heading.h2 color={colors.brown.base} textAlign="left">
          Premium Specialty Coffee
        </Heading.h2>
        <p>
          This single-origin premium lot from producer Raul Manueles was
          tokenized into <b>CAFE</b> tokens using{" "}
          <a
            href="https://chai.money/about"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chai
          </a>{" "}
          as collateral and added to a pool in{" "}
          <a
            href="https://uniswap.io/"
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
          Read all the details <a href="#"> over here</a>
        </p>
      </div>
      <div className="product-details">
        <ul>
          <li>
            <Heading.h5>Redem Details</Heading.h5>28 kg,{" "}
            {coffeeData.coffee.Process}, Medium roast
          </li>
          {/* <li>
            <Heading.h5>Process</Heading.h5> {coffeeData.coffee.Process}
          </li> */}
          <li>
            <Heading.h5>Specialty Coffee Score</Heading.h5>
            {coffeeData.coffee.score}
            /100
          </li>
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
        <Heading.h5 color={colors.brown.text}>
          {reserveWCCToken &&
            `${amountFormatter(reserveWCCToken, 18, 0)} / ${totalSupply} ${
              contentStrings.available
            }`}
        </Heading.h5>
        <div className="button-wrapper">
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
          <Button
            as="a"
            href={`${process.env.REACT_APP_UNISWAP_URL}/swap?inputCurrency=${process.env.REACT_APP_WCC_ADDRESS}`}
            target="\_blank"
            variant="custom"
            className="trade"
          >
            Swap
          </Button>
        </div>
      </div>
    </div>
  );
}
