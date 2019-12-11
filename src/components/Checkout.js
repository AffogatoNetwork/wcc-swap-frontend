import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'

//import Connect from './Connect'
import BuyCoffee from './BuyCoffee'
import Confirmed from './Confirmed'
import { useAppContext } from '../context'
import { TRADE_TYPES } from '../factory'

//import Confetti from 'react-dom-confetti'

const config = {
  angle: 90,
  spread: 76,
  startVelocity: 51,
  elementCount: 154,
  dragFriction: 0.1,
  duration: 7000,
  stagger: 0,
  width: '10px',
  height: '10px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
}

export function useCount(initialValue, max) {
  const [state, setState] = useAppContext()

  function increment() {
    setState(state => {
      const newCount = state.count + 1
      if (!max || newCount <= max) {
        return { ...state, count: newCount }
      } else {
        return state
      }
    })
  }

  function decrement() {
    if (state.count > 1) {
      setState(state => ({ ...state, count: state.count - 1 }))
    }
  }

  function setCount(val) {
    setState(state => ({ ...state, count: val }))
  }

  // ok to disable exhaustive-deps for `setState` b/c it's actually just a useState setter
  useEffect(() => {
    if (initialValue) {
      setState(state => ({ ...state, count: initialValue }))
    }
  }, [initialValue]) // eslint-disable-line react-hooks/exhaustive-deps

  return [state.count, increment, decrement, setCount]
}

export default function Checkout({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  totalSupply,
  ethPrice,
  usdBalance,
  reserveWCCToken,
  currentTransactionHash,
  currentTransactionType,
  currentTransactionAmount,
  setCurrentTransaction,
  clearCurrentTransaction,
  setShowConnect,
  showConnect  
}) {
  const { library } = useWeb3Context()
  const [state, setState] = useAppContext()
  

  const [lastTransactionHash, setLastTransactionHash] = useState('')
  const [lastTransactionType, setLastTransactionType] = useState('')
  const [lastTransactionAmount, setLastTransactionAmount] = useState('')

  const pending = !!currentTransactionHash
  useEffect(() => {
    if (currentTransactionHash) {
      library.waitForTransaction(currentTransactionHash).then(() => {
        setLastTransactionHash(currentTransactionHash)
        setLastTransactionType(currentTransactionType)
        setLastTransactionAmount(currentTransactionAmount)
        clearCurrentTransaction()
      })
    }
  }, [
    currentTransactionHash,
    library,
    lastTransactionHash,
    state.showConnect,
    state.visible,
    setShowConnect,
    clearCurrentTransaction,
    lastTransactionHash,
    currentTransactionType,
    currentTransactionAmount
  ])

  function closeCheckout() {
    setShowConnect(false)
    if (state.visible) {
      setLastTransactionHash('')
      setState(state => ({ ...state, visible: !state.visible }))
    }
  }

  function renderContent() {
    if (lastTransactionHash) {
      return (
        <Confirmed
          hash={lastTransactionHash}
          type={lastTransactionType}
          amount={lastTransactionAmount}
          closeCheckout={closeCheckout}
          clearLastTransaction={() => {
            setLastTransactionHash('')
            setLastTransactionType('')
            setLastTransactionAmount('')
          }}
        />
      )
    } else {
        return (
            <BuyCoffee
            selectedTokenSymbol={selectedTokenSymbol}
            setSelectedTokenSymbol={setSelectedTokenSymbol}
            ready={ready}
            unlock={unlock}
            validateBuy={validateBuy}
            buy={buy}
            totalSupply={totalSupply}
            ethPrice={ethPrice}
            usdBalance={usdBalance}
            reserveWCCToken={reserveWCCToken}
            pending={pending}
            currentTransactionHash={currentTransactionHash}
            setCurrentTransaction={setCurrentTransaction}
            setShowConnect={setShowConnect}
            />                        
        )      
    }
  }

  return (
    renderContent()
  )
}
