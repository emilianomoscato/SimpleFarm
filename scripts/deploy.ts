import { ethers, upgrades } from "hardhat";

async function main() {

    const DappToken = await ethers.getContractFactory("DappToken");
    const dappToken = await DappToken.deploy();

    await dappToken.deployed();

    console.log("DappToken deployed to:", dappToken.address);

    const LPToken = await ethers.getContractFactory("LPToken");
    const lpToken = await LPToken.deploy();

    await lpToken.deployed();

    console.log("LPToken deployed to:", lpToken.address);

    const TokenFarm = await ethers.getContractFactory("TokenFarm");
    const tokenFarm = await upgrades.deployProxy(TokenFarm, [dappToken.address, lpToken.address, "1000000000000000000"]);
    
    await tokenFarm.deployed();
    
    console.log("TokenFarm deployed to:", tokenFarm.address);

    const TokenFarm2 = await ethers.getContractFactory("TokenFarmV2");
    const tokenFarm2 = await upgrades.upgradeProxy(tokenFarm.address, TokenFarm2);

    console.log("TokenFarm deployed to:", tokenFarm2.address);
    
    }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
