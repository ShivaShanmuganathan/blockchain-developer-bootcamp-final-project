const { expect } = require('chai');

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    
  };
};

describe('MyEpicGame Unit Test', function () {

  let owner, addr1, addr2;

  before(async function () {

    [owner, addr1, addr2] = await ethers.getSigners();          
    myEpicGame = await ethers.getContractFactory('MyEpicGame', owner);

    myEpicContract = await myEpicGame.deploy(["Raze", "Phoenix", "Sage"],       
    ["QmYGgUYWA8pNrjYopSD5yf4cVGNUibWSvg3hgC3RitF2qB", 
    "QmPWXBPUEoPkMX3fQtQY1Jwjkmn4p9qVdcMQvhy42wkqMD", 
    "QmbsoshH2rPYgEdSJZWHQBkHn9YSDSZVsKALgmVHSDK7LM"],
    [100, 200, 400],                    
    [100, 50, 25],                      
    "Thanos: The Mad Titan", 
    "https://i.pinimg.com/564x/8a/b9/0e/8ab90eff3e1830f20dfa7990fa905afb.jpg",
    10000, 
    50 );
    await myEpicContract.deployed();
    
  });
  
  it('Checking Contract Owner using OpenZeppelin Ownable', async function() { 

    expect(await myEpicContract.owner()).to.equal(owner.address);

  });

  describe('Constructor()', function () {

    // Testing Constructor & getBigBoss function 
    it('Verifying BigBoss Details', async function () {

        let bossTxn = await myEpicContract.getBigBoss();
        let result = transformCharacterData(bossTxn);
                
        expect(result.name).to.equal("Thanos: The Mad Titan");
        expect((result.hp).toString()).to.equal("10000");
        expect((result.maxHp).toString()).to.equal("10000");
        expect((result.attackDamage).toString()).to.equal("50");

    });


    // Testing Constructor & getAllDefaultCharacters function 
    it('Verifying Default Character Details', async function () {

        const charactersTxn = await myEpicContract.getAllDefaultCharacters();
        const characters = charactersTxn.map((characterData) => transformCharacterData(characterData));
        characters.forEach((character, index) => {
        
          if(index == 0){
              expect(character.name).to.equal("Raze");
              expect((character.hp).toString()).to.equal("100");
              expect((character.maxHp).toString()).to.equal("100");
              expect((character.attackDamage).toString()).to.equal("100");
          }
          
          else if(index == 1){
              expect(character.name).to.equal("Phoenix");
              expect((character.hp).toString()).to.equal("200");
              expect((character.maxHp).toString()).to.equal("200");
              expect((character.attackDamage).toString()).to.equal("50");
          }

          else if(index == 2){
              expect(character.name).to.equal("Sage");
              expect((character.hp).toString()).to.equal("400");
              expect((character.maxHp).toString()).to.equal("400");
              expect((character.attackDamage).toString()).to.equal("25");
          }
        });
    });
  });
  
  describe('mintCharacterNFT()', function () { 

    // Minting Characters
    it('Should Mint Characters', async function () {
        
        for (let i = 0; i < 3; i++) {
          await expect(myEpicContract.connect(owner).mintCharacterNFT(i, {value: ethers.utils.parseEther("0.1")})).to.not.be.reverted; 
        }

    });

    it('Should Fail To Mint If Amount Is Not Exact', async function () {
      
      await expect(myEpicContract.connect(addr1).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.2")})).to.be.reverted; 
      await expect(myEpicContract.connect(addr1).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.05")})).to.be.reverted; 

    });


  });
  
  
  describe('updateFee()', function () { 

    // updateFee function can be used only by contract owner
    it('should fail since fee can only be updated by owner', async function() {
        
        await expect(myEpicContract.connect(addr1).updateFee(ethers.utils.parseEther("0.2"))).to.be.reverted;

    });

    it('should allow only the owner to update fee', async function() {
      
        await expect(myEpicContract.connect(owner).updateFee(ethers.utils.parseEther("0.2"))).to.not.be.reverted;

    });

  });
  
  describe('Withdraw()', function () { 

    // withdraw function with onlyOwner
    it('should fail since withdraw can only be called by owner', async function() { 
      
      await expect(myEpicContract.connect(addr1).withdraw()).to.be.reverted;

    });


    it('Withdraw should only work with owner and balance after withdrawal must be higher', async function() {
            
      const balanceBefore = await ethers.provider.getBalance(owner.address);
      //console.log(ethers.utils.formatEther(balanceBefore));
  
      await expect(myEpicContract.connect(owner).withdraw()).to.not.be.reverted;
  
      const balanceAfter = await ethers.provider.getBalance(owner.address);
      //console.log(ethers.utils.formatEther(balanceAfter));
      expect(balanceAfter.gt(balanceBefore), 'Balance is not higher').to.be.true;
        
    });

  });
  
  describe('TokenURI()', function () { 

    // tokenURI function can be checked with maxHp, attackDamage
    it('check TokenURI', async function() {
        
        let tokenURI = await expect(myEpicContract.connect(addr1).tokenURI(1)).to.not.be.reverted;
        // let nftAttributes = await (myEpicContract.connect(addr1).nftHolderAttributes(1));
        console.log(tokenURI);

    });

  });

  
  describe('Attack Boss()', function () { 

    // fail since account has not an NFT
    it('should fail to attack boss since account does not have an NFT  ', async function() {
      
      await expect(myEpicContract.connect(addr2).attackBoss()).to.be.reverted;

    });

    // attackBoss after minting NFT
    it('should attack boss', async function() {

      // await expect(myEpicContract.connect(owner).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.1")})).to.not.be.reverted; 
      await expect(myEpicContract.connect(owner).attackBoss()).to.not.be.reverted;

    });

    // attackBoss & check Stats
    it('should mint NFT & Attacks Boss, Both Boss & Player incur damages', async function() {
      
      await expect(myEpicContract.connect(addr1).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.2")})).to.not.be.reverted; 

      // Player1 Stats before Attack
      let player1_token = await myEpicContract.connect(addr1).nftHolders(addr1.address);
      let player1_char_beforeAttack = await myEpicContract.connect(addr1).nftHolderAttributes(player1_token);
      let player1_hp = transformCharacterData(player1_char_beforeAttack).hp;
      let player1_attack = transformCharacterData(player1_char_beforeAttack).attackDamage;
      
      // Boss Stats After Attack
      let beforeAttackBossTxn = await myEpicContract.getBigBoss();
      let beforeAttackResult = transformCharacterData(beforeAttackBossTxn);
      let bossHp = beforeAttackResult.hp;
      let boss_attack = beforeAttackResult.attackDamage;

      // ATTACK NOW!
      await expect(myEpicContract.connect(addr1).attackBoss()).to.not.be.reverted;

      //Check Player Hp After Attack
      let player1_char_afterAttack = await myEpicContract.connect(addr1).nftHolderAttributes(player1_token);
      let player1_hp_afterAttack = transformCharacterData(player1_char_afterAttack).hp;
      expect(player1_hp_afterAttack).to.equal(player1_hp - boss_attack);

      // Check Boss Hp
      let bossTxn = await myEpicContract.getBigBoss();
      let result = transformCharacterData(bossTxn).hp;
      expect(result).to.equal(bossHp - player1_attack);
      
      });

  });

  
  describe('checkIfUserHasNFT()', function () { 

    // checkIfUserHasNFT
    it('should check if user has NFT', async function() {
        
        let result = await myEpicContract.connect(owner).checkIfUserHasNFT();
        expect((result.name).toString()).to.not.be.equal('');

    });

    // checkIfUserHasNFT
    it('should fail since user does not have NFT', async function() {

      let result = await myEpicContract.connect(addr2).checkIfUserHasNFT();
      expect((result.name).toString()).to.be.equal('');

    });

  });
  
  describe('checkNFTOwner()', function () { 
    
    // check owner of NFT
    it('Checking the Owners of NFT', async function() {
        
        let totalTokens = (await myEpicContract.totalTokens()).toNumber();
        let ownersList = [];
        console.log(totalTokens);
        for (let i = 1; i <= totalTokens; i++) {
          ownersList.push(await myEpicContract.ownerOf(i)); 
        }
        
        ownersList.forEach((element) => {
          console.log(element);
        });
        
    });


  });
  
});