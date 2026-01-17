// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
  function transfer(address to, uint256 amount) external returns (bool);
  function transferFrom(address from, address to, uint256 amount) external returns (bool);
  function balanceOf(address account) external view returns (uint256);
}

contract APIWallet {
  IERC20 public immutable usdc;

  event Deposited(address indexed from, uint256 amount);
  event Withdrawn(address indexed to, uint256 amount);
  event Paid(
    address indexed payer,
    address indexed provider,
    uint256 amount,
    bytes32 indexed invoiceId
  );

  constructor(address _usdc) {
    require(_usdc != address(0), "USDC addr required");
    usdc = IERC20(_usdc);
  }

  function deposit(uint256 amount) external {
    require(amount > 0, "amount=0");
    require(usdc.transferFrom(msg.sender, address(this), amount), "transferFrom failed");
    emit Deposited(msg.sender, amount);
  }

  function withdraw(address to, uint256 amount) external {
    require(to != address(0), "bad to");
    require(amount > 0, "amount=0");
    require(usdc.transfer(to, amount), "transfer failed");
    emit Withdrawn(to, amount);
  }

  function pay(address provider, uint256 amount, bytes32 invoiceId) external {
    require(provider != address(0), "bad provider");
    require(amount > 0, "amount=0");
    require(usdc.transfer(provider, amount), "transfer failed");
    emit Paid(msg.sender, provider, amount, invoiceId);
  }

  function contractBalance() external view returns (uint256) {
    return usdc.balanceOf(address(this));
  }
}
