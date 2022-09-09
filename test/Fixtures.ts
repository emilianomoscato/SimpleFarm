import { deployContracts } from "./DeployContractHelper";
import { ethers } from "hardhat";

export async function deployTokenFarmFixture() {
    const { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock } = await deployContracts();

    const [alice, bob, empty_account] = await ethers.getSigners();

    const lpTokenAmount = "1000000000000000000000";

    // Transfer LP tokens to Alice
    await lpToken.transfer(alice.address, lpTokenAmount);

    return { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock, alice, empty_account, lpTokenAmount };
}

export async function depositFixture() {
    const { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock, alice, empty_account, lpTokenAmount } = await deployTokenFarmFixture();

    await lpToken.connect(alice).approve(tokenFarm.address, lpTokenAmount);
    await tokenFarm.connect(alice).deposit(lpTokenAmount);

    return { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock, alice, empty_account, lpTokenAmount };
}