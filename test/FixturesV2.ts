import { deployContractV2 } from "./DeployContractHelper";
import { ethers } from "hardhat";


export async function deployTokenFarmV2Fixture() {
    const { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock } = await deployContractV2();

    const [alice, bob, empty_account] = await ethers.getSigners();

    const lpTokenAmount = "1000000000000000000000";

    // Transfer LP tokens to Alice
    await lpToken.transfer(alice.address, lpTokenAmount);

    // Transfe LP tokens to Bob
    await lpToken.transfer(bob.address, lpTokenAmount);

    return { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock, alice, bob, empty_account, lpTokenAmount };
}

export async function depositV2Fixture() {
    const { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock, alice, empty_account, lpTokenAmount } = await deployTokenFarmV2Fixture();

    await lpToken.connect(alice).approve(tokenFarm.address, lpTokenAmount);
    await tokenFarm.connect(alice).deposit(lpTokenAmount);

    return { lpToken, dappToken, tokenFarm, deployer, rewardPerBlock, alice, empty_account, lpTokenAmount };
}