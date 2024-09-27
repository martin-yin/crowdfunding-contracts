import { HardhatRuntimeEnvironment } from "hardhat/types";
import { crowdfundingDeployAgs } from "../hardhat.help";

const CrowdfundingDeploy = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const Crowdfunding = await deploy("Crowdfunding", {
    from: deployer,
    args: [
      deployer,
      crowdfundingDeployAgs.name,
      crowdfundingDeployAgs.description,
      crowdfundingDeployAgs.global,
      crowdfundingDeployAgs.deadline,
    ],
    log: true,
  });
  log(`-----------部署地址：${Crowdfunding.address}-----------`);
};

export default CrowdfundingDeploy;

CrowdfundingDeploy.tags = ["all", "CrowdfundingDeploy"];
