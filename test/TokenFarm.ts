import { deployTokenFarmFixture } from "./Fixtures";
import { deployment } from "./TokenFarm-deployment";
import { deposit } from "./TokenFarm-deposit";
import { depositFixture } from "./Fixtures";
import { claimRewards, claimRewardsAfterUnstake, distributeRewards } from "./TokenFarm-Rewards";

describe("TokenFarm", function () {
    
    describe("Deployment", function () {
        deployment(deployTokenFarmFixture);
    });

    describe("Deposit", function () {
        deposit(depositFixture);
    });

    describe("Claim Rewards", function () {
        claimRewards(depositFixture);
    });

    describe("Distribute Rewards", function () {
        distributeRewards(depositFixture);
    });

    describe("Claim Rewards after unstake", function () {
        claimRewardsAfterUnstake(depositFixture);
    });
});