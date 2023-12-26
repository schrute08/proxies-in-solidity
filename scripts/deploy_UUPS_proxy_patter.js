const hre = require("hardhat");

async function main() {
    // deploy the v1 first
    const LogicContractV1 = await hre.ethers.getContractFactory("LogicContractUUPSV1");
    const logicContractV1 = await hre.upgrades.deployProxy(LogicContractV1, [16], { initializer: 'store' });
    await logicContractV1.waitForDeployment();
    
    const LogicContractV1Address = await logicContractV1.getAddress();
    console.log("LogicContractV1 deployed to:", LogicContractV1Address);

    console.log("********* UPGRADING TO V2 *********")
    console.log("********* USING UUPS PROXY PATTERN *********")


    // deploy the v2
    const LogicContractV2 = await hre.ethers.getContractFactory("LogicContractUUPSV2");

    // upgrade the proxy
    await hre.upgrades.upgradeProxy(LogicContractV1Address, LogicContractV2);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});