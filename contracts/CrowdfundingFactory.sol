// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
import {Crowdfunding} from "./Crowdfunding.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract CrowdfundingFactory is Pausable, Ownable {
    error LastCampaignTooRecent();

    struct Campaign {
        address owner;
        address campaignAddress;
        string name;
        uint256 creationTime;
    }
    Campaign[] private campaigns;

    mapping(address => Campaign[]) private userCampaigns;

    constructor(address _owner) Ownable(_owner) {}

    function createCampaign(
        string memory _name,
        string memory _description,
        uint256 _goal,
        uint256 _durationInDays
    ) external whenNotPaused ensureLastCampaignIsOldEnough {
        Crowdfunding newCampaign = new Crowdfunding(
            msg.sender,
            _name,
            _description,
            _goal,
            _durationInDays
        );

        address campaignAddress = address(newCampaign);

        Campaign memory campaign = Campaign({
            campaignAddress: campaignAddress,
            owner: msg.sender,
            name: _name,
            creationTime: block.timestamp
        });

        campaigns.push(campaign);
        userCampaigns[msg.sender].push(campaign);
    }

    function getUserCampaigns(
        address _user
    ) external view returns (Campaign[] memory) {
        return userCampaigns[_user];
    }

    function getALlCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

    function getLastCampaignTime() public view returns (uint256) {
        if (campaigns.length == 0 || userCampaigns[msg.sender].length == 0) {
            return 0;
        }

        uint256 lastIndex = userCampaigns[msg.sender].length - 1;

        if (lastIndex >= 0) {
            return userCampaigns[msg.sender][lastIndex].creationTime;
        }

        return 0;
    }

    modifier ensureLastCampaignIsOldEnough() {
        uint256 lastCampaignTime = getLastCampaignTime();
        uint256 nowTime = block.timestamp;
        if (lastCampaignTime > 0 && nowTime - lastCampaignTime < 1 days) {
            revert LastCampaignTooRecent();
        }
        _;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
