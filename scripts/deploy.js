const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(
        ["Raze", "Cypher", "Omen"],       // Names
        ["https://d1lss44hh2trtw.cloudfront.net/assets/article/2020/04/14/valorant-characters-abilities-and-details-raze_feature.jpg", // Images
        "https://mobalytics.gg/wp-content/uploads/2020/04/omen-character-select.jpg", 
        "https://cdnportal.mobalytics.gg/production/2020/04/cypher-splash.jpg"],
        [100, 200, 400],                    // HP values
        [100, 50, 25],
        ["Paint Shell Grenade", "Spycam", "Dark Smoke"],
        ["Rocket Launcher", "Neural Theft", "Teleport"],                       // Attack damage values
        "Thanos: The Mad Titan", // Boss name
        "https://i.pinimg.com/564x/8a/b9/0e/8ab90eff3e1830f20dfa7990fa905afb.jpg", // Boss image
        1000, // Boss hp
        50 // Boss attack damage
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);

    
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