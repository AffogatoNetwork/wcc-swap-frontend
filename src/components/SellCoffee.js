import React, { Component } from "react";
import { Box, Button, Card, Flex, Heading, Modal, Text } from 'rimble-ui';
import contentStrings from "../constants/Localization";

class SellCoffee extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false
      };
      this.closeModal = this.closeModal.bind(this);
      this.openModal = this.openModal.bind(this);
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
          <Box mb="2px" mt="4px">
            <Button variant="primary" minWidth="26%" onClick={this.openModal}>
                {contentStrings.buy}
            </Button>                
          </Box> 
  
          <Modal isOpen={this.state.isOpen}>
            <Card width={"420px"} p={0}>
              <Button.Text
                icononly
                icon={"Close"}
                color={"moon-gray"}
                position={"absolute"}
                top={0}
                right={0}
                mt={3}
                mr={3}
                onClick={this.closeModal}
              />
  
              <Box p={4} mb={3}>
                <Heading.h3>Confirm Action</Heading.h3>
                <Text>Are you sure you want to action?</Text>
              </Box>
  
              <Flex
                px={4}
                py={3}
                borderTop={1}
                borderColor={"#E8E8E8"}
                justifyContent={"flex-end"}
              >
                <Button.Outline onClick={this.closeModal}>Cancel</Button.Outline>
                <Button ml={3}>Confirm</Button>
              </Flex>
            </Card>
          </Modal>
        </>
      );
    }
}

export default SellCoffee;  