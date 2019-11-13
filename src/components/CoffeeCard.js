import React, { Component } from "react";
import { Button, Box, Card, Heading, Image, Flex } from 'rimble-ui';
import coffee_bag from "../assets/coffee_bag.png";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";


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
                <Flex contentAlign="left" >
                    <Heading.h6 color={colors.brown.base} textAlign="left">
                        Light bodied with milk chocolate flavors, an an exceptional ability to carry the flavors.
                    </Heading.h6>
                </Flex>
                <Image 
                    alt={contentStrings.coffeeBag}
                    src={coffee_bag}
                    height="85%"
                />                        
                <Flex>
                    <Heading.h3 color={colors.brown.base} >{this.props.coffeeBagInfo.price}</Heading.h3>
                    <Heading.h3 color={colors.brown.base} ml="2" >  USD</Heading.h3>
                </Flex>        
                <Flex>
                    <Heading.h5 color={colors.brown.text}>{this.props.coffeeBagInfo.available}/{this.props.coffeeBagInfo.total}</Heading.h5>
                    <Heading.h5 color={colors.brown.text} ml="2">{contentStrings.available}</Heading.h5>
                </Flex>
            </Card>

        );        
    }
}

export default CoffeeCard;   