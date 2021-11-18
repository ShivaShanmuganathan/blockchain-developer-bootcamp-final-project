import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css';
import LoadingIndicator from '../LoadingIndicator';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure()
/*
 * We pass in our characterNFT metadata so we can a cool card in our UI
 */
const Arena = ({ characterNFT, setCharacterNFT }) => {
  // State
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState('');
  //const [showToast, setShowToast] = useState(false);

  const fetchBoss = async () => {
    const bossTxn = await gameContract.getBigBoss();
    console.log('Boss:', bossTxn);
    setBoss(transformCharacterData(bossTxn));
  };

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState('attacking');
        console.log('Attacking boss...');
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log('attackTxn:', attackTxn);
        setAttackState('hit');
  
        toast.success("🔥THANOS WAS ATTACKED🔥", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
  
        
        
        }
      } 
    catch (error) {
      console.error('Error attacking boss:', error);
      setAttackState('');
      }
    };

  const onAttackComplete = (newBossHp, newPlayerHp) => {
          const bossHp = newBossHp.toNumber();
          const playerHp = newPlayerHp.toNumber();

          console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

          /*
          * Update both player and boss Hp
          */
          setBoss((prevState) => {
              return { ...prevState, hp: bossHp };
          });

          setCharacterNFT((prevState) => {
              return { ...prevState, hp: playerHp };
          });
      };


  
  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
      }
    }, []);

  useEffect(() => {
  /*
   * Setup async function that will get the boss from our contract and sets in state
   */
    
        if (gameContract) {
          fetchBoss();
          gameContract.on('AttackComplete', onAttackComplete);
        }

        return () => {
          if (gameContract) {
              gameContract.off('AttackComplete', onAttackComplete);
          }
        }

    }, [gameContract]);



  
  



 return (
  <div className="arena-container">
     {/* Add your toast HTML right here */}
     
    {/* {
      boss && characterNFT && toast.success('💥 ${boss.name} was hit for ${characterNFT.attackDamage}!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        })
    } */}

    {/* Boss */}

    

    {boss && (
      <div className="boss-container">
        <div className={`boss-content ${attackState}`}>
          <h2>👑 {boss.name} 🔥</h2>
          <div className="image-content">
            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
            <div className="health-bar">
              <progress value={boss.hp} max={boss.maxHp} />
              <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
            </div>
          </div>
        </div>
        <div className="attack-container">
          <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${boss.name}`}
          </button>
        </div>
        {attackState === 'attacking' && (
            <div className="loading-indicator">
              <LoadingIndicator />
              <p>Attacking ⚔️</p>
            </div>
          )}
      </div>
    )}

    {/* Character NFT */}
    {characterNFT && (
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img
                src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
                alt={`Character ${characterNFT.name}`}
              />
              <div className="health-bar">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
         {/* <div className="active-players">
          <h2>Active Players</h2>
          <div className="players-list">{renderActivePlayersList()}</div>
        </div> */}
      </div>
    )}
   
  </div>
  );
};

export default Arena;