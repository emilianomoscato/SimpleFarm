import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers";

export function deployment(fixture: Function) {
    it("Should set the right owner", async function () {
        const { tokenFarm, deployer } = await loadFixture(fixture);

        expect(await tokenFarm.owner()).to.equal(deployer.address);
    });
    
    it("Should set the right rewardPerBlock", async function () {
        const { tokenFarm, rewardPerBlock } = await loadFixture(fixture);

        expect(await tokenFarm.rewardPerBlock()).to.equal(rewardPerBlock);
    });
    
    it("Should set the right dappToken", async function () {
        const { tokenFarm, dappToken } = await loadFixture(fixture);

        expect(await tokenFarm.dappToken()).to.equal(dappToken.address);
    });

    it("Should set the right lpToken", async function () {
        const { tokenFarm, lpToken } = await loadFixture(fixture);

        expect(await tokenFarm.lpToken()).to.equal(lpToken.address);
    });
}



