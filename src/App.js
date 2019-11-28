import React, { Component } from "react";
import Web3Provider, { Connectors } from 'web3-react'
import { Route } from "react-router-dom";
import "./App.css";
import Web3Connection from "./components/Web3Connection"
import Container from "./components/Container";
import Main from "./components/Main";

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
                  <Main />
                )}
            />      
          </Web3Connection>        
        </Web3Provider>        
      </div>
    );
    
  }
}

export default App;
