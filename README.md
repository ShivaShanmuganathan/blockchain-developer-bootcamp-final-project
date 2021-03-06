# Final Project - 🎮 Dynamic NFT Mini Game 🕹

### [Play On 🎮](https://nftbattle.netlify.app/) ⏩ https://nftbattle.netlify.app/

## Project Description 📝

### Fullstack Dapp Mini Game using Dynamic NFTs 🎟

- Player can connect to the mini game using Metamask on Rinkeby Network
- Players can choose Valorant Heroes and mint them as an NFT
- Use the minted Hero NFT to battle against Thanos in the dapp
- Battling against Thanos changes the HP (On-Chain Metadata) of Hero NFT

## Directory Structure 📂
- `backend/contracts` ⏩ Smart Contract Code [Deployed in the Rinkeby test network]
- `frontend` ⏩ Project's React frontend.
- `backend/test` ⏩ Tests for Smart Contracts.

## Run this project locally 🏃🏾‍♂️💨

```shell
git clone https://github.com/ShivaShanmuganathan/blockchain-developer-bootcamp-final-project.git
```

### Frontend 🎨🖌

- `cd frontend`
- `npm install` Install Dependencies
- `npm start` Start the frontend in localhost 
- Open `http://localhost:3000` <br />
We can use the localhost frontend to interact with the smart contract on rinkeby

### Backend 🔗

- `cd backend`
- `npm install` Install Dependencies
- `npx hardhat --version` Check if Hardhat is properly installed 
- `npx hardhat compile` Compile the Smart Contract
- `npx hardhat test` Test the Smart Contract Locally
- `npx hardhat run scripts/deploy.js` Deploy the Smart Contract Locally

### If you want to deploy it on Rinkeby Network

1. open `hardhat.config.js` file and uncomment the below lines <br />
    // rinkeby: { <br />
    //   url: process.env.STAGING_ALCHEMY_KEY, <br />
    //   accounts: [process.env.PRIVATE_KEY], <br />
    // }, <br />
2. change filename `.env.example` to `.env`
3. Get Alchemy Key for Rinkeby Network from Alchemy, and assign it to `STAGING_ALCHEMY_KEY` in `.env`
4. Get `PRIVATE_KEY` from MetaMask, and assign it to `PRIVATE_KEY` in `.env`
5. RUN `npx hardhat run scripts/deploy.js --network rinkeby` to deploy your contract to the Rinkeby Network. 


```
STAGING_ALCHEMY_KEY=
PRIVATE_KEY=
```

### How to make your own hero characters

- Open `scripts/deploy.js` in `backend` folder
- This is the code you need to edit to make your own heroes <br /> `const gameContract = await gameContractFactory.deploy( 
      ["Raze", "Phoenix", "Sage"],       
      ["QmYGgUYWA8pNrjYopSD5yf4cVGNUibWSvg3hgC3RitF2qB", 
      "QmPWXBPUEoPkMX3fQtQY1Jwjkmn4p9qVdcMQvhy42wkqMD", 
      "QmbsoshH2rPYgEdSJZWHQBkHn9YSDSZVsKALgmVHSDK7LM"],
      [100, 200, 400],                    
      [100, 50, 25],                      
      "Thanos: The Mad Titan", 
      "https://i.pinimg.com/564x/8a/b9/0e/8ab90eff3e1830f20dfa7990fa905afb.jpg", 
      10000, 
      50 
  );`
- Change `["Raze", "Phoenix", "Sage"]` to the character names you want
- Upload images you want to [IPFS using Pinata](https://www.pinata.cloud/) and get the CID of the uploaded images
- Change 
      `["QmYGgUYWA8pNrjYopSD5yf4cVGNUibWSvg3hgC3RitF2qB", 
      "QmPWXBPUEoPkMX3fQtQY1Jwjkmn4p9qVdcMQvhy42wkqMD", 
      "QmbsoshH2rPYgEdSJZWHQBkHn9YSDSZVsKALgmVHSDK7LM"]` to the CID of the images uploaded to IPFS
- Change `[100, 200, 400]` to the maxHealth you want for the Heroes
- Change `[100, 50, 25]` to the attackDamage you want for the Heroes
- Change `Thanos: The Mad Titan` to the name of your Boss
- Change `https://i.pinimg.com/564x/8a/b9/0e/8ab90eff3e1830f20dfa7990fa905afb.jpg` to the image url of your Boss
- Change `10000` to edit the Boss Health
- Change `50` to edit the Boss Attack Damage

## Gas Report ⛽
![gasReport](./gas-report.JPG)

## Test Coverage Report 🛸
![testReport](./test-coverage-report.JPG)

## [Project Walkthrough Video 🎥](https://www.loom.com/share/8f68f312c12046acb23962dca11fbd8a) 

[Video Link](https://www.loom.com/share/8f68f312c12046acb23962dca11fbd8a)

## Public Ethereum Wallet For Certification 🎓

`0xadf2228d5bb78f8257d2480af7bff70d0cb9e6a0`
