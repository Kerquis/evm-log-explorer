import "dotenv/config";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

import { decodeLog } from "./src/decoder.js";

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_URL),
});

const DEFAULT_TX_HASH =
  "0x546d201cfad3629d17049c7b687ebfb499b96e92e553ad9f0f8c6c73b09c359f";
const cliArg = process.argv[2];
const txHash = cliArg || DEFAULT_TX_HASH;
const source = cliArg ? "CLI" : "default";
const etherscanUrl = `https://etherscan.io/tx/${txHash}`;
console.log(`\n=== Analyzing transaction ===
Hash: ${txHash}
Source: ${source}
View on Etherscan:
${etherscanUrl}\n`);

const receipt = await client.getTransactionReceipt({
  hash: txHash,
});

receipt.logs.forEach((log, i) => {
  console.log(`--- Log ${i} ---`);
  console.log(`Emitter: ${log.address}`);
  const result = decodeLog(log);
  if (result.success) {
    console.log("Event:", result.eventName);
    console.log("Args:", result.args);
  } else {
    console.log(`Unknown event, topic[0]: ${result.topic0}`);
  }
  console.log();
});
