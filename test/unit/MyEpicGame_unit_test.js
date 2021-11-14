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

  // Testing Constructor & getBigBoss function 
  it('Verifying BigBoss Details', async function () {

    //console.log("Details of bigBoss:", await myEpicContract.getBigBoss());
    
    let bossTxn = await myEpicContract.getBigBoss();
    let result = transformCharacterData(bossTxn);
    
    //console.log(typeof(result));
    //console.log(result);
    
    expect(result.name).to.equal("Thanos: The Mad Titan");
    expect((result.hp).toString()).to.equal("10000");
    expect((result.maxHp).toString()).to.equal("10000");
    expect((result.attackDamage).toString()).to.equal("50");
  });


  // Testing Constructor & getAllDefaultCharacters function 
  it('Verifying Default Character Details', async function () {

    const charactersTxn = await myEpicContract.getAllDefaultCharacters();
    //console.log('charactersTxn:', charactersTxn);

    const characters = charactersTxn.map((characterData) =>
      transformCharacterData(characterData)
    );
    
    characters.forEach((character, index) => {
      
      // console.log(index);
      // console.log(character.name)
      // console.log(character.hp)
      // console.log(character.maxHp)
      // console.log(character.attackDamage)

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
  });


  // Minting Characters
  it('Minting Characters', async function () {
    
    for (let i = 0; i < 3; i++) {
      await expect(myEpicContract.connect(owner).mintCharacterNFT(i, {value: ethers.utils.parseEther("0.1")})).to.not.be.reverted; 
    }

  });


  // updateFee function with onlyOwner
  it('check UpdateFee should only work with owner', async function() {
    
    
    expect(await myEpicContract.owner()).to.equal(owner.address);
    await expect(myEpicContract.connect(addr1).updateFee(ethers.utils.parseEther("0.2"))).to.be.reverted;
    await expect(myEpicContract.connect(owner).updateFee(ethers.utils.parseEther("0.2"))).to.not.be.reverted;

  });

  // withdraw function with onlyOwner
  it('check Withdraw should only work with owner', async function() {
    
    
    expect(await myEpicContract.owner()).to.equal(owner.address);
    await expect(myEpicContract.connect(addr1).withdraw()).to.be.reverted;
    await expect(myEpicContract.connect(owner).withdraw()).to.not.be.reverted;

  });


  // tokenURI function can be checked with maxHp, attackDamage
  it('check TokenURI', async function() {
    
    let tokenURI = await expect(myEpicContract.connect(addr1).tokenURI(1)).to.not.be.reverted;
    // let nftAttributes = await (myEpicContract.connect(addr1).nftHolderAttributes(1));
    // console.log(nftAttributes);

  });


  // attackBoss - no return, but can be checked along with getBoss
  it('Attack Boss', async function() {
    
    await expect(myEpicContract.connect(owner).attackBoss()).to.not.be.reverted;
    await expect(myEpicContract.connect(addr2).attackBoss()).to.be.reverted;

  });

  // checkIfUserHasNFT
  it('Checking If User has NFT', async function() {
    
    await expect(myEpicContract.connect(owner).checkIfUserHasNFT()).to.not.be.reverted;
    let result = await myEpicContract.connect(addr2).checkIfUserHasNFT();
    expect((result.name).toString()).to.equal('');
    
  });


});