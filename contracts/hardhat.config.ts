import "@nomicfoundation/hardhat-toolbox"
import "@semaphore-protocol/hardhat"
import { config as dotenvConfig } from "dotenv"
import { HardhatUserConfig } from "hardhat/config"
import { NetworksUserConfig } from "hardhat/types"
import { resolve } from "path"
import { config } from "./package.json"
import "./tasks/deploy-zk-groups"
import "./tasks/accounts"

dotenvConfig({ path: resolve(__dirname, "../.env") })

function getNetworks(): NetworksUserConfig {
    if (!process.env.INFURA_API_KEY || !process.env.BACKEND_PRIVATE_KEY) {
        return {}
    }

    const infuraApiKey = process.env.INFURA_API_KEY
    const accounts = [`0x${process.env.BACKEND_PRIVATE_KEY}`]

    return {
        goerli: {
            url: `https://goerli.infura.io/v3/${infuraApiKey}`,
            chainId: 5,
            accounts
        },
        arbitrum: {
            url: "https://arb1.arbitrum.io/rpc",
            chainId: 42161,
            accounts
        }
    }
}

const hardhatConfig: HardhatUserConfig = {
    solidity: config.solidity,
    paths: {
        sources: config.paths.contracts,
        tests: config.paths.tests,
        cache: config.paths.cache,
        artifacts: config.paths.build.contracts
    },
    networks: {
        hardhat: {
            chainId: 1337,
            allowUnlimitedContractSize: true
        },
        ...getNetworks()
    },
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS === "true",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    },
    typechain: {
        outDir: config.paths.build.typechain,
        target: "ethers-v5"
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    }
}

export default hardhatConfig
