import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Input,
  Modal,
  Field,
  Text
} from "rimble-ui";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";
import { amountFormatter } from "../factory";
import SelectToken from "./SelectToken";
import IncrementToken from './IncrementToken'
import { useAppContext } from '../context'


export default function BuyCoffee({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  totalSupply,
  ethPrice,
  usdBalance,
  reserveWCCToken,
  pending,
  currentTransactionHash,
  currentTransactionType,
  currentTransactionAmount,
  setCurrentTransaction,
  clearCurrentTransaction,
  setShowConnect
}) {
  const [state] = useAppContext()
  const [show, setShow] = useState(false);

  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

  const buying = true;

  const [buyValidationState, setBuyValidationState] = useState({}); // { maximumInputValue, inputValue, outputValue }
  const [validationError, setValidationError] = useState();

  // buy state validation
  useEffect(() => {
    if (buying) {
      try {
        const { error: validationError, ...validationState } = validateBuy(String(state.count))
        setBuyValidationState(validationState)
        setValidationError(validationError || null)

        return () => {
          setBuyValidationState({})
          setValidationError()
        }
      } catch (error) {
        setBuyValidationState({})
        setValidationError(error)
      }
    }
  }, [ready, buying, validateBuy, state.count])


  function TokenVal() {
    if (buying && buyValidationState.inputValue) {
      return amountFormatter(buyValidationState.inputValue, 18, 4);
    } else {
      return "0";
    }
  }

  function UsdTotal(){
    if (buying && buyValidationState.inputValue) {
        return usdBalance * state.count;
    }
    else{
      return "0";
    }  
  }

  return (
    <>
      <Button variant="primary" className="buy" onClick={openModal}>
        {contentStrings.buy}
      </Button>

      <Modal isOpen={show}>
        <Card
          width={"420px"}
          p={0}
          borderRadius={7}
          borderColor={colors.brown.light}
          boxShadow="1"
          className="coffeeModal"
        >
          <Flex px="6%" mt="6%" flexDirection="column">
            <Heading.h3 variant="primary" mb="3%">
              Buy Wrapped Coffee Coin
            </Heading.h3>
            <Box width={1}>
              <Field label="Choose the amount" width={"100%"} mb="2%">
                <IncrementToken />
                
              </Field>
            </Box>
            <Box width={1}>
              <Heading.h3 display="inline">
                {usdBalance
                  ? `$ ${UsdTotal()} USD`
                  : "$0.00"}
              </Heading.h3>

              <Text.span color={colors.brown.text} ml="" className="available">
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
            <Button variant="primary" size="" ml={3} width={1 / 2}>
              {contentStrings.buy}
            </Button>
          </Flex>
          <Flex px={"6%"} py={2} mt="3%" mb="10px" justifyContent={"center"}>
            <Heading.h5>
              Powered by
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
