import React, { useState, useEffect } from "react";
import styled from "styled-components";
import affogato_horizontal from "../assets/affogato-horizontal.png";
import icon from "../assets/icon.png";
import addressShortener from "../utils/utils";
import "../App.scss";
import { ethers, utils } from "ethers";

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
  const [ens, setEns] = useState();
  const [networkId, setNetworkId] = useState();
  let defaultProvider = ethers.getDefaultProvider("homestead");

  // if (web3Connect.cachedProvider && !account) {
  //   web3Connect.toggleModal();
  // }

  if (account) {
    defaultProvider.lookupAddress(account).then(function(address) {
      setEns(address);
    });
  }

  function handleAccount() {
    web3Connect.toggleModal();
  }

  // once an account is connected, don't show this screen
  useEffect(() => {
    async function setConnection() {
      let accounts = await provider.listAccounts();
      let network = await provider.getNetwork();
      setAccount(accounts[0]);
      setNetworkId(network.chainId);
    }

    if (account !== null) {
      setShowConnect(false);
    }
    if (provider) {
      setConnection();
    }

    return function cleanUp() {};
  }, [account, networkId, provider, setAccount, setShowConnect, web3Connect]);

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
                <div className={`circle connected-${networkId}`}></div>
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
