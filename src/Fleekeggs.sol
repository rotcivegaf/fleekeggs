// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { ERC1155 } from "solmate/tokens/ERC1155.sol";
import { Owned } from "solmate/auth/Owned.sol";
import { ECDSA } from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";

contract Fleekeggs is ERC1155, Owned {
    event SetMinter(address minter);

    address public minter;

    constructor (address _minter) Owned(msg.sender) {
        minter = _minter;
    }

    function uri(uint256 id) public override view returns (string memory) {

    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
        emit SetMinter(_minter);
    }

    function mintBatch(
        address to,
        uint256 expiry,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata signature
    ) external {
        require(expiry >= block.timestamp, "Expired");
        uint256 idsLength = ids.length;
        require(idsLength == amounts.length, "Wrong length");
        require(
            minter == ECDSA.recover(
                keccak256(abi.encode(to, expiry, ids, amounts)), signature
            ),
            "Not minter"
        );

        for (uint i; i < idsLength;) {
            _mint(
                to,
                ids[i],
                amounts[i],
                ""
            );

            unchecked { ++i; }
        }
    }
}
