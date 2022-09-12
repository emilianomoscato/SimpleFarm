import { deployTokenFarmFixture, depositFixture } from "./Fixtures";
import { deployment } from "./TokenFarm-deployment";
import { deposit } from "./TokenFarm-deposit";
import { changeRewardPerBlock, claimRewards, claimRewardsAfterUnstake, distributeRewards } from "./TokenFarm-Rewards";
import { withdraw } from "./TokenFarm-withdraw";

describe("TokenFarm", function () {
    
    describe("Deployment", function () {
        deployment(deployTokenFarmFixture);
    });

    describe("Deposit", function () {
        deposit(depositFixture);
    });

    describe("Withdraw", function () {
        withdraw(depositFixture);
    });

    describe("Claim Rewards", function () {
        claimRewards(depositFixture);
    });

    describe("Distribute Rewards", function () {
        distributeRewards(depositFixture);
    });

    describe("Change Reward Per Block", function () {
        changeRewardPerBlock(depositFixture);
    });

    describe("Claim Rewards after unstake", function () {
        claimRewardsAfterUnstake(depositFixture);
    });
});