import { ethers } from "hardhat";

async function main() {
  const walletAddress = process.env.APIWALLET_CONTRACT;
  
  if (!walletAddress) {
    throw new Error("APIWALLET_CONTRACT not set in .env");
  }

  const APIWallet = await ethers.getContractFactory("APIWallet");
  const wallet = APIWallet.attach(walletAddress);

  const provider = "0xProviderAddressHere";
  const amount = ethers.parseUnits("0.01", 6); // 0.01 USDC (6 decimals)
  const invoiceId = ethers.id("test_invoice_001");

  console.log("Sending payment...");
  const tx = await wallet.pay(provider, amount, invoiceId);
  await tx.wait();

  console.log("✅ Payment sent!");
  console.log("Tx hash:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
