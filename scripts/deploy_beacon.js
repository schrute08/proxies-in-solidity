const { ethers, upgrades } = require("hardhat");


async function main() {

    const LogicContractBeaconV1 = await ethers.getContractFactory("LogicContractBeaconV1");
    const beacon = await upgrades.deployBeacon(LogicContractBeaconV1, {unsafeAllow: ['constructor']});
    await beacon.waitForDeployment();
    
    const beaconAddress = await beacon.getAddress()
    console.log(`Beacon with Beacon Proxy Pattern V1 as implementation is deployed to address: ${beaconAddress}`);
    
    const beaconProxy1 = await upgrades.deployBeaconProxy(beaconAddress, LogicContractBeaconV1, []);
    await beaconProxy1.waitForDeployment();

    let versionAwareContractName = await beaconProxy1.getContractNameWithVersion();
    console.log(`Proxy Pattern and Version from Proxy 1 Implementation: ${versionAwareContractName}`);
    
    const beaconProxy2 = await upgrades.deployBeaconProxy(beaconAddress, LogicContractBeaconV1, []);
    await beaconProxy2.waitForDeployment();
    versionAwareContractName = await beaconProxy2.getContractNameWithVersion();
    console.log(`Proxy Pattern and Version from Proxy 2 Implementation: ${versionAwareContractName}`);
    
    const LogicContractBeaconV2 = await ethers.getContractFactory("LogicContractBeaconV2");
    const upgradedBeacon = await upgrades.upgradeBeacon(beaconAddress, LogicContractBeaconV2, {unsafeAllow: ['constructor']});
    console.log(`Beacon upgraded with Beacon Proxy Pattern V2 as implementation at address: ${await upgradedBeacon.getAddress()}`);
    
    versionAwareContractName = await beaconProxy1.getContractNameWithVersion();
    console.log(`Proxy Pattern and Version from Proxy 1 Implementation: ${versionAwareContractName}`);
    
    versionAwareContractName = await beaconProxy2.getContractNameWithVersion();
    console.log(`Proxy Pattern and Version from Proxy 2 Implementation: ${versionAwareContractName}`);
    
    versionAwareContractName = await beaconProxy1.versionAwareContractName();
    console.log(`Proxy Pattern and Version from Proxy 1 Storage: ${versionAwareContractName}`);
    
    versionAwareContractName = await beaconProxy2.versionAwareContractName();
    console.log(`Proxy Pattern and Version from Proxy 2 Storage: ${versionAwareContractName}`);
    
    const initTx = await beaconProxy1.initialize();
    
    const receipt = await initTx.wait();
    versionAwareContractName = await beaconProxy1.versionAwareContractName();
    console.log(`Proxy Pattern and Version from Proxy 1 Storage: ${versionAwareContractName}`);
    
    versionAwareContractName = await beaconProxy2.versionAwareContractName();
    console.log(`Proxy Pattern and Version from Proxy 2 Storage: ${versionAwareContractName}`);
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});