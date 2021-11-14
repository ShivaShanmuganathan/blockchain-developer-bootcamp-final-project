const { expect } = require('chai');
var chai = require('chai');
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    
  };
};
// INCLUDE REVERT WITH FUNCTION!!
describe('MyEpicGame Integration Test', function () {

  let owner, addr1, addr2;

  beforeEach(async function () {

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

  // Testing Constructor & getBigBoss function 
  it('Check Boss Details, Character Details & Mint Tokens', async function () {

    //console.log("Details of bigBoss:", await myEpicContract.getBigBoss());
    
    let bossTxn = await myEpicContract.getBigBoss();
    let result = transformCharacterData(bossTxn);
    
    //console.log(typeof(result));
    //console.log(result);
    
    expect(result.name).to.equal("Thanos: The Mad Titan");
    expect((result.hp).toString()).to.equal("10000");
    expect((result.maxHp).toString()).to.equal("10000");
    expect((result.attackDamage).toString()).to.equal("50");

    const charactersTxn = await myEpicContract.getAllDefaultCharacters();
    //console.log('charactersTxn:', charactersTxn);

    const characters = charactersTxn.map((characterData) =>
      transformCharacterData(characterData)
    );
    
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
    })

    let checkNftTxn = await myEpicContract.connect(addr1).checkIfUserHasNFT();
    expect((checkNftTxn.name).toString()).to.equal('');

    await expect(myEpicContract.connect(addr1).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.1")})).to.not.be.reverted; 

    let checkNftTxn_2 = await myEpicContract.connect(addr1).checkIfUserHasNFT();
    expect((checkNftTxn_2.name).toString()).to.not.be.equal('');
    
  });

  // attackBoss & check Stats
  it('Player Mints Token & Attacks Boss, Both Boss & Player incur damages', async function() {
    
    await expect(myEpicContract.connect(addr1).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.1")})).to.not.be.reverted; 

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

  // updateFee function with onlyOwner
  it('Contract Owner Updates Fee, Player mints NFT with new Fee, and owner withdraw the contract balance', async function() {
     
    expect(await myEpicContract.owner()).to.equal(owner.address);
    
    await expect(myEpicContract.connect(addr1).updateFee(ethers.utils.parseEther("0.2"))).to.be.reverted;
    await expect(myEpicContract.connect(owner).updateFee(ethers.utils.parseEther("0.2"))).to.not.be.reverted;
    
    await expect(myEpicContract.connect(addr1).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.1")})).to.be.reverted; 
    await expect(myEpicContract.connect(addr1).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.2")})).to.not.be.reverted; 

    await expect(myEpicContract.connect(addr2).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.1")})).to.be.reverted; 
    await expect(myEpicContract.connect(addr2).mintCharacterNFT(0, {value: ethers.utils.parseEther("0.2")})).to.not.be.reverted; 
    
    await expect(myEpicContract.connect(addr1).withdraw()).to.be.reverted;
    await expect(myEpicContract.connect(owner).withdraw()).to.not.be.reverted;

  });


});