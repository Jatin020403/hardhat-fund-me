const { assert } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")
const { developerChains } = require("../../helper-hardhat-config")

// Ask if devChain includes dev network's name.
// if Yes then the whole describe is skipped
// else We test with describe

developerChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe
      let deployer
      const sendValue = ethers.utils.parseEther("1")

      beforeEach(async function () {
        deployer = (await getNamedAccounts).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
      })

      it("allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue })
        await fundMe.withdraw()
        const endingBalance = await fundMe.provider.getBalance(fundme.address)
        assert.equal(endingBalance.toString(), "0")
      })
    })
