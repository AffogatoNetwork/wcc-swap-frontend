import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Input,
  Modal,
  Select,
  Text
} from "rimble-ui";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";
import { amountFormatter } from '../factory'
import SelectToken from './SelectToken'


export default function BuyCoffee({ 
  selectedTokenSymbol,  
  setSelectedTokenSymbol, 
  validateBuy,  
  totalSupply, 
  dollarPrice, 
  reserveWCCToken 
}) {
  const [show, setShow] = useState(false);

  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);
  
  const buying = true

  const [buyValidationState, setBuyValidationState] = useState({}) // { maximumInputValue, inputValue, outputValue }
  const [sellValidationState, setSellValidationState] = useState({}) // { inputValue, outputValue, minimumOutputValue }
  const [validationError, setValidationError] = useState()

  /*onBagsChange(event) {
    let bagsNumber = event.target.value;
    let totalUSD = bagsNumber * 10;

    this.setState({
      bagsNumber: event.target.value,
      totalUSD: totalUSD
    });
  }*/

  

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
              <Input
                type="number"
                required={true}
                placeholder="1"                
              />
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

