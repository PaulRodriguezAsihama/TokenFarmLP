const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("TokenFarm", function () {
  let owner, user1, user2;
  let dappToken, lpToken, tokenFarm;
  const oneEther = ethers.parseEther("1");

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const DappToken = await ethers.getContractFactory("DappToken");
    dappToken = await DappToken.deploy(owner.address);

    const LPToken = await ethers.getContractFactory("LPToken");
    lpToken = await LPToken.deploy(owner.address);

    const TokenFarm = await ethers.getContractFactory("TokenFarm");
    tokenFarm = await TokenFarm.deploy(dappToken.target, lpToken.target);

    // Transfer DappTokens to TokenFarm for rewards
    await dappToken.transfer(tokenFarm.target, ethers.parseEther("1000000"));

    // Mint LP tokens for users
    await lpToken.mint(user1.address, ethers.parseEther("1000"));
    await lpToken.mint(user2.address, ethers.parseEther("1000"));

    // Approve TokenFarm to spend users' LP tokens
    await lpToken
      .connect(user1)
      .approve(tokenFarm.target, ethers.parseEther("1000"));
    await lpToken
      .connect(user2)
      .approve(tokenFarm.target, ethers.parseEther("1000"));
  });

  it("should allow users to deposit LP tokens and start staking", async function () {
    await tokenFarm.connect(user1).deposit(oneEther);

    expect(await tokenFarm.stakingBalance(user1.address)).to.equal(oneEther);
    expect(await tokenFarm.isStaking(user1.address)).to.be.true;
    expect(await lpToken.balanceOf(tokenFarm.target)).to.equal(oneEther);
  });

  it("should distribute rewards and allow users to claim them", async function () {
    await tokenFarm.connect(user1).deposit(oneEther);

    // Mine some blocks to simulate time passing
    await network.provider.send("hardhat_mine", ["0x100"]);

    await tokenFarm.connect(user1).claimRewards();

    const user1DappBalance = await dappToken.balanceOf(user1.address);
    expect(user1DappBalance).to.be.above(0);
  });

  it("should allow users to withdraw their LP tokens", async function () {
    await tokenFarm.connect(user1).deposit(oneEther);

    // Mine some blocks
    await network.provider.send("hardhat_mine", ["0x10"]);

    await tokenFarm.connect(user1).withdraw();

    expect(await tokenFarm.stakingBalance(user1.address)).to.equal(0);
    expect(await tokenFarm.isStaking(user1.address)).to.be.false;
    expect(await lpToken.balanceOf(user1.address)).to.equal(
      ethers.parseEther("1000")
    );
  });

  it("should allow users to claim rewards after withdrawing", async function () {
    await tokenFarm.connect(user1).deposit(oneEther);

    // Mine some blocks
    await network.provider.send("hardhat_mine", ["0x10"]);

    await tokenFarm.connect(user1).withdraw();
    await tokenFarm.connect(user1).claimRewards();

    const user1DappBalance = await dappToken.balanceOf(user1.address);
    expect(user1DappBalance).to.be.above(0);
  });

  it("should recalculate rewards when a user deposits more tokens", async function () {
    await tokenFarm.connect(user1).deposit(oneEther);
    await network.provider.send("hardhat_mine", ["0x10"]);
    const initialRewards = await tokenFarm.pendingRewards(user1.address);

    await tokenFarm.connect(user1).deposit(oneEther);
    await network.provider.send("hardhat_mine", ["0x10"]);

    await tokenFarm.connect(user1).claimRewards();
    const finalDappBalance = await dappToken.balanceOf(user1.address);

    expect(finalDappBalance).to.be.above(initialRewards);
  });

  it("should allow the owner to distribute rewards to all stakers", async function () {
    await tokenFarm.connect(user1).deposit(oneEther);
    await tokenFarm.connect(user2).deposit(oneEther);

    await network.provider.send("hardhat_mine", ["0x10"]);

    const user1PendingRewardsBefore = await tokenFarm.pendingRewards(
      user1.address
    );
    const user2PendingRewardsBefore = await tokenFarm.pendingRewards(
      user2.address
    );

    await tokenFarm.connect(owner).distributeRewardsAll();

    const user1PendingRewardsAfter = await tokenFarm.pendingRewards(
      user1.address
    );
    const user2PendingRewardsAfter = await tokenFarm.pendingRewards(
      user2.address
    );

    expect(user1PendingRewardsAfter).to.be.above(user1PendingRewardsBefore);
    expect(user2PendingRewardsAfter).to.be.above(user2PendingRewardsBefore);
  });
});
