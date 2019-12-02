import { ethers } from "ethers";

// import ERC20_ABI from "./erc20.json";
import EXCHANGE_ABI from "./exchange.json";
import FACTORY_ABI from "./factory.json";
import WCC_ARTIFACT from "../contracts/WrappedCoffeeCoin.json";

import UncheckedJsonRpcSigner from "./signer";

const FACTORY_ADDRESS = "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36";

let ERC20_ABI = WCC_ARTIFACT.abi;

export const TOKEN_ADDRESSES = {
  ETH: "ETH",
  WCC: "0x79a1772Ae1590bD783e246AA4dE9580E0D4b49e2",
  DAI: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359"
};

export const TOKEN_SYMBOLS = Object.keys(TOKEN_ADDRESSES).reduce((o, k) => {
  o[k] = k;
  return o;
}, {});

export const ERROR_CODES = [
  "INVALID_AMOUNT",
  "INVALID_TRADE",
  "INSUFFICIENT_ETH_GAS",
  "INSUFFICIENT_SELECTED_TOKEN_BALANCE",
  "INSUFFICIENT_ALLOWANCE"
].reduce((o, k, i) => {
  o[k] = i;
  return o;
}, {});

export const TRADE_TYPES = ["BUY", "SELL", "UNLOCK", "REDEEM"].reduce(
  (o, k, i) => {
    o[k] = i;
    return o;
  },
  {}
);

export function isAddress(value) {
  try {
    ethers.utils.getAddress(value);
    return true;
  } catch {
    return false;
  }
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account
    ? new UncheckedJsonRpcSigner(library.getSigner(account))
    : library;
}

// account is optional
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new ethers.Contract(
    address,
    ABI,
    getProviderOrSigner(library, account)
  );
}

export function getTokenContract(tokenAddress, library, account) {
  return getContract(tokenAddress, ERC20_ABI, library, account);
}

export function getExchangeContract(exchangeAddress, library, account) {
  return getContract(exchangeAddress, EXCHANGE_ABI, library, account);
}

export async function getTokenExchangeAddressFromFactory(
  tokenAddress,
  library,
  account
) {
  return getContract(
    FACTORY_ADDRESS,
    FACTORY_ABI,
    library,
    account
  ).getExchange(tokenAddress);
}

// get the ether balance of an address
export async function getEtherBalance(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'`);
  }

  return library.getBalance(address);
}

// get the token balance of an address
export async function getTokenBalance(tokenAddress, address, library) {
  if (!isAddress(tokenAddress) || !isAddress(address)) {
    throw Error(
      `Invalid 'tokenAddress' or 'address' parameter '${tokenAddress}' or '${address}'.`
    );
  }

  return getContract(tokenAddress, ERC20_ABI, library).balanceOf(address);
}

export async function getTokenAllowance(
  address,
  tokenAddress,
  spenderAddress,
  library
) {
  if (
    !isAddress(address) ||
    !isAddress(tokenAddress) ||
    !isAddress(spenderAddress)
  ) {
    throw Error(
      "Invalid 'address' or 'tokenAddress' or 'spenderAddress' parameter" +
        `'${address}' or '${tokenAddress}' or '${spenderAddress}'.`
    );
  }

  return getContract(tokenAddress, ERC20_ABI, library).allowance(
    address,
    spenderAddress
  );
}

export function amountFormatter(
  amount,
  baseDecimals = 18,
  displayDecimals = 3,
  useLessThan = true
) {
  if (
    baseDecimals > 18 ||
    displayDecimals > 18 ||
    displayDecimals > baseDecimals
  ) {
    throw Error(
      `Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`
    );
  }

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined;
  }
  // if amount is 0, return
  else if (amount.isZero()) {
    return "0";
  }
  // amount > 0
  else {
    // amount of 'wei' in 1 'ether'
    const baseAmount = ethers.utils
      .bigNumberify(10)
      .pow(ethers.utils.bigNumberify(baseDecimals));

    const minimumDisplayAmount = baseAmount.div(
      ethers.utils
        .bigNumberify(10)
        .pow(ethers.utils.bigNumberify(displayDecimals))
    );

    // if balance is less than the minimum display amount
    if (amount.lt(minimumDisplayAmount)) {
      return useLessThan
        ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
        : `${ethers.utils.formatUnits(amount, baseDecimals)}`;
    }
    // if the balance is greater than the minimum display amount
    else {
      const stringAmount = ethers.utils.formatUnits(amount, baseDecimals);

      // if there isn't a decimal portion
      if (!stringAmount.match(/\./)) {
        return stringAmount;
      }
      // if there is a decimal portion
      else {
        const [wholeComponent, decimalComponent] = stringAmount.split(".");
        const roundUpAmount = minimumDisplayAmount.div(ethers.constants.Two);
        const roundedDecimalComponent = ethers.utils
          .bigNumberify(decimalComponent.padEnd(baseDecimals, "0"))
          .add(roundUpAmount)
          .toString()
          .padStart(baseDecimals, "0")
          .substring(0, displayDecimals);

        // decimals are too small to show
        if (roundedDecimalComponent === "0".repeat(displayDecimals)) {
          return wholeComponent;
        }
        // decimals are not too small to show
        else {
          return `${wholeComponent}.${roundedDecimalComponent
            .toString()
            .replace(/0*$/, "")}`;
        }
      }
    }
  }
}
