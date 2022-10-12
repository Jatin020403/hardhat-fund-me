const { Contract } = require("ethers")
const { network } = require("hardhat")
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  // const chainId = network.config.chainId

  if (developmentChains.includes(network.name)) {
    // Console.log is the same as log here -
    console.log("Local network detected! Deploying mocks...")
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    })
    log("Mock Deployed!")
    log("---------------------------------------")
  }
}

// Specify the tag while running to run only this mock
// This will run for :
// yarn hardhat deploy --tags mocks
// yarn hardhat deploy --tags all
module.exports.tags = ["all", "mocks"]
