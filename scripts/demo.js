const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Iniciando demostración del TokenFarm...\n");

  // Paso 1: Obtener las cuentas (signers)
  const [owner, user1, user2] = await ethers.getSigners();
  console.log("👥 Cuentas obtenidas:");
  console.log(`   Owner: ${owner.address}`);
  console.log(`   User1: ${user1.address}`);
  console.log(`   User2: ${user2.address}\n`);

  // Paso 2: Desplegar los contratos
  console.log("📋 Desplegando contratos...");

  const DappToken = await ethers.getContractFactory("DappToken");
  const dappToken = await DappToken.deploy(owner.address);
  console.log(`   DappToken desplegado en: ${dappToken.target}`);

  const LPToken = await ethers.getContractFactory("LPToken");
  const lpToken = await LPToken.deploy(owner.address);
  console.log(`   LPToken desplegado en: ${lpToken.target}`);

  const TokenFarm = await ethers.getContractFactory("TokenFarm");
  const tokenFarm = await TokenFarm.deploy(dappToken.target, lpToken.target);
  console.log(`   TokenFarm desplegado en: ${tokenFarm.target}\n`);

  // Paso 3: El owner mintea LP Tokens para los usuarios
  console.log("🪙 Owner minta LP Tokens para los usuarios...");
  const lpAmount = ethers.parseEther("1000"); // 1000 LP tokens para cada usuario

  await lpToken.mint(user1.address, lpAmount);
  await lpToken.mint(user2.address, lpAmount);

  console.log(`   User1 recibe: ${ethers.formatEther(lpAmount)} LP Tokens`);
  console.log(`   User2 recibe: ${ethers.formatEther(lpAmount)} LP Tokens\n`);

  // Verificar balances de LP tokens
  const user1LPBalance = await lpToken.balanceOf(user1.address);
  const user2LPBalance = await lpToken.balanceOf(user2.address);
  console.log("💰 Balances de LP Tokens:");
  console.log(`   User1: ${ethers.formatEther(user1LPBalance)} LP`);
  console.log(`   User2: ${ethers.formatEther(user2LPBalance)} LP\n`);

  // Paso 4: Los usuarios aprueban al TokenFarm para gastar sus LP tokens
  console.log("✅ Usuarios aprueban al TokenFarm para gastar LP Tokens...");
  const approveAmount = ethers.parseEther("500"); // Aprobar 500 LP tokens cada uno

  await lpToken.connect(user1).approve(tokenFarm.target, approveAmount);
  await lpToken.connect(user2).approve(tokenFarm.target, approveAmount);

  console.log(`   User1 aprueba: ${ethers.formatEther(approveAmount)} LP`);
  console.log(`   User2 aprueba: ${ethers.formatEther(approveAmount)} LP\n`);

  // Paso 5: Los usuarios depositan LP tokens en el TokenFarm
  console.log("🏦 Usuarios depositan LP Tokens en el TokenFarm...");
  const depositAmount1 = ethers.parseEther("100"); // User1 deposita 100 LP
  const depositAmount2 = ethers.parseEther("200"); // User2 deposita 200 LP

  await tokenFarm.connect(user1).deposit(depositAmount1);
  console.log(`   User1 deposita: ${ethers.formatEther(depositAmount1)} LP`);

  await tokenFarm.connect(user2).deposit(depositAmount2);
  console.log(`   User2 deposita: ${ethers.formatEther(depositAmount2)} LP\n`);

  // Paso 6: Verificar el estado después de los depósitos
  console.log("📊 Estado después de los depósitos:");

  const user1StakingBalance = await tokenFarm.stakingBalance(user1.address);
  const user2StakingBalance = await tokenFarm.stakingBalance(user2.address);
  const totalStakingBalance = await tokenFarm.totalStakingBalance();

  console.log(
    `   User1 staking balance: ${ethers.formatEther(user1StakingBalance)} LP`
  );
  console.log(
    `   User2 staking balance: ${ethers.formatEther(user2StakingBalance)} LP`
  );
  console.log(
    `   Total staking balance: ${ethers.formatEther(totalStakingBalance)} LP`
  );

  const user1IsStaking = await tokenFarm.isStaking(user1.address);
  const user2IsStaking = await tokenFarm.isStaking(user2.address);
  console.log(`   User1 está haciendo staking: ${user1IsStaking}`);
  console.log(`   User2 está haciendo staking: ${user2IsStaking}\n`);

  // Paso 7: Simular el paso del tiempo y generar recompensas
  console.log("⏰ Simulando el paso del tiempo (minando bloques)...");
  await network.provider.send("hardhat_mine", ["0x10"]); // Minar 16 bloques
  console.log("   16 bloques minados\n");

  // Paso 8: Verificar recompensas pendientes
  console.log("💎 Recompensas pendientes:");
  const user1PendingRewards = await tokenFarm.pendingRewards(user1.address);
  const user2PendingRewards = await tokenFarm.pendingRewards(user2.address);

  console.log(`   User1: ${ethers.formatEther(user1PendingRewards)} DAPP`);
  console.log(`   User2: ${ethers.formatEther(user2PendingRewards)} DAPP\n`);

  // Paso 9: Los usuarios reclaman sus recompensas
  console.log("🎁 Usuarios reclaman recompensas...");

  if (user1PendingRewards > 0) {
    await tokenFarm.connect(user1).claimRewards();
    console.log("   User1 reclamó sus recompensas");
  }

  if (user2PendingRewards > 0) {
    await tokenFarm.connect(user2).claimRewards();
    console.log("   User2 reclamó sus recompensas");
  }

  // Verificar balances de DAPP tokens después del reclamo
  const user1DappBalance = await dappToken.balanceOf(user1.address);
  const user2DappBalance = await dappToken.balanceOf(user2.address);

  console.log("\n💰 Balances de DAPP Tokens después del reclamo:");
  console.log(`   User1: ${ethers.formatEther(user1DappBalance)} DAPP`);
  console.log(`   User2: ${ethers.formatEther(user2DappBalance)} DAPP\n`);

  console.log("✅ ¡Demostración completada exitosamente!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
