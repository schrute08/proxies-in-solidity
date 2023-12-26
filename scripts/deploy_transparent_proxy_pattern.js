const hre = require("hardhat");

async function main() {
    // deploy the v1 first
    const LogicContractV1 = await hre.ethers.getContractFactory("LogicContractV1");
    const logicContractV1 = await hre.upgrades.deployProxy(LogicContractV1, [16], { initializer: 'store' });
    await logicContractV1.waitForDeployment();
    
    const LogicContractV1Address = await logicContractV1.getAddress();
    console.log("LogicContractV1 deployed to:", LogicContractV1Address);
    console.log("LogicContract V1 implementation address: ", await hre.upgrades.erc1967.getImplementationAddress(LogicContractV1Address));
    console.log("LogicContract V1 proxy admin address: ", await hre.upgrades.erc1967.getAdminAddress(LogicContractV1Address));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});