import React, { useState, useEffect } from 'react'

//import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'
import styled from 'styled-components'

export default function LocationSearchInput({ myRef, inputY, value, setAutoAddress }) {
  const [address, setAddress] = useState('')

  function handleChange(address) {
    setAddress(address)
  }

  // keep acount in sync
  useEffect(() => {
    setAddress(value)
  }, [value])

  function handleSelect(address) {
    
  }

  return (
    <>
    </>
  )
}

const List = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: 8px;
  min-width: 200px;
`

const SelectForm = styled.div`
  position: absolute;
  top: ${props => props.inputY};
  left: 16px;
  z-index: 10;
  margin-top: 38px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  background-color: #f1f2f6;
  color: #000;
  div {
    padding: 8px;
    /* width: 100%; */
    font-weight: 500;
  }
`