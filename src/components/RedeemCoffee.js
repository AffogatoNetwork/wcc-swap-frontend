import React, { Component } from "react";
import { Box, Button, Card, Field, Flex, Heading, Input, Modal, Select, Text } from 'rimble-ui';
import contentStrings from "../constants/Localization";

//bags to redeem, 
//price if are sell
//cancel and confirm buttons


class RedeemCoffee extends Component {

    constructor(props) {
        super(props);
        this.state = {
          availableToRedeem: 0,  
          bagsToRedeem: 0, 
          buttonDisabled: '',
          //totalUSD: this.props.coffeeBagInfo.price,
          isOpen: false
        };
        this.loadAvailableToRedeem = this.loadAvailableToRedeem.bind(this);
        this.onBagsToRedeemChange = this.onBagsToRedeemChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    componentDidMount = async () => {
        this.loadAvailableToRedeem();
    }

    loadAvailableToRedeem(){
        //get available
        this.setState({
            availableToRedeem: 2        
        });
    }

    onBagsToRedeemChange(event){
        this.setState({ 
            bagsToRedeem: event.target.value            
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

    render(){

        return(
            <>
                <Box width={1 / 2} pl="0.5%">    
                    <Button variant="custom" width={1} disabled={this.state.buttonDisabled} onClick={this.openModal}>
                        {contentStrings.redeem}
                    </Button>
                </Box>
                <Modal isOpen={this.state.isOpen} >
                    <Card width={"420px"} p={0} borderRadius={7} borderColor="#9C7349" boxShadow="1" >
                        <Flex p="3%" mt="3%">
                            <Box width={1 / 2} py='3%'>
                                <Flex>
                                    <Heading.h3 color="#332211" >
                                        {this.state.bagsToRedeem}/{this.state.availableToRedeem}
                                        <Text.span color="#A58666" ml="2">{contentStrings.bags} {contentStrings.available}</Text.span>
                                    </Heading.h3> 
                                </Flex>
                            </Box>
                            <Box width={1 / 2}>
                                <Input type="number" required={true} placeholder="1" onChange={this.onBagsToRedeemChange}/>                    
                            </Box> 
                        </Flex> 
                        <Flex
                         px={2}
                         py={2}
                         borderTop={1}
                         borderColor={"#E8E8E8"}
                         justifyContent={"flex-end"}
                        >
                            <Button.Outline size="small"  variant="danger" onClick={this.closeModal}>{contentStrings.cancel}</Button.Outline>
                            <Button variant="primary" size="small" ml={3}>{contentStrings.redeem}</Button>
                        </Flex>   
                    </Card>    
                </Modal>                
            </>
        );

    }

}

export default RedeemCoffee;