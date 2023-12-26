// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "./OwnableUpgradeable.sol";

contract LogicContractUUPSV1 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 private value;

    // Stores a new value in the contract
    function store(uint256 _newValue) public {
        value = _newValue;
    }

    /*
        ###########################  UUPS  ###################################3
    */

    //initializer instead of a constructor
    function initialize(uint256 _value) public initializer {
        value = _value;

        // OwnableUpgradeable: owner = msg.sender;
        __Ownable_init();
    }

    //need to override this fct
    //only the owner can upgrade this implementation
    function _authorizeUpgrade(address) internal override onlyOwner {}
}