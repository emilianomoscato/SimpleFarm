import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";

import { deployTokenFarmV2Fixture, depositV2Fixture } from "./FixturesV2";
import { deployment } from "./TokenFarm-deployment";
import { deposit } from "./TokenFarm-deposit";
import { claimRewards, distributeRewards, claimRewardsAfterUnstake } from "./TokenFarm-Rewards";

describe("TokenFarmV2", function () {
    describe("Deployment", function () {
        deployment(deployTokenFarmV2Fixture);
    });

    describe("Deposit", function () {
        deposit(depositV2Fixture);
    });

    describe("Claim Rewards", function () {
        claimRewards(depositV2Fixture);
    });

    describe("Distribute Rewards", function () {
        distributeRewards(depositV2Fixture);
    });

    describe("Claim Rewards after unstake", function () {
        claimRewardsAfterUnstake(depositV2Fixture);
    });
});