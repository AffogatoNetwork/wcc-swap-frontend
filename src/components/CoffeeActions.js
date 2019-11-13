import React, { Component } from "react";
import { Button, Box, Card, Heading, Image, Flex } from 'rimble-ui';
import contentStrings from "../constants/Localization";
import BuyCoffee from "./BuyCoffee"
import RedeemCoffee from "./RedeemCoffee"


class CoffeeActions extends Component {
    
    render(){
        

        return (
            <> 
                <BuyCoffee coffeeBagInfo={this.props.coffeeBagInfo} />
                <Box pl="37%" pr="37%">
                    <Flex>
                        <Box width={1 / 2} pr="0.5%">    
                            <Button variant="custom" width={1}>
                                {contentStrings.sell}
                            </Button>
                        </Box>
                        <RedeemCoffee />
                    </Flex>
                </Box>
            </>
        );
    }
}

export default CoffeeActions; 