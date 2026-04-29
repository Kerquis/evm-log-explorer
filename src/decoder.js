import { erc20Abi, decodeEventLog } from "viem";

import { uniswapV2PoolAbi } from "./abis/uniswapV2.js";
import { wethAbi } from "./abis/weth.js";

const symbolCache = new Map();

const allEventsAbi = [
  ...erc20Abi.filter((item) => item.type === "event"),
  ...uniswapV2PoolAbi,
  ...wethAbi,
];

async function getSymbol(address, client) {
  if (symbolCache.has(address)) {
    return symbolCache.get(address);
  }

  try {
    const symbol = await client.readContract({
      address,
      abi: erc20Abi,
      functionName: "symbol",
    });

    symbolCache.set(address, symbol);
    return symbol;
  } catch {
    symbolCache.set(address, null);
    return null;
  }
}

export async function decodeLog(log, client) {
  const symbol = await getSymbol(log.address, client);

  try {
    const decoded = decodeEventLog({
      abi: allEventsAbi,
      data: log.data,
      topics: log.topics,
    });

    return {
      success: true,
      eventName: decoded.eventName,
      args: decoded.args,
      symbol,
    };
  } catch {
    return {
      success: false,
      topic0: log.topics[0],
      symbol,
    };
  }
}
