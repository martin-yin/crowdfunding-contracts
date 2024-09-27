import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { CrowdfundingFactory } from "../../typechain-types/index";
import { ethers, network, deployments } from "hardhat";
import { assert, expect } from "chai";

describe("CrowdfundingFactory", function () {
  let crowdfundingFactory: CrowdfundingFactory;
  let deployer: HardhatEthersSigner | any;
  let crowdfundingFactoryAddress: string;
  let accounts: HardhatEthersSigner[] | any;

  beforeEach(async function () {
    accounts = await ethers.getSigners(); // 获取当前的账户
    deployer = accounts[0];

    await deployments.fixture(["all"]);

    crowdfundingFactoryAddress = (await deployments.get("CrowdfundingFactory"))
      .address;

    crowdfundingFactory = await ethers.getContractAt(
      "CrowdfundingFactory",
      crowdfundingFactoryAddress
    );
  });

  describe("CrowdfundingFactory", function () {
    it("获取初始化的时候，没有任何的项目", async function () {
      assert.equal((await crowdfundingFactory.getALlCampaigns()).length, 0);
      assert.equal(
        (await crowdfundingFactory.getUserCampaigns(accounts[1].address))
          .length,
        0
      );
    });

    it("新建一个众筹项目", async function () {
      // 新建一个项目
      await crowdfundingFactory.createCampaign(
        "【战舰少女R】10周年官方典藏礼盒",
        "【战舰少女R】10周年官方典藏礼盒",
        1000,
        30
      );
      assert.equal((await crowdfundingFactory.getALlCampaigns()).length, 1);
      assert.equal(
        (await crowdfundingFactory.getUserCampaigns(accounts[0].address))
          .length,
        1
      );
    });

    it("创建众筹项目后，可以获取到众筹项目的信息", async function () {
      const account = accounts[0];
      await crowdfundingFactory
        .connect(account)
        .createCampaign(
          "【战舰少女R】10周年官方典藏礼盒",
          "【战舰少女R】10周年官方典藏礼盒",
          1000,
          30
        );

      const campaign = await crowdfundingFactory.getUserCampaigns(
        account.address
      );
      assert.equal(account.address, campaign[0].owner);
      assert.equal("【战舰少女R】10周年官方典藏礼盒", campaign[0].name);
      const blockNumber = await ethers.provider.getBlockNumber();
      const block = await ethers.provider.getBlock(blockNumber);
      assert.equal(
        block?.timestamp.toString(),
        campaign[0].creationTime.toString()
      );
    });

    it("关闭众筹工厂后等待一个块区之后再开启", async function () {
      await crowdfundingFactory.pause();

      await expect(
        crowdfundingFactory.createCampaign(
          "「幸福的丝线」—夜勤病栋画师操刀，非对称推理对抗桌游",
          "「幸福的丝线」—夜勤病栋画师操刀，非对称推理对抗桌游",
          1000,
          30
        )
      ).to.eventually.be.rejectedWith("EnforcedPause()");

      await crowdfundingFactory.unpause();
      await network.provider.send("evm_mine");
      await crowdfundingFactory.createCampaign(
        "超现实meta视觉小说《不/存在的你，和我》",
        "超现实meta视觉小说《不/存在的你，和我》",
        1000,
        30
      );
      assert.equal((await crowdfundingFactory.getALlCampaigns()).length, 1);
      assert.equal(
        (await crowdfundingFactory.getUserCampaigns(accounts[0].address))
          .length,
        1
      );
    });

    it("连续创建后报错", async function () {
      await crowdfundingFactory.createCampaign(
        "【战舰少女R】10周年官方典藏礼盒",
        "【战舰少女R】10周年官方典藏礼盒",
        1000,
        30
      );

      await expect(
        crowdfundingFactory.createCampaign(
          "【战舰少女R】10周年官方典藏礼盒",
          "【战舰少女R】10周年官方典藏礼盒",
          1000,
          30
        )
      ).to.eventually.be.rejectedWith("LastCampaignTooRecent()");
    });

    it("同一个用户一天一个众筹", async function () {
      await crowdfundingFactory
        .connect(accounts[1])
        .createCampaign(
          "【战舰少女R】10周年官方典藏礼盒",
          "【战舰少女R】10周年官方典藏礼盒",
          1000,
          30
        );

      ethers.provider.send("evm_increaseTime", [86400 + 1]); // 一天加 1秒

      await crowdfundingFactory
        .connect(accounts[1])
        .createCampaign(
          "【战舰少女R】10周年官方典藏礼盒",
          "【战舰少女R】10周年官方典藏礼盒",
          1000,
          30
        );
    });
  });
});
