import React, { Component } from "react";
import { Card, Heading, Image, Flex } from "rimble-ui";
import coffee_bag from "../assets/coffee_bag.png";
import contentStrings from "../constants/Localization";
import colors from "../theme/colors";
import "../App.scss";

export default function CoffeeCard({ totalSupply }) {
  return (
    <Card
      className="coffee-card"
      height="550px"
      mx={"auto"}
      bg="#FCF6F0"
      boxShadow="3"
      borderRadius={10}
    >
      <Flex contentAlign="left">
        <Heading.h6 color={colors.brown.base} textAlign="left">
          Light bodied with milk chocolate flavors, an an exceptional ability to
          carry the flavors.
        </Heading.h6>
      </Flex>
      <Image alt={contentStrings.coffeeBag} src={coffee_bag} height="85%" />
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
