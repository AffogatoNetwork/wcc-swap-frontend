import React, { useState, useCallback, useEffect } from "react";
import { useWeb3Context } from "web3-react";
import { ethers } from "ethers";

import { TOKEN_SYMBOLS, TOKEN_ADDRESSES, ERROR_CODES } from "../factory";
import {
  useTokenContract,
  useExchangeContract,
  useAddressBalance,
  useAddressAllowance,
  useExchangeReserves,
  useExchangeAllowance,
  useTotalSupply,
  useGetCoffeeInformation
} from "../hooks";
import Container from "./Container";

//import Stats from '../Stats'
//import Status from '../Status'

// denominated in bips
const GAS_MARGIN = ethers.utils.bigNumberify(1000);

export function calculateGasMargin(value, margin) {
  const offset = value.mul(margin).div(ethers.utils.bigNumberify(10000));
  return value.add(offset);
}

// denominated in seconds
const DEADLINE_FROM_NOW = 60 * 15;

// denominated in bips
const ALLOWED_SLIPPAGE = ethers.utils.bigNumberify(200);

function calculateSlippageBounds(value) {
  const offset = value
    .mul(ALLOWED_SLIPPAGE)
    .div(ethers.utils.bigNumberify(10000));
  const minimum = value.sub(offset);
  const maximum = value.add(offset);
  return {
    minimum: minimum.lt(ethers.constants.Zero)
      ? ethers.constants.Zero
      : minimum,
    maximum: maximum.gt(ethers.constants.MaxUint256)
      ? ethers.constants.MaxUint256
      : maximum
  };
}

// this mocks the getInputPrice function, and calculates the required output
function calculateEtherTokenOutputFromInput(
  inputAmount,
  inputReserve,
  outputReserve
) {
  const inputAmountWithFee = inputAmount.mul(ethers.utils.bigNumberify(997));
  const numerator = inputAmountWithFee.mul(outputReserve);
  const denominator = inputReserve
    .mul(ethers.utils.bigNumberify(1000))
    .add(inputAmountWithFee);
  return numerator.div(denominator);
}

// this mocks the getOutputPrice function, and calculates the required input
function calculateEtherTokenInputFromOutput(
  outputAmount,
  inputReserve,
  outputReserve
) {
  const numerator = inputReserve
    .mul(outputAmount)
    .mul(ethers.utils.bigNumberify(1000));
  const denominator = outputReserve
    .sub(outputAmount)
    .mul(ethers.utils.bigNumberify(997));
  return numerator.div(denominator).add(ethers.constants.One);
}

// get exchange rate for a token/ETH pair
function getExchangeRate(inputValue, outputValue, invert = false) {
  const inputDecimals = 18;
  const outputDecimals = 18;

  if (inputValue && inputDecimals && outputValue && outputDecimals) {
    const factor = ethers.utils
      .bigNumberify(10)
      .pow(ethers.utils.bigNumberify(18));

    if (invert) {
      return inputValue
        .mul(factor)
        .div(outputValue)
        .mul(
          ethers.utils
            .bigNumberify(10)
            .pow(ethers.utils.bigNumberify(outputDecimals))
        )
        .div(
          ethers.utils
            .bigNumberify(10)
            .pow(ethers.utils.bigNumberify(inputDecimals))
        );
    } else {
      return outputValue
        .mul(factor)
        .div(inputValue)
        .mul(
          ethers.utils
            .bigNumberify(10)
            .pow(ethers.utils.bigNumberify(inputDecimals))
        )
        .div(
          ethers.utils
            .bigNumberify(10)
            .pow(ethers.utils.bigNumberify(outputDecimals))
        );
    }
  }
}

//get ETH price
function calculateEthPrice(reserveWCCETH, reserveWCCToken) {
  const amount = calculateEtherTokenInputFromOutput(
    ethers.utils.parseUnits("1", 18),
    reserveWCCETH,
    reserveWCCToken
  );

  return amount;
}

function calculateAmount(
  inputTokenSymbol,
  outputTokenSymbol,
  WCCAmount,
  reserveWCCETH,
  reserveWCCToken,
  reserveSelectedTokenETH,
  reserveSelectedTokenToken
) {
  // eth to token - buy
  if (
    inputTokenSymbol === TOKEN_SYMBOLS.ETH &&
    outputTokenSymbol === TOKEN_SYMBOLS.WCC
  ) {
    const amount = calculateEtherTokenInputFromOutput(
      WCCAmount,
      reserveWCCETH,
      reserveWCCToken
    );
    if (
      amount.lte(ethers.constants.Zero) ||
      amount.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }
    return amount;
  }

  // token to eth - sell
  if (
    inputTokenSymbol === TOKEN_SYMBOLS.WCC &&
    outputTokenSymbol === TOKEN_SYMBOLS.ETH
  ) {
    const amount = calculateEtherTokenOutputFromInput(
      WCCAmount,
      reserveWCCToken,
      reserveWCCETH
    );
    if (
      amount.lte(ethers.constants.Zero) ||
      amount.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }

    return amount;
  }

  // token to token - buy or sell
  const buyingWCC = outputTokenSymbol === TOKEN_SYMBOLS.WCC;

  if (buyingWCC) {
    // eth needed to buy x WCC
    const intermediateValue = calculateEtherTokenInputFromOutput(
      WCCAmount,
      reserveWCCETH,
      reserveWCCToken
    );
    // calculateEtherTokenOutputFromInput
    if (
      intermediateValue.lte(ethers.constants.Zero) ||
      intermediateValue.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }
    // tokens needed to buy x eth
    const amount = calculateEtherTokenInputFromOutput(
      intermediateValue,
      reserveSelectedTokenToken,
      reserveSelectedTokenETH
    );
    if (
      amount.lte(ethers.constants.Zero) ||
      amount.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }
    return amount;
  } else {
    // eth gained from selling x WCC
    const intermediateValue = calculateEtherTokenOutputFromInput(
      WCCAmount,
      reserveWCCToken,
      reserveWCCETH
    );
    if (
      intermediateValue.lte(ethers.constants.Zero) ||
      intermediateValue.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }
    // tokens yielded from selling x eth
    const amount = calculateEtherTokenOutputFromInput(
      intermediateValue,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken
    );
    if (
      amount.lte(ethers.constants.Zero) ||
      amount.gte(ethers.constants.MaxUint256)
    ) {
      throw Error();
    }
    return amount;
  }
}

export default function Main({
  stats,
  status,
  web3Connect,
  account,
  setAccount,
  provider,
  setProvider
}) {
  let { library } = useWeb3Context();

  // selected token
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(
    TOKEN_SYMBOLS.ETH
  );
  //TODO: Hacer cambios aca
  // get exchange contracts
  if (provider) {
    library = provider;
  }

  let exchangeContractWCC = useExchangeContract(
    library,
    account,
    TOKEN_ADDRESSES.WCC
  );

  const exchangeContractSelectedToken = useExchangeContract(
    library,
    account,
    TOKEN_ADDRESSES[selectedTokenSymbol]
  );
  const exchangeContractDAI = useExchangeContract(
    library,
    account,
    TOKEN_ADDRESSES.DAI
  );

  // get token contracts
  const tokenContractWCC = useTokenContract(TOKEN_ADDRESSES.WCC);
  const tokenContractSelectedToken = useTokenContract(
    TOKEN_ADDRESSES[selectedTokenSymbol]
  );

  // get balances
  const balanceETH = useAddressBalance(account, TOKEN_ADDRESSES.ETH);
  const balanceWCC = useAddressBalance(account, TOKEN_ADDRESSES.WCC);
  const balanceSelectedToken = useAddressBalance(
    account,
    TOKEN_ADDRESSES[selectedTokenSymbol]
  );

  // totalsupply
  const totalSupply = useTotalSupply(tokenContractWCC);

  //coffee Hash
  const coffeeHash = useGetCoffeeInformation(tokenContractWCC);

  // get allowances
  const allowanceWCC = useAddressAllowance(
    account,
    TOKEN_ADDRESSES.WCC,
    exchangeContractWCC && exchangeContractWCC.address
  );
  const allowanceSelectedToken = useExchangeAllowance(
    account,
    TOKEN_ADDRESSES[selectedTokenSymbol]
  );

  // get reserves
  const reserveWCCETH = useAddressBalance(
    exchangeContractWCC && exchangeContractWCC.address,
    TOKEN_ADDRESSES.ETH
  );
  const reserveWCCToken = useAddressBalance(
    exchangeContractWCC && exchangeContractWCC.address,
    TOKEN_ADDRESSES.WCC
  );
  const {
    reserveETH: reserveSelectedTokenETH,
    reserveToken: reserveSelectedTokenToken
  } = useExchangeReserves(TOKEN_ADDRESSES[selectedTokenSymbol]);

  const reserveDAIETH = useAddressBalance(
    exchangeContractDAI && exchangeContractDAI.address,
    TOKEN_ADDRESSES.ETH
  );
  const reserveDAIToken = useAddressBalance(
    exchangeContractDAI && exchangeContractDAI.address,
    TOKEN_ADDRESSES.DAI
  );

  const [USDExchangeRateETH, setUSDExchangeRateETH] = useState();
  const [
    USDExchangeRateSelectedToken,
    setUSDExchangeRateSelectedToken
  ] = useState();

  const ready = !!(
    (account === null || allowanceWCC) &&
    (selectedTokenSymbol === "ETH" ||
      account === null ||
      allowanceSelectedToken) &&
    (account === null || balanceETH) &&
    (account === null || balanceWCC) &&
    (account === null || balanceSelectedToken) &&
    reserveWCCETH &&
    reserveWCCToken &&
    (selectedTokenSymbol === "ETH" || reserveSelectedTokenETH) &&
    (selectedTokenSymbol === "ETH" || reserveSelectedTokenToken) &&
    selectedTokenSymbol &&
    (USDExchangeRateETH || USDExchangeRateSelectedToken)
  );

  useEffect(() => {
    try {
      const exchangeRateDAI = getExchangeRate(reserveDAIETH, reserveDAIToken);
      //console.log('Contract: ' + exchangeContractDAI);

      if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
        setUSDExchangeRateETH(exchangeRateDAI);
      } else {
        const exchangeRateSelectedToken = getExchangeRate(
          reserveSelectedTokenETH,
          reserveSelectedTokenToken
        );
        if (exchangeRateDAI && exchangeRateSelectedToken) {
          setUSDExchangeRateSelectedToken(
            exchangeRateDAI
              .mul(
                ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18))
              )
              .div(exchangeRateSelectedToken)
          );
        }
      }
    } catch {
      setUSDExchangeRateETH();
      setUSDExchangeRateSelectedToken();
    }
  }, [
    reserveDAIETH,
    reserveDAIToken,
    reserveSelectedTokenETH,
    reserveSelectedTokenToken,
    selectedTokenSymbol
  ]);

  function _dollarize(amount, exchangeRate) {
    return amount
      .mul(exchangeRate)
      .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18)));
  }

  function dollarize(amount) {
    return _dollarize(
      amount,
      selectedTokenSymbol === TOKEN_SYMBOLS.ETH
        ? USDExchangeRateETH
        : USDExchangeRateSelectedToken
    );
  }

  const [dollarPrice, setDollarPrice] = useState();
  useEffect(() => {
    try {
      const WCCExchangeRateETH = getExchangeRate(
        reserveWCCToken,
        reserveWCCETH
      );
      setDollarPrice(
        WCCExchangeRateETH.mul(USDExchangeRateETH).div(
          ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18))
        )
      );
    } catch {
      setDollarPrice();
    }
  }, [USDExchangeRateETH, reserveWCCETH, reserveWCCToken]);

  async function unlock(buyingWCC = true) {
    const contract = buyingWCC ? tokenContractSelectedToken : tokenContractWCC;
    const spenderAddress = buyingWCC
      ? exchangeContractSelectedToken.address
      : exchangeContractWCC.address;

    const estimatedGasLimit = await contract.estimate.approve(
      spenderAddress,
      ethers.constants.MaxUint256
    );
    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice =>
        gasPrice
          .mul(ethers.utils.bigNumberify(150))
          .div(ethers.utils.bigNumberify(100))
      );

    return contract.approve(spenderAddress, ethers.constants.MaxUint256, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    });
  }

  // buy functionality
  const validateBuy = useCallback(
    numberOfWCC => {
      // validate passed amount
      let parsedValue;
      try {
        parsedValue = ethers.utils.parseUnits(numberOfWCC, 18);
      } catch (error) {
        error.code = ERROR_CODES.INVALID_AMOUNT;
        throw error;
      }

      let requiredValueInSelectedToken;
      try {
        requiredValueInSelectedToken = calculateAmount(
          selectedTokenSymbol,
          TOKEN_SYMBOLS.WCC,
          parsedValue,
          reserveWCCETH,
          reserveWCCToken,
          reserveSelectedTokenETH,
          reserveSelectedTokenToken
        );
      } catch (error) {
        error.code = ERROR_CODES.INVALID_TRADE;
        throw error;
      }

      // get max slippage amount
      const { maximum } = calculateSlippageBounds(requiredValueInSelectedToken);

      // the following are 'non-breaking' errors that will still return the data
      let errorAccumulator;
      // validate minimum ether balance
      if (balanceETH && balanceETH.lt(ethers.utils.parseEther(".01"))) {
        const error = Error();
        error.code = ERROR_CODES.INSUFFICIENT_ETH_GAS;
        if (!errorAccumulator) {
          errorAccumulator = error;
        }
      }

      // validate minimum selected token balance
      if (balanceSelectedToken && maximum && balanceSelectedToken.lt(maximum)) {
        const error = Error();
        error.code = ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE;
        if (!errorAccumulator) {
          errorAccumulator = error;
        }
      }

      // validate allowance
      if (selectedTokenSymbol !== "ETH") {
        if (
          allowanceSelectedToken &&
          maximum &&
          allowanceSelectedToken.lt(maximum)
        ) {
          const error = Error();
          error.code = ERROR_CODES.INSUFFICIENT_ALLOWANCE;
          if (!errorAccumulator) {
            errorAccumulator = error;
          }
        }
      }

      return {
        inputValue: requiredValueInSelectedToken,
        maximumInputValue: maximum,
        outputValue: parsedValue,
        error: errorAccumulator
      };
    },
    [
      allowanceSelectedToken,
      balanceETH,
      balanceSelectedToken,
      reserveWCCETH,
      reserveWCCToken,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken,
      selectedTokenSymbol
    ]
  );

  async function buy(maximumInputValue, outputValue) {
    const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice =>
        gasPrice
          .mul(ethers.utils.bigNumberify(150))
          .div(ethers.utils.bigNumberify(100))
      );

    if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
      const estimatedGasLimit = await exchangeContractWCC.estimate.ethToTokenSwapOutput(
        outputValue,
        deadline,
        {
          value: maximumInputValue
        }
      );
      return exchangeContractWCC.ethToTokenSwapOutput(outputValue, deadline, {
        value: maximumInputValue,
        gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
        gasPrice: estimatedGasPrice
      });
    } else {
      const estimatedGasLimit = await exchangeContractSelectedToken.estimate.tokenToTokenSwapOutput(
        outputValue,
        maximumInputValue,
        ethers.constants.MaxUint256,
        deadline,
        TOKEN_ADDRESSES.WCC
      );
      return exchangeContractSelectedToken.tokenToTokenSwapOutput(
        outputValue,
        maximumInputValue,
        ethers.constants.MaxUint256,
        deadline,
        TOKEN_ADDRESSES.WCC,
        {
          gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
          gasPrice: estimatedGasPrice
        }
      );
    }
  }

  async function burn(amount) {
    const parsedAmount = ethers.utils.parseUnits(amount, 18);

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice =>
        gasPrice
          .mul(ethers.utils.bigNumberify(150))
          .div(ethers.utils.bigNumberify(100))
      );

    const estimatedGasLimit = await tokenContractWCC.estimate.burn(
      parsedAmount
    );

    return tokenContractWCC.burn(parsedAmount, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    });
  }

  return (
    <Container
      coffeeHash={coffeeHash}
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
      reserveWCCETH={reserveWCCETH}
      calculateEthPrice={calculateEthPrice}
      accountBalance={balanceWCC}
      provider={provider}
      setProvider={setProvider}
      account={account}
      setAccount={setAccount}
      web3Connect={web3Connect}
    />
  );
}
