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
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";

import contentStrings from "../constants/Localization";

export default function HeaderBar({ setShowConnect, accountBalance }) {
  // connector error
  const [connectorError, setConnectorError] = useState();
  const { account, connector, setConnector } = useWeb3Context();
  let [ens, setEns] = useState();
  let provider = ethers.getDefaultProvider("homestead");

  if (account) {
    WalletConnectQRCodeModal.close();
    provider.lookupAddress(account).then(function(address) {
      setEns(address);
    });
  }

  function handleAccount() {
    setConnector("Injected", { suppressAndThrowErrors: true }).catch(error => {
      alert("Couldn't connect to Web3. Please install Metamask");
      setShowConnect(true);
    });
  }
  function activateWalletConnect() {
    if (walletconnectUri) {
      WalletConnectQRCodeModal.open(walletconnectUri, () => {
        console.log("QR Code Modal closed");
      });
    }
  }
  const walletconnectUri =
    connector && connector.walletConnector && connector.walletConnector.uri;
  // unset the error on connector change
  useEffect(() => {
    setConnectorError();
  }, [connector]);

  // once an account is connected, don't show this screen
  useEffect(() => {
    if (account !== null) {
      setShowConnect(false);
    }
  });
  if (account && !accountBalance) {
    return "";
  }

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
                <div className="circle connected"></div>
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
              <button
                className="btn btn-outline-primary walletConnect"
                onClick={() => activateWalletConnect()}
              >
                <CoffeeCount>Use WalletConnect</CoffeeCount>
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
