// way 1 : make an async deploy function and then pass it here
// function deployFunc(hre){
//   console.log("Hii")
//  hre.getNamedAccounts()
//  hre.deployments
// }
// module.exports.default = deployFunc

// way 2 : pass in directly into module.exports ans extract useful information
// module.exports = async (hre) => {
//   const{getNamedAccount, deployments} = hre
// }

// way 3 :
// "async nameless function using the arrow notation"

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  let ethUsdPriceFeedAddress
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }

  const args = [ethUsdPriceFeedAddress]
  const fundMe = await deploy("FundMe", {
    from: deployer, // Network and address that deploys it
    args: args, // Arguements
    log: true, // do you want to console.log it
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args)
  }
  log("---------------------------------------")
}

module.exports.tags = ["all", "fundme"]
