import React, { useState } from "react";
import Web3Provider, { Connectors } from "web3-react";
import { Route } from "react-router-dom";
import "./App.scss";
import Web3Connection from "./components/Web3Connection";
import Main from "./components/Main";
import AppProvider from "./context";
import Web3Connect from "web3connect";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import { ethers } from "ethers";

require("dotenv").config();

let network = "mainnet";

switch (process.env.REACT_APP_NETWORK) {
  case "1":
    network = "mainnet";
    break;
  case "3":
    network = "ropsten";
    break;
  case "4":
    network = "rinkeby";
    break;
  default:
    break;
}

const web3Connect = new Web3Connect.Core({
  network: network, // optional
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID // required
      }
    },
    portis: {
      package: Portis, // required
      options: {
        id: process.env.REACT_APP_PORTIS_ID, // required
        network: network
      }
    },
    fortmatic: {
      package: Fortmatic, // required
      options: {
        key: process.env.REACT_APP_FORTMATIC_ID, // required
        network: network
      }
    }
  }
});

const PROVIDER_URL = process.env.REACT_APP_INFURA_URL;

const { NetworkOnlyConnector, InjectedConnector } = Connectors;

const Injected = new InjectedConnector({
  supportedNetworks: [parseInt(process.env.REACT_APP_NETWORK)]
});
const Network = new NetworkOnlyConnector({
  providerURL: PROVIDER_URL
});

const connectors = { Network, Injected };

function App() {
  const [account, setAccount] = useState();
  const [provider, setProvider] = useState();

  // subscribe to connect
  web3Connect.on("connect", connection => {
    let provider = new ethers.providers.Web3Provider(connection);
    setProvider(provider);
  });

  // subscribe to close
  web3Connect.on("close", () => {
    console.log("Web3Connect Modal Closed"); // modal has closed
  });

  if (web3Connect.cachedProvider && !provider) {
    web3Connect.toggleModal();
  }

  // state = {
  //   allTokens: 0,
  //   storageValue: 0,
  //   web3: null,
  //   accounts: null,
  //   contract: null
  // };

  return (
    <div className="App">
      <Web3Provider connectors={connectors} libraryName={"ethers.js"}>
        <Web3Connection>
          <AppProvider>
            <Route
              exact
              path="/"
              render={() => (
                <Main
                  web3Connect={web3Connect}
                  account={account}
                  setAccount={setAccount}
                  provider={provider}
                  setProvider={setProvider}
                />
              )}
            />
          </AppProvider>
        </Web3Connection>
      </Web3Provider>
    </div>
  );
}

export default App;
