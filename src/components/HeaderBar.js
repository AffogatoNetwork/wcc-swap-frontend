import React, { Component } from "react";
import { Flex, Box, Button } from 'rimble-ui';
import affogato_horizontal from "../assets/affogato_horizontal.png";
import { Image } from 'rimble-ui';
import contentStrings from "../constants/Localization";


class HeaderBar extends Component {


    render(){

        return (<>
            <Flex>
                <Box bg="white" mb="2%"  width={1 / 4} color="black" fontSize={4} p={3}>
                   <Image
                     alt="random unsplash image"
                     borderRadius={8}
                     height="95%"
                     src={affogato_horizontal}
                    />                    
                </Box>
                <Box bg="white" width={1 / 2}></Box>
                <Box  bg="white" width={1 / 4} color="black" fontSize={4} p={3}>
                    <Button variant="primary">{contentStrings.connectWallet}</Button>
                </Box>
            </Flex>
        </>);
    }

}

export default HeaderBar;    