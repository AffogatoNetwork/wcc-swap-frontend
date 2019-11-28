import React, { Component } from "react";
import Web3Provider, { Connectors } from 'web3-react'
import { Route } from "react-router-dom";
import { ethers } from 'ethers';

import "./App.css";
import factoryABI from "./constants/factoryABI";
import exchangeABI from "./constants/exchangeABI";
import tokenABI from "./constants/tokenABI";

import Web3Connection from "./components/Web3Connection"
import Container from "./components/Container";

import getWeb3 from "./utils/getWeb3";

const factoryAddress = '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36';
const tokenAddress = '0xa0857d98b167638081eef794625506f30cc07ef0';

const PROVIDER_URL = 'https://rinkeby.infura.io/'

const { NetworkOnlyConnector, InjectedConnector, WalletConnectConnector } = Connectors
const Injected = new InjectedConnector({ supportedNetworks: [4] })
const Network = new NetworkOnlyConnector({
  providerURL: PROVIDER_URL
})
const connectors = { Network, Injected }


class App extends Component {
  state = {
    allTokens: 0,
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null
  };

  render() {
    
    return (
      <div className="App">   
        <Web3Provider connectors={connectors} libraryName={'ethers.js'}>
          <Web3Connection>
            <Route
                exact
                path="/"
                render={() => (
                  <Container />
                )}
            />      
          </Web3Connection>        
        </Web3Provider>        
      </div>
    );
    
  }
}

export default App;
