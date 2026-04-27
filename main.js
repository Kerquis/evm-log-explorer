import "dotenv/config"
import { createPublicClient, http, decodeEventLog, erc20Abi } from "viem"
import { mainnet} from "viem/chains"

const client = createPublicClient({
    chain: mainnet,
    transport: http(process.env.RPC_URL)
})

const txHash = "0xd69bd9ca8c05ab4a6bf73954feb93510fb16272ecf1c2b5768ba90268c707e34"

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
        console.log(`Event: ${decoded.eventName}`)
        console.log('Args:', decoded.args, '\n')
    } catch {
        console.log(`Topic[0]: ${log.topics[0]} (cannot decode with ERC-20 ABI) \n`)
    }
})