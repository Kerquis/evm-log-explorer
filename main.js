import "dotenv/config"
import { createPublicClient, http, decodeEventLog, erc20Abi } from "viem"
import { mainnet } from "viem/chains"

const client = createPublicClient({
    chain: mainnet,
    transport: http(process.env.RPC_URL)
})

const DEFAULT_TX_HASH = "0xd69bd9ca8c05ab4a6bf73954feb93510fb16272ecf1c2b5768ba90268c707e34"
const cliArg = process.argv[2]
const txHash = cliArg || DEFAULT_TX_HASH
const source = cliArg ? "CLI" : "default"
const etherscanUrl = `https://etherscan.io/tx/${txHash}`
console.log(`\n=== Analyzing transaction ===
Hash: ${txHash}
Source: ${source}
View on Etherscan:
${etherscanUrl}\n`)

const receipt = await client.getTransactionReceipt({
    hash: txHash
}) 

receipt.logs.forEach((log, i) => {

    console.log(`--- Log ${i} ---`)
    console.log(`Emitter: ${log.address}`)

    try {
        const decoded = decodeEventLog({
            abi: erc20Abi,
            data: log.data,
            topics: log.topics,
        })
        console.log("Event:", decoded.eventName)
        console.log("Args:", decoded.args)
    } catch {
        console.log(`Topic[0]: ${log.topics[0]} (cannot decode with ERC-20 ABI)`)
    }
    console.log()
})