# Final Project - Dynamic NFT Mini Game

### [Play On](https://nftbattle.netlify.app/) ⏩ https://nftbattle.netlify.app/

## Project Description

### Fullstack Dapp Mini Game using Dynamic NFTs
- Players can choose Valorant Heroes and mint them as an NFT
- Use the minted Hero NFT to battle against Thanos in the dapp
- Battling against Thanos changes the HP (On-Chain Metadata) of Hero NFT

## Directory Structure
- backend ⏩ Contains Smart Contract & Testing Files 
- frontend ⏩ Contains React Files

## How to run this project locally:

```shell
git clone https://github.com/ShivaShanmuganathan/blockchain-developer-bootcamp-final-project.git
```

### Frontend

- `cd frontend`
- `npm install`
- `npm start`
- Open `http://localhost:3000`

### Backend

- `cd backend`
- `npm install`
- `npx hardhat compile`
- `npx hardhat test`
- `npx hardhat run scripts/deploy.js`

### How to make your own hero characters and deploy contract

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


