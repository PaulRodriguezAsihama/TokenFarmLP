const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Demostración COMPLETA del TokenFarm con recompensas...\n");

  // Paso 1: Obtener cuentas y desplegar contratos
  const [owner, user1, user2] = await ethers.getSigners();
  console.log("👥 Cuentas:");
  console.log(`   Owner: ${owner.address}`);
  console.log(`   User1: ${user1.address}`);
  console.log(`   User2: ${user2.address}\n`);

  // Desplegar contratos
  const DappToken = await ethers.getContractFactory("DappToken");
  const dappToken = await DappToken.deploy(owner.address);

  const LPToken = await ethers.getContractFactory("LPToken");
  const lpToken = await LPToken.deploy(owner.address);

  const TokenFarm = await ethers.getContractFactory("TokenFarm");
  const tokenFarm = await TokenFarm.deploy(dappToken.target, lpToken.target);

  console.log("📋 Contratos desplegados:");
  console.log(`   DappToken: ${dappToken.target}`);
  console.log(`   LPToken: ${lpToken.target}`);
  console.log(`   TokenFarm: ${tokenFarm.target}\n`);

  // Paso 2: Mintear LP Tokens para usuarios
  console.log("🪙 Paso 2: Owner mintea LP Tokens para usuarios...");
  const lpAmount = ethers.parseEther("1000");

  await lpToken.mint(user1.address, lpAmount);
  await lpToken.mint(user2.address, lpAmount);

  console.log(`   ✅ User1 recibe: ${ethers.formatEther(lpAmount)} LP Tokens`);
  console.log(
    `   ✅ User2 recibe: ${ethers.formatEther(lpAmount)} LP Tokens\n`
  );

  // Paso 3: Usuarios aprueban al TokenFarm
  console.log("✅ Paso 3: Usuarios aprueban al TokenFarm...");
  const approveAmount = ethers.parseEther("500");

  await lpToken.connect(user1).approve(tokenFarm.target, approveAmount);
  await lpToken.connect(user2).approve(tokenFarm.target, approveAmount);

  console.log(`   ✅ User1 aprueba: ${ethers.formatEther(approveAmount)} LP`);
  console.log(`   ✅ User2 aprueba: ${ethers.formatEther(approveAmount)} LP\n`);

  // Paso 4: Usuarios depositan en TokenFarm
  console.log("🏦 Paso 4: Usuarios depositan en TokenFarm...");
  const depositAmount1 = ethers.parseEther("100");
  const depositAmount2 = ethers.parseEther("200");

  console.log("   📍 Bloque inicial:", await ethers.provider.getBlockNumber());

  await tokenFarm.connect(user1).deposit(depositAmount1);
  console.log(`   ✅ User1 deposita: ${ethers.formatEther(depositAmount1)} LP`);

  await tokenFarm.connect(user2).deposit(depositAmount2);
  console.log(`   ✅ User2 deposita: ${ethers.formatEther(depositAmount2)} LP`);

  console.log(
    "   📍 Bloque después de depósitos:",
    await ethers.provider.getBlockNumber()
  );
  console.log();

  // Verificar estado inicial
  const totalStaking = await tokenFarm.totalStakingBalance();
  console.log("📊 Estado inicial del staking:");
  console.log(
    `   User1 balance: ${ethers.formatEther(
      await tokenFarm.stakingBalance(user1.address)
    )} LP`
  );
  console.log(
    `   User2 balance: ${ethers.formatEther(
      await tokenFarm.stakingBalance(user2.address)
    )} LP`
  );
  console.log(`   Total staking: ${ethers.formatEther(totalStaking)} LP\n`);

  // Paso 5: Simular tiempo y distribuir recompensas
  console.log("⏰ Paso 5: Simulando tiempo y distribuyendo recompensas...");

  // Minar algunos bloques
  await network.provider.send("hardhat_mine", ["0x5"]); // 5 bloques
  console.log("   ⛏️  5 bloques minados");
  console.log("   📍 Bloque actual:", await ethers.provider.getBlockNumber());

  // Owner distribuye recompensas manualmente
  await tokenFarm.connect(owner).distributeRewardsAll();
  console.log("   ✅ Owner ejecutó distributeRewardsAll()");

  // Verificar recompensas pendientes
  const user1Pending = await tokenFarm.pendingRewards(user1.address);
  const user2Pending = await tokenFarm.pendingRewards(user2.address);

  console.log("\n💎 Recompensas pendientes después de distribución:");
  console.log(`   User1: ${ethers.formatEther(user1Pending)} DAPP`);
  console.log(`   User2: ${ethers.formatEther(user2Pending)} DAPP\n`);

  // Paso 6: Usuarios reclaman recompensas
  console.log("🎁 Paso 6: Usuarios reclaman recompensas...");

  if (user1Pending > 0) {
    await tokenFarm.connect(user1).claimRewards();
    console.log("   ✅ User1 reclamó sus recompensas");
  } else {
    console.log("   ❌ User1 no tiene recompensas para reclamar");
  }

  if (user2Pending > 0) {
    await tokenFarm.connect(user2).claimRewards();
    console.log("   ✅ User2 reclamó sus recompensas");
  } else {
    console.log("   ❌ User2 no tiene recompensas para reclamar");
  }

  // Verificar balances finales
  const user1DappBalance = await dappToken.balanceOf(user1.address);
  const user2DappBalance = await dappToken.balanceOf(user2.address);

  console.log("\n💰 Balances finales de DAPP Tokens:");
  console.log(`   User1: ${ethers.formatEther(user1DappBalance)} DAPP`);
  console.log(`   User2: ${ethers.formatEther(user2DappBalance)} DAPP\n`);

  // Paso 7: Simular más tiempo y verificar acumulación de recompensas
  console.log("⏰ Paso 7: Más tiempo pasa...");
  await network.provider.send("hardhat_mine", ["0xA"]); // 10 bloques más
  console.log("   ⛏️  10 bloques adicionales minados");

  await tokenFarm.connect(owner).distributeRewardsAll();
  console.log("   ✅ Owner ejecutó distributeRewardsAll() nuevamente");

  const user1PendingNew = await tokenFarm.pendingRewards(user1.address);
  const user2PendingNew = await tokenFarm.pendingRewards(user2.address);

  console.log("\n💎 Nuevas recompensas pendientes:");
  console.log(`   User1: ${ethers.formatEther(user1PendingNew)} DAPP`);
  console.log(`   User2: ${ethers.formatEther(user2PendingNew)} DAPP\n`);

  console.log("✅ ¡Demostración COMPLETA finalizada exitosamente!");
  console.log("\n📝 Resumen:");
  console.log(
    `   - User1 stakeó ${ethers.formatEther(
      depositAmount1
    )} LP (33.33% del total)`
  );
  console.log(
    `   - User2 stakeó ${ethers.formatEther(
      depositAmount2
    )} LP (66.67% del total)`
  );
  console.log(`   - Las recompensas se distribuyen proporcionalmente`);
  console.log(`   - User2 debería recibir el doble de recompensas que User1`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
