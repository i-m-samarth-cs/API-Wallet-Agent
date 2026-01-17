import { ethers } from "hardhat";

async function main() {
  const usdcAddress = process.env.USDC_ADDRESS;
  
  if (!usdcAddress) {
    throw new Error("USDC_ADDRESS not set in .env");
  }

  console.log("Deploying APIWallet contract...");
  console.log("USDC Address:", usdcAddress);

  const APIWallet = await ethers.getContractFactory("APIWallet");
  const wallet = await APIWallet.deploy(usdcAddress);

  await wallet.waitForDeployment();
  const address = await wallet.getAddress();

  console.log("✅ APIWallet deployed to:", address);
  console.log("\nAdd this to your backend .env:");
  console.log(`APIWALLET_CONTRACT=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
