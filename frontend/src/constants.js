const CONTRACT_ADDRESS = '0x24141eeEDDCB3A479599421f15Bc0245d47F7351';

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    
  };
};

export { CONTRACT_ADDRESS, transformCharacterData};