// Helper to deploy a contract

import { ethers, upgrades } from "hardhat";
import { BigNumber } from "ethers";

export async function deployContracts(nameargs: any[] = []) {
    // Contracts are deployed using the first account by default
    const [deployer] = await ethers.getSigners();

    // Deploy LP Token contract
    const LPToken = await ethers.getContractFactory("LPToken");
    const lpToken = await LPToken.deploy();
    await lpToken.deployed();
    console.log("LPToken deployed to:", lpToken.address);

    // Deploy Dapp Token contract
    const DappToken = await ethers.getContractFactory("DappToken");
    const dappToken = await DappToken.deploy();
    await dappToken.deployed();
    console.log("DappToken deployed to:", dappToken.address);

    // Deploy TokenFarm contract
    const rewardPerBlock = BigNumber.from("1000000000000000000");
    const TokenFarm = await ethers.getContractFactory("TokenFarm");
    const tokenFarm = await upgrades.deployProxy(TokenFarm, [dappToken.address, lpToken.address, rewardPerBlock]);
    await tokenFarm.deployed();
    console.log("TokenFarm deployed to:", tokenFarm.address);

    // Add TokenFarm contract to minter role at Dapp Token contract
    await dappToken.addMinter(tokenFarm.address);
    console.log("TokenFarm added to minter role at DappToken");

    return { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock };
}


export async function deployContractV2() {
    const { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock } = await deployContracts();

    const TokenFarmV2 = await ethers.getContractFactory("TokenFarmV2");
    const tokenFarmV2 = await upgrades.upgradeProxy(tokenFarm.address, TokenFarmV2);
    await tokenFarmV2.deployed();
    console.log("TokenFarmV2 deployed to:", tokenFarmV2.address);

    return { lpToken, dappToken, tokenFarm, tokenFarmV2, deployer, rewardPerBlock };
}

