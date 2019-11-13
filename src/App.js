import React, { Component } from "react";
import { Route } from "react-router-dom";
import { ethers, web3 } from 'ethers';

import "./App.css";
import Container from "./components/Container";



class App extends Component {
  state = {
    allTokens: 0,
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      let provider = await ethers.getDefaultProvider();
          

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    
    return (
      <div className="App">       
          <Route
              exact
              path="/"
              render={() => (
                <Container />
              )}
          />                      
      </div>
      );
    
  }
}

export default App;
