import React, { Component, useState, useCallback } from "react";
import { useWeb3Context } from 'web3-react'
import HeaderBar from "./HeaderBar";
import CoffeeCard from "./CoffeeCard"
import CoffeeActions from "./CoffeeActions"


export default function Container ({ totalSupply, balanceBags }){
    const { account } = useWeb3Context()
    const [showConnect, setShowConnect] = useState(false)

    const coffeeBagInfo = {
        price: 25.98,
        available: 90,
        total: 100,      
    }    

    return (<>
        <HeaderBar setShowConnect={setShowConnect} />
        <CoffeeCard totalSupply={totalSupply} balanceBags={balanceBags} />
        <CoffeeActions coffeeBagInfo={coffeeBagInfo}  />
    </>);

}
