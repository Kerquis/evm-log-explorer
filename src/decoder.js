import { erc20Abi, decodeEventLog } from "viem";

import { uniswapV2PoolAbi } from "./abis/uniswapV2.js";
import { wethAbi } from "./abis/weth.js";

const allEventsAbi = [
  ...erc20Abi.filter((item) => item.type === "event"),
  ...uniswapV2PoolAbi,
  ...wethAbi,
];

export function decodeLog(log) {
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
    };
  } catch {
    return { success: false, topic0: log.topics[0] };
  }
}
