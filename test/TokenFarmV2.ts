import { deployTokenFarmV2Fixture, depositV2Fixture } from "./FixturesV2";
import { deployment } from "./TokenFarm-deployment";
import { deposit } from "./TokenFarm-deposit";
import { changeRewardPerBlock, claimRewards, claimRewardsAfterUnstake, distributeRewards } from "./TokenFarm-Rewards";
import { withdraw } from "./TokenFarm-withdraw";
import { claimFees } from "./TokenFarm-fees";

describe("TokenFarmV2", function () {
    describe("Deployment V2", function () {
        deployment(deployTokenFarmV2Fixture);
    });

    describe("Deposit V2", function () {
        deposit(depositV2Fixture);
    });

    describe("Withdraw V2", function () {
        withdraw(depositV2Fixture);
    });

    describe("Claim Rewards V2", function () {
        claimRewards(depositV2Fixture);
    });

    describe("Distribute Rewards V2", function () {
        distributeRewards(depositV2Fixture);
    });

    describe("Change Reward Per Block", function () {
        changeRewardPerBlock(depositV2Fixture);
    });

    describe("Claim Rewards after unstake V2", function () {
        claimRewardsAfterUnstake(depositV2Fixture);
    });

    describe("Claim fees V2", function () {
        claimFees(depositV2Fixture);
    });
});