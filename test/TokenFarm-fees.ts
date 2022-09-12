import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import "@nomiclabs/hardhat-ethers";

export function claimFees(fixture: Function) { 
     it ( "Should check initial withdraw fee be equal to 0" , async function(){
        const { tokenFarm } = await loadFixture(fixture); 
        expect(await tokenFarm.claimFee()).to.equal(0);
     }); 

     it ( "Should change claim fees of contract" , async function(){ 
        const { tokenFarm } = await loadFixture(fixture);
        tokenFarm.changeClaimFee(2);
        expect(await tokenFarm.claimFee()).to.equal(2);         
     }); 

     it ("Should withdraw fees to owner", async function(){

     });

     it ("Should revert cause no fees to withdraw", async function(){ 
        const { tokenFarm, deployer } = await loadFixture(fixture);

        await expect(tokenFarm.connect(deployer).withdrawFees())
            .to.be.revertedWith("No fees to withdraw");
     }); 
     
     it("Should revert cause rewards less than fee", async function () {
         const { tokenFarm, deployer, alice } = await loadFixture(fixture);

         await tokenFarm.connect(deployer).changeClaimFee(2);

         await expect(tokenFarm.connect(alice).claimRewards())
            .to.be.revertedWith("User has less rewards than claim fee");
     });

     it("Should emit WithdrawFees event", async function () {
         const { tokenFarm, deployer, alice } = await loadFixture(fixture);

         await tokenFarm.connect(deployer).changeClaimFee(1);

         await tokenFarm.connect(alice).claimRewards();

         const collected_fees = await tokenFarm.collectedFees();

         await expect(tokenFarm.connect(deployer).withdrawFees())
             .to.emit(tokenFarm, "WithdrawFees")
             .withArgs(deployer.address, collected_fees);
     });
 }