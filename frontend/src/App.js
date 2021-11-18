import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from './utils/MyEpicGame.json';
import { ethers } from 'ethers';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';


// Constants





const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkNetwork = async(ethereum) => {
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    if (chainId !== '0x4'){
      window.alert("This Dapp works on Rinkeby Network Only. Please Approve to switch to Rinkeby");
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId:'0x4' }],
      }).catch(e => window.location.reload());
    }
    console.log(chainId);
    
  }



  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }
      //checkNetwork(ethereum);
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      await checkNetwork(ethereum);

      /*
       * Fancy method to request access to account.
       */
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
  /*
   * The function we will call that interacts with out smart contract
   */
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      }
      setIsLoading(false);
    };

    /*
    * We only want to run this, if we have a connected wallet
    */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);


  const renderContent = () => {

    if (isLoading) {
      return <LoadingIndicator />;
    }
    

    if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <img
              src="https://cdna.artstation.com/p/assets/images/images/025/949/914/original/caza-strophes-j-arrive-anime.gif?1587427329"
              alt="Valorant Gif"
            />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Connect Wallet To Get Started
        </button>
      </div>
    );
    /*
     * Scenario #2
     */
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
    else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}/>;
    }
  };


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
        
          <p className="header gradient-text">
          <img src="https://emoji.gg/assets/emoji/9309_valorant_logo.png" width="64px" height="64px" alt="Valorant_Cursed"/>
          Valorant NFT Mini Game on Rinkeby
          </p>
          
          

          
          
          <p className="sub-text">Team up to protect Earth from Thanos!</p>

          {renderContent()}
        </div>
        
      </div>
    </div>
  );
};

export default App;