// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

// 众筹合约自身的功能
contract Crowdfunding is Pausable, Ownable {
    string public name; // 众筹项目名称
    string public description; // 众筹项目描述
    uint256 public global; // 众筹目标金额
    uint256 public deadline;

    enum CampaignState {
        Active,
        Successful,
        Failed
    }

    CampaignState public state;

    struct Backer {
        uint256 totalContribution;
        mapping(uint256 => bool) fundedTiers;
    }

    mapping(address => Backer) public backers;
    struct Tier {
        string name; // 等级名称
        uint256 amount; // 等级目标金额
        uint256 backers; // 
    }
    Tier[] public tiers;

    modifier campaignOpen() {
        require(state == CampaignState.Active, "Campaign is not active.");
        _;
    }

    constructor(
        address _owner,
        string memory _name,
        string memory _description,
        uint256 _global,
        uint256 _duratyionInDays
    ) Ownable(_owner) {
        name = _name;
        description = _description;
        global = _global;
        deadline = block.timestamp + (_duratyionInDays * 1 days);
        state = CampaignState.Active;
    }

    // 检查并更新众筹状态
    function checkAndUpdateCampaignState() internal {
        if (state == CampaignState.Active) {
            if (block.timestamp >= deadline) {
                state = address(this).balance >= global
                    ? CampaignState.Successful
                    : CampaignState.Failed;
            } else {
                state = address(this).balance >= global
                    ? CampaignState.Successful
                    : CampaignState.Active;
            }
        }
    }

    function fund(
        uint256 _tierIndex
    ) public payable campaignOpen whenNotPaused {
        require(_tierIndex < tiers.length, "Invalid tier.");
        require(msg.value == tiers[_tierIndex].amount, "Invalid amount.");

        tiers[_tierIndex].backers++;
        backers[msg.sender].totalContribution += msg.value;
        backers[msg.sender].fundedTiers[_tierIndex] = true;

        checkAndUpdateCampaignState();
    }

    function addTier(string memory _name, uint256 _amount) public onlyOwner {
        require(_amount > 0, "Amount must be greater than 0.");
        tiers.push(Tier(_name, _amount, 0));
    }

    function removeTier(uint256 _index) public onlyOwner {
        require(_index < tiers.length, "Tier does not exist.");
        tiers[_index] = tiers[tiers.length - 1];
        tiers.pop();
    }

    function withdraw() public onlyOwner {
        checkAndUpdateCampaignState();
        require(state == CampaignState.Successful, "Campaign not successful.");

        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        payable(msg.sender).transfer(balance);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function refund() public {
        checkAndUpdateCampaignState();
        require(state == CampaignState.Failed, "Refunds not available.");

        uint256 amount = backers[msg.sender].totalContribution;
        require(amount > 0, "No contributions to refund.");

        backers[msg.sender].totalContribution = 0;
        payable(msg.sender).transfer(amount);
    }

    function hasFundedTier(
        address _backer,
        uint256 _tierIndex
    ) public view returns (bool) {
        return backers[_backer].fundedTiers[_tierIndex];
    }

    function getTiers() public view returns (Tier[] memory) {
        return tiers;
    }

    function getCampaignStatus() public view returns (CampaignState) {
        if (state == CampaignState.Active && block.timestamp > deadline) {
            return
                address(this).balance >= global
                    ? CampaignState.Successful
                    : CampaignState.Failed;
        }
        return state;
    }

    function extendDeadline(
        uint256 _daysToAdd
    ) public onlyOwner campaignOpen {
        deadline += _daysToAdd * 1 days;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
