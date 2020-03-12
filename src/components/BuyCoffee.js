import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Modal,
  Field,
  Text
} from "rimble-ui";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";
import { ERROR_CODES, amountFormatter, TRADE_TYPES } from "../factory";
import SelectToken from "./SelectToken";
import IncrementToken from "./IncrementToken";
import { useAppContext } from "../context";
import { ethers } from "ethers";

function getValidationErrorMessage(validationError) {
  if (!validationError) {
    return null;
  } else {
    switch (validationError.code) {
      case ERROR_CODES.INVALID_AMOUNT: {
        return "Invalid Amount";
      }
      case ERROR_CODES.INVALID_TRADE: {
        return "Invalid Trade";
      }
      case ERROR_CODES.INSUFFICIENT_ALLOWANCE: {
        return "Set Allowance to Continue";
      }
      case ERROR_CODES.INSUFFICIENT_ETH_GAS: {
        return "Not Enough ETH for gas";
      }
      case ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE: {
        return "Not enough balance";
      }
      default: {
        return "Unknown Error";
      }
    }
  }
}

export default function BuyCoffee({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  totalSupply,
  ethPrice,
  ethToUSD,
  reserveWCCToken,
  pending,
  currentTransactionHash,
  setCurrentTransaction,
  setShowConnect,
  web3Connect,
  provider,
  setProvider,
  account,
  setAccount
}) {
  const [state] = useAppContext();
  const [show, setShow] = useState(false);

  // subscribe to connect
  web3Connect.on("connect", connection => {
    let provider = new ethers.providers.Web3Provider(connection);
    setProvider(provider);
  });

  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

  const buying = true;

  const [buyValidationState, setBuyValidationState] = useState({}); // { maximumInputValue, inputValue, outputValue }
  const [validationError, setValidationError] = useState();

  function getText(account, buying, errorMessage, pending, hash) {
    if (!account) {
      return "Connect Wallet";
    } else if (!errorMessage) {
      if (buying) {
        if (pending && hash) {
          return "Pending...";
        } else {
          return contentStrings.buy;
        }
      }
    } else {
      return errorMessage ? errorMessage : "Loading...";
    }
  }

  // buy state validation
  useEffect(() => {
    async function setConnection() {
      let accounts = await provider.listAccounts();
      setAccount(accounts[0]);
    }

    if (provider) {
      setConnection();
    }

    if (buying) {
      try {
        const { error: validationError, ...validationState } = validateBuy(
          String(state.count)
        );
        setBuyValidationState(validationState);
        setValidationError(validationError || null);

        return () => {
          setBuyValidationState({});
          setValidationError();
        };
      } catch (error) {
        setBuyValidationState({});
        setValidationError(error);
      }
    }
  }, [ready, buying, validateBuy, state.count, provider, setAccount]);

  const errorMessage = getValidationErrorMessage(validationError);

  function TokenVal() {
    if (buying && buyValidationState.inputValue) {
      return amountFormatter(buyValidationState.inputValue, 18, 4);
    } else {
      return "0";
    }
  }

  function UsdTotal() {
    if (ethToUSD && buying && buyValidationState.inputValue) {
      return parseFloat(ethToUSD.USD * ethToUSD.ETH * TokenVal()).toFixed(2);
    } else {
      return "0";
    }
  }

  return (
    <>
      {/* <Button
        variant="primary"
        className="buy"
        onClick={openModal}
        width={1}
        disabled={true}
      >
        {contentStrings.buy}
      </Button> */}

      <Modal isOpen={show}>
        <Card
          width={"420px"}
          p={0}
          borderRadius={7}
          borderColor={colors.brown.light}
          boxShadow="1"
          className="coffeeModal buy"
        >
          <Flex px="6%" mt="6%" flexDirection="column">
            <Heading.h3 variant="primary" mb="3%">
              Buy CAFE Tokens
            </Heading.h3>
            <Box width={1}>
              <Field label="Choose the amount" width={"100%"} mb="2%">
                <IncrementToken required={true} />
              </Field>
            </Box>
            <Box width={1}>
              <Heading.h3 display="inline">
                {ethToUSD ? `$${UsdTotal()} USD` : "$0.00"}
              </Heading.h3>

              <Text.span
                color="#b4600b"
                ml=""
                className="available"
                fontWeight={"bold"}
                fontSize="1"
              >
                {reserveWCCToken && totalSupply
                  ? `${amountFormatter(
                      reserveWCCToken,
                      18,
                      0
                    )}/${totalSupply} ${contentStrings.available}`
                  : ""}
              </Text.span>
            </Box>
          </Flex>
          <Flex px="6%" mt="3%">
            <Box width={1}>
              <SelectToken
                selectedTokenSymbol={selectedTokenSymbol}
                setSelectedTokenSymbol={setSelectedTokenSymbol}
                prefix={TokenVal()}
              />
            </Box>
          </Flex>
          <Flex px={"6%"} py={2} mt="3%" mb="10px" justifyContent={"flex-end"}>
            <Button.Outline
              size=""
              variant="danger"
              onClick={closeModal}
              width={1 / 2}
            >
              {contentStrings.cancel}
            </Button.Outline>

            <Button
              variant="primary"
              size=""
              ml={3}
              width={1 / 2}
              disabled={
                validationError !== null || (pending && currentTransactionHash)
              }
              onClick={() => {
                if (!account) {
                  closeModal();
                  web3Connect.toggleModal();
                } else {
                  buy(
                    buyValidationState.maximumInputValue,
                    buyValidationState.outputValue
                  ).then(response => {
                    setCurrentTransaction(
                      response.hash,
                      TRADE_TYPES.BUY,
                      buyValidationState.outputValue
                    );
                  });
                }
              }}
            >
              {getText(
                account,
                true,
                errorMessage,
                pending,
                currentTransactionHash
              )}
            </Button>
          </Flex>
          <Flex px={"6%"} py={2} mt="3%" mb="10px" justifyContent={"center"}>
            <Heading.h5>
              Powered by{" "}
              <a
                href="https://uniswap.io/"
                className="uniswap ml-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span role="img" aria-label="unicorn emoji">
                  🦄
                </span>{" "}
                Uniswap
              </a>
            </Heading.h5>
          </Flex>
        </Card>
      </Modal>
    </>
  );
}
