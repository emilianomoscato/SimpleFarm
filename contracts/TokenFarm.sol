// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./DappToken.sol";
import "./LPToken.sol";

/**
    A super simple token farm 
*/
contract TokenFarm is OwnableUpgradeable {

    struct staker {
        uint256 balance;
        uint256 checkpoint;
        uint256 pendigRewards;
        bool isStaking;
        bool hasStaked;
    }

    // rewards per block range
    uint256 public constant REWARD_PER_BLOCK_MAX = 1e18;
    uint256 public constant REWARD_PER_BLOCK_MIN = 1e16;

    // State variables

    string public name;
    DappToken public dappToken; //mock platform reward token
    LPToken public lpToken; // mock LP Token staked by users
    uint256 public rewardPerBlock; // reward per block

    // iterable list of staking users
    address[] public stakers;

    // mapping of staking users info
    mapping(address => staker) public stakerInfo;

    // total staking balance
    uint256 public totalStaked;

    
    // Events - add events as needed
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardsDistribution(uint256 reward, uint256 blockNumber);
    event RewardPerBlockChanged(uint256 rewardPerBlock);


    modifier onlyStakers() {
        require(stakerInfo[msg.sender].isStaking == true, "You have not staked any tokens");
        _;
    }

    // Initialize the contract
    function initialize(address _dappToken, address _lpToken, uint256 _rewardPerBlock) initializer public {
        require(_dappToken != address(0), "Invalid address");
        require(_lpToken != address(0), "Invalid address");
        require(_rewardPerBlock >= REWARD_PER_BLOCK_MIN && _rewardPerBlock <= REWARD_PER_BLOCK_MAX, "Invalid reward per block");

        __Ownable_init();
        name = "Simple Token Farm";
        dappToken = DappToken(_dappToken);
        lpToken = LPToken(_lpToken);
        rewardPerBlock = _rewardPerBlock;
    }

    /**
     @notice Deposit
     Users deposits LP Tokens
     */
    function deposit(uint256 _amount) public {
        // Require amount greater than 0
        require(_amount > 0, "amount cannot be 0");

        // Require balance of user is greater than or equal to amount
        require(lpToken.balanceOf(msg.sender) >= _amount, "not enough balance");

        // Trasnfer Mock LP Tokens to this contract for staking
        lpToken.transferFrom(msg.sender, address(this), _amount);

        // If user were staking distribute rewards to user before updating staking info
        // if it is the first time staking, do not distribute rewards and update checkpoint
        if (stakerInfo[msg.sender].isStaking) {
            _distributeRewards(msg.sender);
        } else {
            stakerInfo[msg.sender].checkpoint = block.number;
        }

        // Update staking balance
        stakerInfo[msg.sender].balance += _amount;

        // Update total staking balance
        totalStaked += _amount;

        // Add user to stakers array only if they haven't staked already
        if(!stakerInfo[msg.sender].hasStaked) {
            stakers.push(msg.sender);
            stakerInfo[msg.sender].hasStaked = true;
        }

        // Update staking status
        if(!stakerInfo[msg.sender].isStaking) {
            stakerInfo[msg.sender].isStaking = true;
        }

        // emit some event
        emit Staked(msg.sender, _amount);
    }

    /**
    @notice Balance of staker
    Returns the staking balance of a user
     */
    function balanceOf(address _user) public view returns(uint256) {
        return stakerInfo[_user].balance;
    }

    /**
    @notice Pending rewards
    Returns the pending rewards of a user
    */
    function pendingRewards(address _user) public view returns(uint256) {
        return stakerInfo[_user].pendigRewards;
    }

    /**
    @notice Is staking
    Returns the staking status of a user
    */
    function isStaking(address _user) public view returns(bool) {
        return stakerInfo[_user].isStaking;
    }

    /**
    @notice Has staked
    Returns the staking status of a user
    */
    function hasStaked(address _user) public view returns(bool) {
        return stakerInfo[_user].hasStaked;
    }

    /**
    @notice Checkpoint
    Returns the checkpoint of a user
    */
    function checkpoint(address _user) public view returns(uint256) {
        return stakerInfo[_user].checkpoint;
    }

    /**
     @notice Withdraw
     Unstaking LP Tokens (Withdraw all LP Tokens)
     */
    function withdraw() public onlyStakers {

        // Fetch staking balance
        uint256 balance = stakerInfo[msg.sender].balance;

        // Require amount greater than 0
        require(balance > 0, "staking balance cannot be 0");

        // Distribute user rewards before reseting staking balance
        _distributeRewards(msg.sender);
        
        // Reset staking balance
        stakerInfo[msg.sender].balance = 0;

        // Update staking status
        stakerInfo[msg.sender].isStaking = false;

        // emit some event
        emit Unstaked(msg.sender, balance);
        
        // Transfer LP Tokens to user
        lpToken.transfer(msg.sender, balance);

        // Update total staking balance
        totalStaked -= balance;
    }

    /**
     @notice Claim Rewards
     Users harvest pendig rewards
     Pendig rewards are minted to the user
     */
    function claimRewards() public {
        // If user is staking, distribute rewards before claiming
        if(stakerInfo[msg.sender].isStaking) {
            _distributeRewards(msg.sender);
        }

        // fetch pendig rewards
        uint256 reward = stakerInfo[msg.sender].pendigRewards;

        // check if user has pending rewards
        require(reward > 0, "user has no pending rewards");

        // reset pendig rewards balance
        stakerInfo[msg.sender].pendigRewards = 0;

        // mint rewards tokens to user
        dappToken.mint(msg.sender, reward);

        // emit some event
        emit RewardPaid(msg.sender, reward);
    }

    /**
     @notice Distribute rewards to all stakers
     Distribute rewards for all staking user, updating pendingRewards and checkpoint.
     Emits a RewardsDistribution event for each user.
     Only owner can call this function
     */
    function distributeRewardsAll() external onlyOwner {
        // Distribute rewards to all stakers only if they are staking
        for (uint256 i = 0; i < stakers.length; i++) {
            address user = stakers[i];
            if (stakerInfo[user].isStaking) {
                _distributeRewards(user);
            }
        }
    }

    /**
     @notice Distribute rewards to a single staker
     Distributes rewards for the indicated beneficiary updating pendingRewards and checkpoint.
     Emits a RewardsDistribution event.
     */
    function _distributeRewards(address beneficiary) private {
        // Calculate total rewards for all stakers up to user last checkpoint
        uint256 lastCheckpoint = stakerInfo[beneficiary].checkpoint;
        uint256 totalRewards = (block.number - lastCheckpoint) * rewardPerBlock;

        // calculates rewards:
        uint256 userRewards = totalRewards * stakerInfo[beneficiary].balance / totalStaked;

        // update user rewards
        stakerInfo[beneficiary].pendigRewards += userRewards;

        // update user checkpoint
        stakerInfo[beneficiary].checkpoint = block.number;

        // emit some event
        emit RewardsDistribution(userRewards, lastCheckpoint);
    }

    /**
    @notice Change Reward Per Block
    Only owner can call this function
    Reward per block must be between REWARD_PER_BLOCK_MIN and REWARD_PER_BLOCK_MAX
     */
    function changeRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        require(_rewardPerBlock >= REWARD_PER_BLOCK_MIN && _rewardPerBlock <= REWARD_PER_BLOCK_MAX, 
            "reward per block must be between REWARD_PER_BLOCK_MIN and REWARD_PER_BLOCK_MAX");
        rewardPerBlock = _rewardPerBlock; 

        emit RewardPerBlockChanged(_rewardPerBlock);
    }       
}

