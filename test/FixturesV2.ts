import { deployContractV2 } from "./DeployContractHelper";
import { ethers } from "hardhat";

export async function deployTokenFarmV2Fixture() {
    const { lpToken, dappToken, tokenFarmV2, deployer, rewardPerBlock } = await deployContractV2();

    const tokenFarm = tokenFarmV2;

    const [alice, bob, empty_account] = await ethers.getSigners();

    const lpTokenAmount = "1000000000000000000000";

    // Transfer LP tokens to Users
    await lpToken.transfer(alice.address, lpTokenAmount);
    await lpToken.transfer(bob.address, lpTokenAmount);

    return { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock, alice, bob, empty_account, lpTokenAmount };
}

export async function depositV2Fixture() {
    const { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock, alice,bob, empty_account, lpTokenAmount } = await deployTokenFarmV2Fixture();

    await lpToken.connect(alice).approve(tokenFarm.address, lpTokenAmount);
    await tokenFarm.connect(alice).deposit(lpTokenAmount);

    
    return { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock, alice, bob, empty_account, lpTokenAmount };
}