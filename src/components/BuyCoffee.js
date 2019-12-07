import React, { useState } from "react";
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

  const buying = true;

  const [buyValidationState, setBuyValidationState] = useState({}); // { maximumInputValue, inputValue, outputValue }
  const [sellValidationState, setSellValidationState] = useState({}); // { inputValue, outputValue, minimumOutputValue }
  const [validationError, setValidationError] = useState();

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
      return amountFormatter(buyValidationState.inputValue, 18, 4);
    } else {
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
                <Input
                  type="number"
                  required={true}
                  placeholder="1"
                  width={"100%"}
                  name="amount"
                />
              </Field>
            </Box>
            <Box width={1}>
              <Heading.h3 display="inline">
                {dollarPrice
                  ? `$${amountFormatter(dollarPrice, 18, 2)} USD`
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
        </Card>
      </Modal>
    </>
  );
}
