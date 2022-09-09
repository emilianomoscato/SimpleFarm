import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers";

export function deposit(fixture: Function) {
    it("Should change LP Token balance of contract", async function () {
        const { tokenFarm, lpToken, lpTokenAmount } = await loadFixture(fixture);

        expect(await lpToken.balanceOf(tokenFarm.address)).to.equal(lpTokenAmount);
    });
    /*
    it("Should change staked balance of user", async function () {
        const { tokenFarm, lpTokenAmount, alice } = await loadFixture(depositFixture);

        expect(await tokenFarm.balanceOf(alice.address)).to.equal(lpTokenAmount);
    });

    it("Should change totalStaked of contract", async function () {
        const { tokenFarm, lpTokenAmount } = await loadFixture(depositFixture);

        expect(await tokenFarm.totalStaked()).to.equal(lpTokenAmount);

    });

    it("Should change user's staking status", async function () {
        const { tokenFarm, alice } = await loadFixture(depositFixture);

        expect(await tokenFarm.isStaking(alice.address)).to.equal(true);
    });

    it("Should update checkpoint of user", async function () {
        const { tokenFarm, alice } = await loadFixture(depositFixture);

        expect(await tokenFarm.checkpoint(alice.address)).to.equal(await ethers.provider.getBlockNumber());
    });
    */
}