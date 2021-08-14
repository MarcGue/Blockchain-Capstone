var ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', (accounts) => {
  describe('match erc721 spec', function () {
    beforeEach(async function () {
      this.contract = await ERC721Mintable.new({ from: accounts[0] });

      // TODO: mint multiple tokens
      for (let i = 0; i <= 3; i++) {
        await this.contract.mint(accounts[i], i, { from: accounts[0] });
      }
      await this.contract.mint(accounts[0], 4, { from: accounts[0] });
    });

    it('should return total supply', async function () {
      const totalSupply = await this.contract.totalSupply();
      assert.equal(totalSupply, 5, 'totalSupply is invalid');
    });

    it('should get token balance', async function () {
      const tokenBalanceOfFirstAccount = await this.contract.balanceOf(accounts[0]);
      assert.equal(tokenBalanceOfFirstAccount, 2, 'tokenBalance of the first account is invalid');
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it('should return token uri', async function () {
      const tokenURI = await this.contract.tokenURI(1);
      assert.equal(
        tokenURI,
        'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1',
        'tokenURI does not match expected URI'
      );
    });

    it('should transfer token from one owner to another', async function () {
      // A third account which is not involved needs to approve that a token can be transferred
      await this.contract.approve(accounts[0], 2, { from: accounts[2] });
      // Token with the id 2 from account[2] will be transferred to account[0]
      await this.contract.transferFrom(accounts[2], accounts[0], 2, { from: accounts[2] });
      const tokenBalanceOfFirstAccount = await this.contract.balanceOf(accounts[0]);
      assert.equal(tokenBalanceOfFirstAccount, 3, 'tokenBalance of the second account is invalid');
    });
  });

  describe('have ownership properties', function () {
    beforeEach(async function () {
      this.contract = await ERC721Mintable.new({ from: accounts[0] });
    });

    it('should fail when minting when address is not contract owner', async function () {
      const minted = false;
      try {
        minted = await this.contract.mint(accounts[0], 5, { from: accounts[1] });
      } catch (err) {}
      assert.equal(minted, false, 'Could mint even if i am not the owner');
    });

    it('should return contract owner', async function () {
      const owner = await this.contract.getOwner();
      assert.equal(accounts[0], owner, 'Did not return the correct owner');
    });
  });
});
