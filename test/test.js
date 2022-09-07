const { expect } = require("chai");
const {loadFixture} = require("ethereum-waffle");



describe("ERC1155TOKEN", ()=>{

  async function testFixture(){
    let contract;
    let ERC1155Token;

    const [owner, treasury, addr1] = await ethers.getSigners();

    ERC1155Token = await ethers.getContractFactory("ERC1155Token");
    contract = await ERC1155Token.deploy(treasury.address)
    await contract.deployed();

    return {owner,  treasury, addr1, contract, }
  }

  describe("Deployed ERC1155TOKEN",  ()=>{

    it("Should set the treasury of the contract", async()=>{
        const { owner, contract} = await loadFixture(testFixture);
        expect(await contract.owner()).to.be.equal(owner.address);
    })

    it("Should set the uri for minting", async()=>{
        const {addr1, owner, contract} = await loadFixture(testFixture);
        contract.connect(owner).mint('treasuryTokens.com/')

        //expects to fail addr1 is not owner
        await expect(contract.connect(addr1).mint('treasuryTokens.com/')).to.be.reverted;
    })

    it("Should get the uri of the tokens", async()=>{
        const { contract } = await loadFixture(testFixture);
       
        expect(await contract.uri(1)).to.be.equal('treasuryTokens.com//id=1.json');
    })


      it("Should change the uri of the token", async()=>{
        const { contract} = await loadFixture(testFixture);

        await contract.setUri(1, 'NewURI.com/')
        expect('NewURI.com//id=1.json').to.be.equal(await contract.uri(1))
    })


    it("Should change the treasury address", async()=>{
        const { contract, treasury, addr1} = await loadFixture(testFixture);
        await contract.setTreasury(addr1.address);

        //old treasury address
        expect(await contract.treasury()).to.not.be.equal(treasury.address);

        expect(await contract.treasury()).to.be.equal(addr1.address);
        
    })
  })

})