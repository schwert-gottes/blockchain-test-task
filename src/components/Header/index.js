import React, { useEffect, useState } from 'react';
// import Web3 from 'web3';
import { ethers } from 'ethers';
// reactstrap components
import { Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

import './index.scss';
function HomePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [receiverAddress, setReceiverAddress] = useState('');

  console.log('window.ethereum', window.ethereum);

  useEffect(() => {
    // Check if Metamask is installed
    if (typeof window.ethereum == 'undefined') {
      alert('No Metamask!');
    }
  }, []);

  const connectWallet = async () => {
    try {
      // Request access to the user's Metamask wallet
      const eth_requestAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = eth_requestAccounts[0];

      console.log('address', address);

      const eth_getBalance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });

      console.log('Current balance for this account', ethers.formatEther(eth_getBalance));

      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
    }
  };

  const handleCreateTransaction = async () => {
    if (!isConnected) return alert('Please connect to wallet');
    if (!receiverAddress) return alert('please enter receiver address');

    // const web3 = new Web3();
    // const isValid = web3.utils.isAddress(receiverAddress);
    // if (!isValid) return alert('Please enter valid address');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Get the signer from the provider
      const signer = await provider.getSigner();
      console.log('signer', signer);

      const eth_requestAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = eth_requestAccounts[0];

      // Check if MetaMask is installed and connected
      if (window.ethereum && window.ethereum.isMetaMask) {
        // Specify the transaction parameters
        const transactionParameters = {
          from: address, //0xbed9dA8f130aCC29F2580df183F3995eff78fb4D
          to: receiverAddress, // 0xecf8ce054b95a5b0e8b0c7d481d092b459b1569c
          value: '0x10', // Replace with the transaction value in Wei
          gas: '0x5208', // Replace with the gas limit in Wei
          gasPrice: '0x4A817C800', // Replace with the gas price in Wei
          nonce: '0x0', // Replace with the transaction nonce
          chainId: '0x1' // Replace with the desired chain ID
        };

        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        console.log('accountsaccounts', accounts);

        // Request transaction signature from MetaMask
        const result = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters]
        });

        console.log('Transaction sent:', result);
      } else {
        console.log('MetaMask is not installed or not connected.');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const getTransactions = async () => {
    if (!isConnected) return alert('Please connect to wallet');
    try {
      // Check if MetaMask is installed and connected
      if (window.ethereum && window.ethereum.isMetaMask) {
        // Request transactions
        const result = await window.ethereum.request({
          method: 'eth_getTransactionByHash',
          params: [window.ethereum.selectedAddress]
        });

        console.log('transactionsss', result);

        // setTransactions(result);
      } else {
        console.log('MetaMask is not installed or not connected.');
      }
    } catch (error) {
      console.error('Error retrieving transactions:', error);
    }
  };

  const handleSignMessage = async () => {
    if (!isConnected) return alert('Please connect to wallet');
    try {
      // Check if MetaMask is installed and connected
      if (window.ethereum && window.ethereum.isMetaMask) {
        // Specify the message to sign
        const message = 'Hello, Ai-Blockchain!';

        // Request signature from MetaMask
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, window.ethereum.selectedAddress]
        });

        console.log('Signature:', signature);
      } else {
        console.log('MetaMask is not installed or not connected.');
      }
    } catch (error) {
      console.error('Error signing message:', error);
    }
  };
  return (
    <Row className="padding-32">
      <Col xs="4" className="">
        {' '}
        <img src={require('assets/img/logo.png')} />{' '}
      </Col>
      <Col xs="4" className="logo">
        <Link to="/" className="margin-12">
          HOME
        </Link>{' '}
        <span>/</span>
        <Link to="/about" className="margin-12">
          ABOUT
        </Link>{' '}
        <span>/</span>
        <Link to="/loginpage" className="margin-12">
          LOGIN
        </Link>
      </Col>
      <Col xs="4" className="logo">
        <a className="margin-12" onClick={connectWallet}>
          {isConnected ? 'Connected' : 'Connect Wallet'}
        </a>
      </Col>
      <Col>
        <Button onClick={handleSignMessage}>Sign Message</Button>
        <Button onClick={getTransactions}>Get transactions</Button>
        <div>
          <input
            placeholder="Enter receiver address here"
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
          <Button onClick={handleCreateTransaction}>Create transactions</Button>
        </div>
      </Col>
    </Row>
  );
}

export default HomePage;
