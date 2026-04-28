import "dotenv/config";
import { createPublicClient, http, decodeEventLog, erc20Abi } from "viem";
import { mainnet } from "viem/chains";

import { uniswapV2PoolAbi } from "./src/abis/uniswapV2.js";
import { wethAbi } from "./src/abis/weth.js";

const allEventsAbi = [
  ...erc20Abi.filter((item) => item.type === "event"),
  ...uniswapV2PoolAbi,
  ...wethAbi,
];

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

  try {
    const decoded = decodeEventLog({
      abi: allEventsAbi,
      data: log.data,
      topics: log.topics,
    });
    console.log("Event:", decoded.eventName);
    console.log("Args:", decoded.args);
  } catch {
    console.log(`Topic[0]: ${log.topics[0]} (cannot decode)`);
  }
  console.log();
});
