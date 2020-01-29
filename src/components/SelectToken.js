import React from "react";
import { Field, Select } from "rimble-ui";
import { TOKEN_SYMBOLS } from "../factory";
import styled from "styled-components";

const SelectItem = styled.option`
  border: none;
  width: 100%;
  border-radius: 24px;
  background-color: ${props => props.theme.grey};
  padding: 0px 0.5rem 0px 0.5rem;
`;

const options = Object.keys(TOKEN_SYMBOLS)
  .filter(s => s !== "WCC")
  .map(s => ({ value: s, label: s }));

function renderOptions(token, i, selectedTokenSymbol, prefix) {
  if (selectedTokenSymbol === token.value) {
    return (
      <SelectItem key={i} value={token.value}>
        {prefix + " " + token.label}
      </SelectItem>
    );
  } else {
    return (
      <SelectItem key={i} value={token.value}>
        {token.label}
      </SelectItem>
    );
  }
}

export default function SelectToken({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  prefix
}) {
  return (
    <>
      <Field label="Choose your currency" width={1}>
        <Select
          width="100%"
          required={true}
          onChange={e => {
            setSelectedTokenSymbol(e.target.value);
          }}
        >
          {options.map((item, i) =>
            renderOptions(item, i, selectedTokenSymbol, prefix)
          )}
        </Select>
      </Field>
    </>
  );
}
