import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const CrowdfundingFactoryDeploy = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const CrowdfundingFactory = await deploy("CrowdfundingFactory", {
    from: deployer,
    args: [deployer],
    log: true,
  });
  log(`-----------部署地址：${CrowdfundingFactory.address}-----------`);
};

export default CrowdfundingFactoryDeploy;

CrowdfundingFactoryDeploy.tags = ["all", "CrowdfundingFactory"];
