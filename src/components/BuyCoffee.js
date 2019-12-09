import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Modal,
  Text
} from "rimble-ui";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";
import { amountFormatter } from '../factory'
import SelectToken from './SelectToken'
import IncrementToken from './IncrementToken'
import { useAppContext } from '../context'

export function useCount() {
  const [state, setState] = useAppContext()

  function increment() {
    setState(state => ({ ...state, count: state.count + 1 }))
  }

  function decrement() {
    if (state.count >= 1) {
      setState(state => ({ ...state, count: state.count - 1 }))
    }
  }

  function setCount(val) {
    let int = val.toInt()
    setState(state => ({ ...state, count: int }))
  }
  return [state.count, increment, decrement, setCount]
}

export default function BuyCoffee({ 
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
  
  const buying = true

  const [buyValidationState, setBuyValidationState] = useState({}) // { maximumInputValue, inputValue, outputValue }
  const [sellValidationState, setSellValidationState] = useState({}) // { inputValue, outputValue, minimumOutputValue }
  const [validationError, setValidationError] = useState()
  
  // buy state validation
  useEffect(() => {
    if (ready && buying) {
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
      return amountFormatter(buyValidationState.inputValue, 18, 4)
    } else {
      return '0'
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
        >
          <Flex p="3%" mt="3%">
            <Box width={1 / 2}>
              <Heading.h3>{dollarPrice ? `$${amountFormatter(dollarPrice, 18, 2)} USD` : '$0.00'}</Heading.h3>
              <Text.span color={colors.brown.text}>
                
              </Text.span>
              <Text.span color={colors.brown.text} ml="2">
              {reserveWCCToken && totalSupply
               ? `${amountFormatter(reserveWCCToken, 18, 0)}/${totalSupply} ${contentStrings.available}`  
               : ''}                   
              </Text.span>
            </Box>
            <Box width={1 / 2}>
              <IncrementToken />
            </Box>
          </Flex>

          <Flex p="3%">
            <Box width={1}>
              <SelectToken
                selectedTokenSymbol={selectedTokenSymbol}
                setSelectedTokenSymbol={setSelectedTokenSymbol}
                prefix={TokenVal()}
              />
            </Box>
          </Flex>
          <Flex
            px={2}
            py={2}
            borderTop={1}
            borderColor={"#E8E8E8"}
            justifyContent={"flex-end"}
          >
            <Button.Outline
              size="small"
              variant="danger"
              onClick={closeModal}
            >
              {contentStrings.cancel}
            </Button.Outline>
            <Button variant="primary" size="small" ml={3}>
              {contentStrings.buy}
            </Button>
          </Flex>
        </Card>
      </Modal>
    </>
  );  
}

