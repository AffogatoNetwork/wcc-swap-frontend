import React, { Component } from "react";
import { Card, Heading, Image, Flex } from "rimble-ui";
import coffee_bag from "../assets/coffee_bag.png";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";
import { amountFormatter } from '../factory'
import "../App.scss";
import useAxios from "axios-hooks";


export default function CoffeeCard({ coffeeHash, totalSupply, dollarPrice, reserveWCCToken }) {
  //let coffeeInfo
  const [{ data, loading, error }, refetch] = useAxios(
    `https://ipfs.infura.io/ipfs/${coffeeHash}`
  );

  if (loading) return <Heading.h3>Loading...</Heading.h3>;
  if (error) return <Heading.h3>Error...</Heading.h3>;

  return (
    <Card
      className="coffee-card"
      mx={"auto"}
      bg="#FCF6F0"
      boxShadow="3"
      borderRadius={10}
    >
      <Image alt={contentStrings.coffeeBag} src={coffee_bag} height="400px" />
      <div contentAlign="left" divDirection="column" textAlign="left">
        <Heading.h2 color={colors.brown.base} textAlign="left">
          Premium Specialty Coffee
        </Heading.h2>
        <ul>
          <li>Notes: {data.coffee.notes}</li>
          <li>Variety: {data.coffee.Variety}</li>
          <li>Process: {data.coffee.Process}</li>
          <li>Score: {data.coffee.score}/100</li>
        </ul>
      </div>
      <div>
        <Heading.h3 color={colors.brown.base}>{dollarPrice ? `$${amountFormatter(dollarPrice, 18, 2)} USD` : '$0.00'}</Heading.h3>
      </div>
      <div>
        <Heading.h5 color={colors.brown.text}>
            {reserveWCCToken && totalSupply
               ? `${amountFormatter(reserveWCCToken, 18, 0)}/${totalSupply} available`
               : ''}     
        </Heading.h5>        
      </div>
    </Card>
  );
}
