// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {VersionAware} from "./VersionAware.sol";

contract LogicContractBeaconV1 is Initializable, VersionAware {
    constructor() {
        _disableInitializers();
    }

    function initialize() external initializer {
        versionAwareContractName = "Beacon Proxy Pattern: V1";
    }
    
    function getContractNameWithVersion() public view override returns (string memory){
        return "Beacon Proxy Pattern: V1";
    }
}