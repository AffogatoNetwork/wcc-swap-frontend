import React, { Component } from "react";
import Web3Provider, { Connectors } from "web3-react";
import { Route } from "react-router-dom";
import "./App.scss";
import Web3Connection from "./components/Web3Connection";
import Main from "./components/Main";
import AppProvider from "./context";
import WalletConnectApi from "@walletconnect/web3-subprovider";

require("dotenv").config();

const PROVIDER_URL = process.env.REACT_APP_INFURA_URL;

const {
  NetworkOnlyConnector,
  InjectedConnector,
  WalletConnectConnector
} = Connectors;

const Injected = new InjectedConnector({
  supportedNetworks: [parseInt(process.env.REACT_APP_NETWORK)]
});
const Network = new NetworkOnlyConnector({
  providerURL: PROVIDER_URL
});
let supportedNetworkWC = {};
if (process.env.REACT_APP_NETWORK === 1) {
  supportedNetworkWC = { 1: PROVIDER_URL };
} else {
  supportedNetworkWC = {
    4: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`
  };
}
const WalletConnect = new WalletConnectConnector({
  api: WalletConnectApi,
  bridge: "https://bridge.walletconnect.org",
  supportedNetworkURLs: supportedNetworkWC,
  defaultNetwork: process.env.REACT_APP_NETWORK
});
const connectors = { Network, Injected, WalletConnect };

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
        <Web3Provider connectors={connectors} libraryName={"ethers.js"}>
          <Web3Connection>
            <AppProvider>
              <Route exact path="/" render={() => <Main />} />
            </AppProvider>
          </Web3Connection>
        </Web3Provider>
      </div>
    );
  }
}

export default App;
