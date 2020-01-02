import React, { useState, useEffect } from "react";
import { Flex, Box } from "rimble-ui";
import { Button } from "reactstrap";
import styled from "styled-components";
import affogato_horizontal from "../assets/affogato-horizontal.png";
import icon from "../assets/icon.png";
import { useWeb3Context } from "web3-react";
import { addressShortener } from "../utils/utils";
import "../App.scss";
import { ethers, utils, providers } from "ethers";

import contentStrings from "../constants/Localization";

export default function HeaderBar({
  setShowConnect,
  accountBalance = 0,
  web3Connect,
  provider,
  setProvider,
  account,
  setAccount
}) {
  // connector error
  const [connectorError, setConnectorError] = useState();
  const { connector, setConnector } = useWeb3Context();
  let [ens, setEns] = useState();
  let defaultProvider = ethers.getDefaultProvider("homestead");

  // subscribe to connect
  web3Connect.on("connect", connection => {
    let provider = new ethers.providers.Web3Provider(connection);
    setProvider(provider);
  });

  // subscribe to close
  web3Connect.on("close", () => {
    console.log("Web3Connect Modal Closed"); // modal has closed
  });

  if (account) {
    defaultProvider.lookupAddress(account).then(function(address) {
      setEns(address);
    });
  }

  function handleAccount() {
    // setConnector("Injected", { suppressAndThrowErrors: true }).catch(error => {
    //   alert("Couldn't connect to Web3. Please install Metamask");
    //   setShowConnect(true);
    // });
    web3Connect.toggleModal();
  }

  // once an account is connected, don't show this screen
  useEffect(() => {
    async function getAddress() {
      let accounts = await provider.listAccounts();
      console.log("TCL: getAddress -> accounts", web3Connect);
      setAccount(accounts[0]);
    }

    if (account !== null) {
      setShowConnect(false);
    }
    if (provider) {
      getAddress();
    }
  }, [account, provider, setAccount, setShowConnect]);

  return (
    <>
      <div className="header">
        <div bg="white" color="black">
          <img src={affogato_horizontal} alt="affogato" className="logo" />
        </div>
        <div bg="white"></div>
        <div bg="white" color="black">
          {account ? (
            <div className="wallet-details">
              <div className="tokens">
                <img src={icon} alt="CAFE" />
                <CoffeeCount>
                  {utils.formatEther(accountBalance)} CAFE
                </CoffeeCount>
              </div>
              <div className="address">
                <CoffeeCount>
                  {ens ? ens : addressShortener(account)}
                </CoffeeCount>
                <div
                  className={`circle connected-${process.env.REACT_APP_NETWORK}`}
                ></div>
              </div>
            </div>
          ) : (
            <div className="button-wrapper">
              <button
                className="btn btn-primary injected"
                onClick={() => handleAccount()}
              >
                <CoffeeCount>{contentStrings.connectWallet}</CoffeeCount>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const CoffeeCount = styled.p`
  /* color: #6c7284; */
  font-weight: 500;
  margin: 0px;
  font-size: 14px;
  float: left;
`;
