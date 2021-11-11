const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
      ["Raze", "Phoenix", "Sage"],       // Names
      ["QmRf7xG7Q1vKx7qFxM2DmainkEUwZbGx3tkLfvEGHcknGV", // Images
      "QmPWXBPUEoPkMX3fQtQY1Jwjkmn4p9qVdcMQvhy42wkqMD", 
      "QmWY8zJdznEraEi6tQtgnWp9tevknqcmaam3BSFdVY8wBy"],
      [100, 200, 400],                    // HP values
      [100, 50, 25],                      // Attack damage values
      "Thanos: The Mad Titan", // Boss name
      "https://i.pinimg.com/564x/8a/b9/0e/8ab90eff3e1830f20dfa7990fa905afb.jpg", // Boss image
      10000, // Boss hp
      50 // Boss attack damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  // let txn;
  // txn = await gameContract.mintCharacterNFT(2);
  // await txn.wait();


  // let returnedTokenUri = await gameContract.tokenURI(1);
  // console.log("Token URI:", returnedTokenUri);


  // txn = await gameContract.attackBoss();
  // await txn.wait();

  // txn = await gameContract.attackBoss();
  // await txn.wait();

  
  // console.log("Done Attacking!");




};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();