import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers";

export function claimRewards(fixture: Function) {
    it("Should update user's dappToken balance", async function () {
        const { tokenFarm, alice, rewardPerBlock, dappToken } = await loadFixture(fixture);

        await tokenFarm.connect(alice).claimRewards();

        expect(await dappToken.balanceOf(alice.address)).to.equal(rewardPerBlock);
    });
}

export function distributeRewards(fixture: Function) {
    it("Should change user's reward", async function () {
        const { tokenFarm, deployer, alice, rewardPerBlock } = await loadFixture(fixture);

        await tokenFarm.connect(deployer).distributeRewardsAll();

        expect(await tokenFarm.pendingRewards(alice.address)).to.equal(rewardPerBlock);
    });
}

export function claimRewardsAfterUnstake(fixture: Function) {
    it("Should allow user to claim rewards after withdraw", async function () {
        const { tokenFarm, alice, rewardPerBlock, dappToken, lpTokenAmount } = await loadFixture(fixture);

        await tokenFarm.connect(alice).withdraw();
        await tokenFarm.connect(alice).claimRewards();

        expect(await dappToken.balanceOf(alice.address)).to.equal(rewardPerBlock);
    });
}