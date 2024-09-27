import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Crowdfunding } from "../../typechain-types/index";
import { ethers, network, deployments } from "hardhat";
import { assert, expect } from "chai";
import { crowdfundingDeployAgs} from  "../../hardhat.help";

describe("Crowdfunding", function () {
  let crowdfunding: Crowdfunding;
  let crowdfundingAddress: string;
  let deployer: HardhatEthersSigner | any;
  let accounts: HardhatEthersSigner[] | any;

  beforeEach(async function () {
    accounts = await ethers.getSigners(); // 获取当前的账户
    deployer = accounts[0];

    await deployments.fixture(["all"]);

    crowdfundingAddress = (await deployments.get("Crowdfunding")).address;

    crowdfunding = await ethers.getContractAt(
      "Crowdfunding",
      crowdfundingAddress
    );
  });

  describe("Crowdfunding", function () {
    it("获取部署的合约信息", async function () {
      const name = await crowdfunding.name();
      const description = await crowdfunding.description();
      const global = await crowdfunding.global();
      const deadline = await crowdfunding.deadline();
      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);

      assert.equal(name, crowdfundingDeployAgs.name);
      assert.equal(description, crowdfundingDeployAgs.description);
      assert.equal(global, crowdfundingDeployAgs.global);
      assert.equal(deadline, (block?.timestamp || 0) + crowdfundingDeployAgs.deadline * 24 * 60 * 60);
    })
  });
});
