import React, { Component } from "react";
import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Modal,
  Select,
  Text
} from "rimble-ui";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";

class BuyCoffee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bagsNumber: 1,
      totalUSD: this.props.coffeeBagInfo.price,
      isOpen: false
    };
    this.onBagsChange = this.onBagsChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  onBagsChange(event) {
    let bagsNumber = event.target.value;
    let totalUSD = bagsNumber * this.props.coffeeBagInfo.price;

    this.setState({
      bagsNumber: event.target.value,
      totalUSD: totalUSD
    });
  }

  closeModal(e) {
    e.preventDefault();
    this.setState((state, props) => ({
      isOpen: false
    }));
  }

  openModal(e) {
    e.preventDefault();
    this.setState((state, props) => ({
      isOpen: true
    }));
  }

  render() {
    return (
      <>
        <div className="button-wrapper">
          <Button variant="primary" className="buy" onClick={this.openModal}>
            {contentStrings.buy}
          </Button>
        </div>

        <Modal isOpen={this.state.isOpen}>
          <Card
            width={"420px"}
            p={0}
            borderRadius={7}
            borderColor={colors.brown.light}
            boxShadow="1"
          >
            <Flex p="3%" mt="3%">
              <Box width={1 / 2}>
                <Heading.h3>{this.state.totalUSD} USD</Heading.h3>
                <Text.span color={colors.brown.text}>
                  {this.props.coffeeBagInfo.available}/
                  {this.props.coffeeBagInfo.total}
                </Text.span>
                <Text.span color={colors.brown.text} ml="2">
                  {contentStrings.available}
                </Text.span>
              </Box>
              <Box width={1 / 2}>
                <Input
                  type="number"
                  required={true}
                  placeholder="1"
                  onChange={this.onBagsChange}
                />
              </Box>
            </Flex>

            <Flex p="3%">
              <Box width={1}>
                <Field label="Choose your currency" width={1}>
                  <Select
                    width="100%"
                    required={true}
                    options={[
                      { value: "eth", label: "Ethereum" },
                      { value: "btc", label: "Bitcoin" },
                      { value: "gno", label: "Gnosis" },
                      { value: "gnt", label: "Golem" },
                      { value: "rep", label: "Augur" }
                    ]}
                  />
                </Field>
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
                onClick={this.closeModal}
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
}

export default BuyCoffee;
