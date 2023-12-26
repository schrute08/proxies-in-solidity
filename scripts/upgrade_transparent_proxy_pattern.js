const { ethers ,upgrades }  = require("hardhat");

const proxyAddress = "0x9A378D0eCA796D5136a691b26281104534D07349"
async function upgrade() {
    // We get the contract to deploy: 
    const BoxV2  = await ethers.getContractFactory("LogicContractV2");
    let box = await upgrades.upgradeProxy(proxyAddress, BoxV2) 

    console.log(`----Your upgraded proxy is done----${await box.getAddress()} `)
}

upgrade().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});