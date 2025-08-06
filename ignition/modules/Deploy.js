const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TokenFarmModule", (m) => {
  const initialOwner = m.getAccount(0);

  const dappToken = m.contract("DappToken", [initialOwner]);
  const lpToken = m.contract("LPToken", [initialOwner]);

  const tokenFarm = m.contract("TokenFarm", [dappToken, lpToken]);

  return { dappToken, lpToken, tokenFarm };
});
