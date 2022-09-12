import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers";

export function withdraw(fixture: Function) {
    it("Should change LP Token balance of contract", async function () {
        const { tokenFarm, lpToken, alice } = await loadFixture(fixture);

        await tokenFarm.connect(alice).withdraw();

        expect(await lpToken.balanceOf(tokenFarm.address)).to.equal(0);
    });

    it("Should change staked balance of user", async function () {
        const { tokenFarm, lpTokenAmount, alice } = await loadFixture(fixture);

        await tokenFarm.connect(alice).withdraw();

        expect(await tokenFarm.balanceOf(alice.address)).to.equal(0);
    });

    it("Should change totalStaked of contract", async function () {
        const { tokenFarm, alice } = await loadFixture(fixture);

        await tokenFarm.connect(alice).withdraw();

        expect(await tokenFarm.totalStaked()).to.equal(0);
    });

    it("Should change user's staking status", async function () {
        const { tokenFarm, alice } = await loadFixture(fixture);

        await tokenFarm.connect(alice).withdraw();

        expect(await tokenFarm.isStaking(alice.address)).to.equal(false);
    });

    it("Should update checkpoint of user", async function () {
        const { tokenFarm, alice } = await loadFixture(fixture);

        await tokenFarm.connect(alice).withdraw();

        expect(await tokenFarm.checkpoint(alice.address)).to.equal(await ethers.provider.getBlockNumber());
    });

    it("Should emit Withdrawn event", async function () {
        const { tokenFarm, alice, lpTokenAmount } = await loadFixture(fixture);

        await expect(tokenFarm.connect(alice).withdraw())
            .to.emit(tokenFarm, "Unstaked")
            .withArgs(alice.address, lpTokenAmount);
    });
}