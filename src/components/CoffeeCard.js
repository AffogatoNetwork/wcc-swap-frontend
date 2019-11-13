import React, { Component } from "react";
import { Button, Box, Card, Heading, Image, Flex } from 'rimble-ui';
import coffee_bag from "../assets/coffee_bag.png";
import contentStrings from "../constants/Localization";


class CoffeeCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
 
          hasBalance: false,
          balance: 0
        };
      }

    loadCurrentPrice(){

    }


    render(){

        return (
            <Card width={"26%"} height="550px" mx={"auto"} bg="#FCF6F0" boxShadow="3"  borderRadius={10}>
                <Flex contentAlign="left">
                    <Heading.h4 color="#332211" textAlign="left">{contentStrings.coffeeSwap}</Heading.h4>
                </Flex>
                <Image 
                    alt={contentStrings.coffeeBag}
                    src={coffee_bag}
                    height="85%"
                />                        
                <Flex>
                    <Heading.h3 color="#332211" >{this.props.coffeeBagInfo.price}</Heading.h3>
                    <Heading.h3 color="#332211" ml="2" >  USD</Heading.h3>
                </Flex>        
                <Flex>
                    <Heading.h5 color="#A58666">{this.props.coffeeBagInfo.available}/{this.props.coffeeBagInfo.total}</Heading.h5>
                    <Heading.h5 color="#A58666" ml="2">{contentStrings.available}</Heading.h5>
                </Flex>
            </Card>

        );        
    }
}

export default CoffeeCard;   