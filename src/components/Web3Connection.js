import React, { useState, useEffect } from "react";
import { useWeb3Context } from "web3-react";
import { ethers } from "ethers";
import { Heading } from "rimble-ui";
import Loading from "./Loading";

export default function Web3Connection({ children }) {
  const { setConnector, error, active } = useWeb3Context();

  // initialization management
  useEffect(() => {
    if (!active) {
      if (window.ethereum) {
        try {
          const library = new ethers.providers.Web3Provider(window.ethereum);
          library.listAccounts().then(accounts => {
            if (accounts.length >= 1) {
              setConnector("Injected", { suppressAndThrowErrors: true });
            } else {
              setConnector("Network");
            }
          });
        } catch {
          setConnector("Network");
        }
      } else {
        setConnector("Network");
      }
    }
  }, [active, setConnector]);

  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 750);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (error) {
    console.error(error);
    return <Heading.h3>Connection Error.</Heading.h3>;
  } else if (!active) {
    return showLoader ? <Loading /> : <Loading />;
  } else {
    return children;
  }
}
