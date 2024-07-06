// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Fleekeggs} from "../src/Fleekeggs.sol";

contract FleekeggsTest is Test {
    Fleekeggs fleekeggs;

    address owner = address(0xFF);
    address minter;
    uint256 minterPk;
    address user = address(0xAAAA);

    function setUp() public {
        (minter, minterPk) = makeAddrAndKey("minter");

        vm.prank(owner);
        fleekeggs = new Fleekeggs(minter);
    }

    function test_constructor() public view {
        assertEq(fleekeggs.owner(), owner);
        assertEq(fleekeggs.minter(), minter);
    }

    function test_setMinter() public {
        address newMinter = address(0xFFF);
        vm.prank(owner);
        fleekeggs.setMinter(newMinter);
        assertEq(fleekeggs.minter(), newMinter);
    }

    function test_try_setMinter_withoutOwnership() public {
        vm.expectRevert("UNAUTHORIZED");
        fleekeggs.setMinter(address(0));
    }

    function test_mintBatch() public {
        address to = address(0x12345678);
        uint256[] memory ids = new uint256[](5);
        ids[0] = 0;
        ids[1] = 4;
        ids[2] = 2;
        ids[3] = 1;
        ids[4] = 0;

        uint256[] memory amounts = new uint256[](5);
        amounts[0] = 10;
        amounts[1] = 4;
        amounts[2] = 2;
        amounts[3] = 1;
        amounts[4] = 30;

        vm.prank(minter);
        fleekeggs.mintBatch(
            to,
            ids,
            amounts
        );

        assertEq(fleekeggs.balanceOf(to, 0), 10 + 30);
        assertEq(fleekeggs.balanceOf(to, 1), 1);
        assertEq(fleekeggs.balanceOf(to, 2), 2);
        assertEq(fleekeggs.balanceOf(to, 4), 4);
    }

    function test_try_mintBatch_withoutMinterOwnership() public {
        address to = address(0x12345678);
        uint256[] memory ids = new uint256[](5);
        ids[0] = 0;

        uint256[] memory amounts = new uint256[](5);
        amounts[0] = 1;

        vm.prank(user);

        vm.expectRevert("Not minter");
        fleekeggs.mintBatch(
            to,
            ids,
            amounts
        );
    }

    function test_mintBatchWithSignature() public {
        address to = address(0x12345678);
        uint256 expiry = block.timestamp;
        uint256[] memory ids = new uint256[](5);
        ids[0] = 0;
        ids[1] = 4;
        ids[2] = 2;
        ids[3] = 1;
        ids[4] = 0;

        uint256[] memory amounts = new uint256[](5);
        amounts[0] = 10;
        amounts[1] = 4;
        amounts[2] = 2;
        amounts[3] = 1;
        amounts[4] = 30;

        bytes32 nonce;

        bytes32 hash = keccak256(abi.encode(to, expiry, nonce, ids, amounts));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(minterPk, hash);

        vm.prank(user);
        fleekeggs.mintBatchWithSignature(
            to,
            expiry,
            ids,
            amounts,
            abi.encodePacked(r, s, v)
        );

        assertEq(fleekeggs.balanceOf(to, 0), 10 + 30);
        assertEq(fleekeggs.balanceOf(to, 1), 1);
        assertEq(fleekeggs.balanceOf(to, 2), 2);
        assertEq(fleekeggs.balanceOf(to, 4), 4);

        assertEq(fleekeggs.nonceCount(to), 1);
    }

    function test_try_mintBatchWithSignature_twiceWithTheSameSignature() public {
        address to = address(0x12345678);
        uint256 expiry = block.timestamp;
        uint256[] memory ids = new uint256[](5);
        ids[0] = 0;
        uint256[] memory amounts = new uint256[](5);
        amounts[0] = 10;

        uint256 nonce = 0;

        bytes32 hash = keccak256(abi.encode(to, expiry, nonce, ids, amounts));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(minterPk, hash);

        vm.startPrank(user);
        fleekeggs.mintBatchWithSignature(
            to,
            expiry,
            ids,
            amounts,
            abi.encodePacked(r, s, v)
        );

        vm.expectRevert("Not minter");
        fleekeggs.mintBatchWithSignature(
            to,
            expiry,
            ids,
            amounts,
            abi.encodePacked(r, s, v)
        );
    }
}
