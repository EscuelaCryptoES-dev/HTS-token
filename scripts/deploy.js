require("dotenv").config();
const hre = require("hardhat");

async function main() {
  if(!process.env.ADMIN_ADDRESS){
    throw Error("No admin declared on env")
  }

  const HTS = await hre.ethers.getContractFactory("HappyTribe");
  const hts = await HTS.deploy(process.env.ADMIN_ADDRESS);

  await hts.deployed();
  
  console.log(
    `Happy Tribe with owner ${process.env.ADMIN_ADDRESS} deployed on ${hts.address}`
  )
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
