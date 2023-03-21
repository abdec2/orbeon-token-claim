// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

interface TokenDecimal {
    function decimals() external returns (uint8);
}

contract ClaimTokens is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IERC20 private token;

    uint256 public totalClaimed;

    uint256[] public tokensToBeClaimed;

    address[] public whitelistUsers;
    address private tokenHolder;

    mapping(address => bool) public isClaimed;

    event Claimed(address indexed tokenAddress, address indexed user, uint256 amount, uint256 indexed timestamp);

    constructor(address _token, address _tokenholder) {
        token = IERC20(_token);
        tokenHolder = _tokenholder;
    }

    function _getToken() external view returns(IERC20) {
        return token;
    }

    function _setToken(IERC20 _token) external onlyOwner {
        token = _token;
    }

    function _getTokenHolder() external view returns(address) {
        return tokenHolder;
    }

    function _setTokenHolder(address _tokenholder) external onlyOwner {
        tokenHolder = _tokenholder;
    }

    function _whitelistUsersLength() external view returns(uint) {
        return whitelistUsers.length;
    }

    function _tokensToBeClaimedLength() external view returns(uint) {
        return tokensToBeClaimed.length;
    }

    function Claim() external nonReentrant whenNotPaused {
        require(msg.sender != address(0), "CONTRACT: Caller is zero address");
        require(whitelistUsers.length == tokensToBeClaimed.length, "CONTRACT: users and tokens length mismatch");
        (bool isWhiteList, uint256 i) = isWhitelistedUser(msg.sender);
        require(isWhiteList, "CONTRACT: Caller is not whitelisted");
        require(!isClaimed[msg.sender], "CONTRACT: Tokens already claimed!!");
        require(address(token) != address(0), "CONTRACT: Token is not set.");

        uint256 claimedTokens = tokensToBeClaimed[i] * 10 ** TokenDecimal(address(token)).decimals();
        totalClaimed += claimedTokens;
        token.safeTransferFrom(tokenHolder, msg.sender, claimedTokens);
        isClaimed[msg.sender] = true;
        emit Claimed(address(token), msg.sender, claimedTokens, block.timestamp);
    }

    function addWhitelistUsers(address[] memory _addresses) external onlyOwner {
        whitelistUsers = _addresses;
    }

    function addTokensToBeClaimed(uint256[] memory _tokens) external onlyOwner {
        tokensToBeClaimed = _tokens;
    }

    function isWhitelistedUser(address _address) public view returns(bool, uint256) {
        for(uint256 i=0; i < whitelistUsers.length; i++) {
            if(_address == whitelistUsers[i]) {
                return (true, i);
            }
        }
        return (false, 0);
    }

    function reset() external onlyOwner {
        for(uint i=0; i < whitelistUsers.length; i++) {
            delete isClaimed[whitelistUsers[i]];
        }
        totalClaimed = 0;
        delete tokensToBeClaimed;
        delete whitelistUsers;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }


    fallback() external payable {}

    receive() external payable {}
}