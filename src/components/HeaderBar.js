import React, { Component } from "react";
import { Flex, Box, Button } from 'rimble-ui';
import styled from 'styled-components'
import affogato_horizontal from "../assets/affogato_horizontal.png";
import { Image } from 'rimble-ui';
import { useWeb3Context } from 'web3-react'

import contentStrings from "../constants/Localization";


export default function  HeaderBar({ setShowConnect }) {
    const { account, setConnector } = useWeb3Context()

    function handleAccount() {
        setConnector('Injected', { suppressAndThrowErrors: true }).catch(error => {
          setShowConnect(true)
        })
    }    

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
                <Button variant="primary" onClick={() => handleAccount()}>
                {account ? (
                    <CoffeeCount>{account.slice(0, 6)}...</CoffeeCount>      
                ) : (
                    <CoffeeCount>{contentStrings.connectWallet}</CoffeeCount>
                )}
                </Button>
            </Box>
        </Flex>
    </>)
}

const CoffeeCount = styled.p`
  /* color: #6c7284; */
  font-weight: 500;
  margin: 0px;
  font-size: 14px;
  float: left;
`