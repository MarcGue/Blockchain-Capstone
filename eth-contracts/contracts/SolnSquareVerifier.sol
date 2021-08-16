pragma solidity >=0.5.0;

import "./Verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {

}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable {
    SquareVerifier private squareVerifier;

    constructor(address squareVerifierAddress) public {
        squareVerifier = SquareVerifier(squareVerifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address to;
    }

    // TODO define an array of the above struct
    Solution[] private solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private submittedSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address to, bytes32 key);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
        uint256 index,
        address to,
        bytes32 key
    ) public {
        Solution memory solution = Solution(index, to);
        solutions.push(solution);
        submittedSolutions[key] = solution;
        emit SolutionAdded(index, to, key);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(
        uint256 index,
        address to,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory inputs
    ) public whenNotPaused {
        bytes32 key = generateKey(a, b, c, inputs);
        require(
            submittedSolutions[key].to == address(0),
            "Solution already exists"
        );
        require(
            squareVerifier.verifyTx(a, b, c, inputs),
            "Solution is incorrect"
        );

        addSolution(index, to, key);
        mint(to, index);
    }

    function generateKey(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory inputs
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(a, b, c, inputs));
    }
}
