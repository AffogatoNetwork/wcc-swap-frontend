import React, { Component } from "react";
import { Card, Heading, Image, Flex } from "rimble-ui";
import coffee_bag from "../assets/coffee_bag.png";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";
import "../App.scss";
import useAxios from "axios-hooks";

export default function CoffeeCard({ totalSupply, coffeeHash }) {
  //let coffeeInfo
  const [{ data, loading, error }, refetch] = useAxios(
    `https://ipfs.infura.io/ipfs/${coffeeHash}`
  );
  console.log("TCL: CoffeeCard -> data", data);

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
      <Flex contentAlign="left" flexDirection="column" textAlign="left">
        <Heading.h2 color={colors.brown.base} textAlign="left">
          Premium Specialty Coffee
        </Heading.h2>
        <ul>
          <li>Notes: {data.coffee.notes}</li>
          <li>Variety: {data.coffee.Variety}</li>
          <li>Process: {data.coffee.Process}</li>
          <li>Score: {data.coffee.score}/100</li>
        </ul>
      </Flex>
      <Image alt={contentStrings.coffeeBag} src={coffee_bag} height="400px" />
      <Flex>
        <Heading.h3 color={colors.brown.base}>$96</Heading.h3>
        <Heading.h3 color={colors.brown.base} ml="2">
          USD
        </Heading.h3>
      </Flex>
      <Flex>
        <Heading.h5 color={colors.brown.text}>80/{totalSupply}</Heading.h5>
        <Heading.h5 color={colors.brown.text} ml="2">
          {contentStrings.available}
        </Heading.h5>
      </Flex>
    </Card>
  );
}
