import React, { Component } from "react";
import HeaderBar from "./HeaderBar";
import CoffeeCard from "./CoffeeCard"
import CoffeeActions from "./CoffeeActions"

class Container extends Component {

    constructor(props) {
        super(props);
        
        let bagInfo = {
            price: 25.98,
            available: 90,
            total: 100,      
        }
        
        this.state = {
          coffeeBagInfo: bagInfo,
        };
      }

    loadCurrentPrice(){

    }

    render(){
        return (<>
            <HeaderBar />
            <CoffeeCard coffeeBagInfo={this.state.coffeeBagInfo}  />
            <CoffeeActions coffeeBagInfo={this.state.coffeeBagInfo}  />
        </>);
    }

}

export default Container; 