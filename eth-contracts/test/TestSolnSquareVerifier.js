const SquareVerifier = artifacts.require('SquareVerifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

const proof = require('../../zokrates/code/square/proof.json');

contract('TestSolnSquareVerifier', (accounts) => {
  describe('SolnSquareVerifier', () => {
    beforeEach(async () => {
      this.squareVerifier = await SquareVerifier.new({ from: accounts[0] });
      this.contract = await SolnSquareVerifier.new(this.squareVerifier.address, { from: accounts[0] });
    });
    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('should add a new solution to the contract', async () => {
      const key = await this.contract.generateKey(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
      const result = await this.contract.addSolution(1, accounts[1], key);
      assert.equal(result.logs[0].event, 'SolutionAdded', 'Could not add a solution');
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('should mint an ERC271 token', async () => {
      const initialSupply = (await this.contract.totalSupply()).toNumber();
      await this.contract.mintToken(2, accounts[2], proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
      const supply = (await this.contract.totalSupply()).toNumber();
      const diff = supply - initialSupply;
      assert.equal(diff, 1, 'Could not mint ERC271 token');
    });
  });
});
