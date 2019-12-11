import React, { Component, useState } from "react";
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

export default function HeaderBar({ setShowConnect, accountBalance }) {
  const { account, setConnector } = useWeb3Context();
  let [ens, setEns] = useState();
  let provider = ethers.getDefaultProvider("homestead");

  provider.lookupAddress(account).then(function(address) {
    setEns(address);
  });

  function handleAccount() {
    setConnector("Injected", { suppressAndThrowErrors: true }).catch(error => {
      setShowConnect(true);
    });
  }

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
            <button className="btn btn-primary" onClick={() => handleAccount()}>
              <CoffeeCount>{contentStrings.connectWallet}</CoffeeCount>
            </button>
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
