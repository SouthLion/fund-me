const { task } = require("hardhat/config")

task("interact-fundme")
    .addParam("addr","fundme contract address")
    .setDescription("interact with fundme")
    .setAction(async (taskArgs, hre) => {
        const fundMeFactory = await ethers.getContractFactory("FundMe");
        const fundMe = fundMeFactory.attach(taskArgs.addr)

        // init 2 accounts
        const [firstAccount, secondAccount] = await ethers.getSigners();

        // fund contract with first account
        // 0.5 is a string not float
        const fundTx = await fundMe.fund({ value: ethers.parseEther("0.01") })
        await fundTx.wait();
        // check balance of contract
        const balanceofContract = await ethers.provider.getBalance(fundMe.target);
        console.log(`Blance of contract is ${balanceofContract}`)
        // fund contract with second account
        const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({ value: ethers.parseEther("0.01") })
        await fundTxWithSecondAccount.wait();
        // check balance of contract
        const balanceofContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target);
        console.log(`Blance of contract is ${balanceofContractAfterSecondFund}`)
        // check mapping fundersToAmount
        const firstAccountbalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
        const secondAccountbalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
        console.log(`Balance of first account ${firstAccount.address} is ${firstAccountbalanceInFundMe}`)
        console.log(`Balance of second account ${secondAccount.address} is ${secondAccountbalanceInFundMe}`)
    })

module.exports = {}
