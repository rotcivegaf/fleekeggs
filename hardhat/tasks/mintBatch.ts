import { task } from "hardhat/config";

task("mintBatch", "mintBatch")
.addParam("contract", "The address of the Fleekeggs contract")
.setAction(async (taskArgs, hre) => {
  // Get the contract
  const Fleekeggs = await hre.ethers.getContractFactory("Fleekeggs");
  const fleekeggs = Fleekeggs.attach(taskArgs.contract);

  // Call the increment function
  console.log("Minting eggs...");
  const incrementTx = await fleekeggs.mintBatch(
    '0x0002b9F00203105Fdb91f52277CFCBC516C33862',
    [1, 3, 4],
    [10220, 1330, 2]
  );
  await incrementTx.wait(0);

});
