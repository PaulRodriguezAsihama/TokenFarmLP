const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Demostración CORREGIDA del TokenFarm...\n");

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

  // IMPORTANTE: Transferir la propiedad del DappToken al TokenFarm
  console.log("🔑 Transfiriendo propiedad del DappToken al TokenFarm...");
  await dappToken.transferOwnership(tokenFarm.target);
  console.log("   ✅ TokenFarm ahora puede mintear DappTokens\n");

  // Paso 2: Mintear LP Tokens para usuarios
  console.log("🪙 Paso 2: Owner mintea LP Tokens para usuarios...");
  const lpAmount = ethers.parseEther("1000");

  await lpToken.mint(user1.address, lpAmount);
  await lpToken.mint(user2.address, lpAmount);

  console.log(`   ✅ User1 recibe: ${ethers.formatEther(lpAmount)} LP Tokens`);
  console.log(
    `   ✅ User2 recibe: ${ethers.formatEther(lpAmount)} LP Tokens\n`
  );

  // Verificar balances iniciales
  console.log("💰 Balances iniciales de LP Tokens:");
  console.log(
    `   User1: ${ethers.formatEther(await lpToken.balanceOf(user1.address))} LP`
  );
  console.log(
    `   User2: ${ethers.formatEther(
      await lpToken.balanceOf(user2.address)
    )} LP\n`
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
  const depositAmount1 = ethers.parseEther("100"); // User1: 100 LP (33.33%)
  const depositAmount2 = ethers.parseEther("200"); // User2: 200 LP (66.67%)

  console.log("   📍 Bloque inicial:", await ethers.provider.getBlockNumber());

  // User1 deposita
  await tokenFarm.connect(user1).deposit(depositAmount1);
  console.log(`   ✅ User1 deposita: ${ethers.formatEther(depositAmount1)} LP`);

  // User2 deposita
  await tokenFarm.connect(user2).deposit(depositAmount2);
  console.log(`   ✅ User2 deposita: ${ethers.formatEther(depositAmount2)} LP`);

  console.log(
    "   📍 Bloque después de depósitos:",
    await ethers.provider.getBlockNumber()
  );

  // Verificar estado después de depósitos
  console.log("\n📊 Estado después de los depósitos:");
  const user1StakingBalance = await tokenFarm.stakingBalance(user1.address);
  const user2StakingBalance = await tokenFarm.stakingBalance(user2.address);
  const totalStaking = await tokenFarm.totalStakingBalance();

  console.log(
    `   User1 staking: ${ethers.formatEther(user1StakingBalance)} LP`
  );
  console.log(
    `   User2 staking: ${ethers.formatEther(user2StakingBalance)} LP`
  );
  console.log(`   Total staking: ${ethers.formatEther(totalStaking)} LP`);
  console.log(
    `   User1 participa con: ${(
      (Number(user1StakingBalance) / Number(totalStaking)) *
      100
    ).toFixed(2)}%`
  );
  console.log(
    `   User2 participa con: ${(
      (Number(user2StakingBalance) / Number(totalStaking)) *
      100
    ).toFixed(2)}%\n`
  );

  // Verificar balances LP después del depósito
  console.log("💰 Balances de LP después del depósito:");
  console.log(
    `   User1: ${ethers.formatEther(await lpToken.balanceOf(user1.address))} LP`
  );
  console.log(
    `   User2: ${ethers.formatEther(await lpToken.balanceOf(user2.address))} LP`
  );
  console.log(
    `   TokenFarm: ${ethers.formatEther(
      await lpToken.balanceOf(tokenFarm.target)
    )} LP\n`
  );

  // Paso 5: Simular tiempo y distribuir recompensas
  console.log("⏰ Paso 5: Simulando tiempo y distribuyendo recompensas...");

  // Minar algunos bloques para generar recompensas
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
  console.log(`   User2: ${ethers.formatEther(user2Pending)} DAPP`);
  console.log(
    `   Ratio User2/User1: ${(
      Number(user2Pending) / Number(user1Pending)
    ).toFixed(2)}x\n`
  );

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

  // Verificar balances DAPP después del reclamo
  const user1DappBalance = await dappToken.balanceOf(user1.address);
  const user2DappBalance = await dappToken.balanceOf(user2.address);

  console.log("\n💰 Balances de DAPP Tokens después del reclamo:");
  console.log(`   User1: ${ethers.formatEther(user1DappBalance)} DAPP`);
  console.log(`   User2: ${ethers.formatEther(user2DappBalance)} DAPP\n`);

  // Paso 7: User1 retira sus tokens
  console.log("🏧 Paso 7: User1 retira sus LP tokens...");
  await tokenFarm.connect(user1).withdraw();
  console.log("   ✅ User1 retiró todos sus LP tokens");

  console.log("\n📊 Estado después del retiro de User1:");
  console.log(
    `   User1 staking: ${ethers.formatEther(
      await tokenFarm.stakingBalance(user1.address)
    )} LP`
  );
  console.log(
    `   User2 staking: ${ethers.formatEther(
      await tokenFarm.stakingBalance(user2.address)
    )} LP`
  );
  console.log(
    `   User1 está staking: ${await tokenFarm.isStaking(user1.address)}`
  );
  console.log(
    `   User1 balance LP: ${ethers.formatEther(
      await lpToken.balanceOf(user1.address)
    )} LP\n`
  );

  // Paso 8: Más tiempo pasa y User1 aún puede reclamar recompensas pendientes
  console.log("⏰ Paso 8: Más tiempo pasa...");
  await network.provider.send("hardhat_mine", ["0x3"]); // 3 bloques más

  await tokenFarm.connect(owner).distributeRewardsAll();
  console.log("   ✅ Owner ejecutó distributeRewardsAll() nuevamente");

  const user1PendingAfterWithdraw = await tokenFarm.pendingRewards(
    user1.address
  );
  const user2PendingNew = await tokenFarm.pendingRewards(user2.address);

  console.log("\n💎 Recompensas después del retiro:");
  console.log(
    `   User1 (retirado): ${ethers.formatEther(user1PendingAfterWithdraw)} DAPP`
  );
  console.log(
    `   User2 (aún staking): ${ethers.formatEther(user2PendingNew)} DAPP`
  );

  // User1 puede reclamar recompensas pendientes incluso después de retirar
  if (user1PendingAfterWithdraw > 0) {
    await tokenFarm.connect(user1).claimRewards();
    console.log(
      "   ✅ User1 reclamó recompensas pendientes después del retiro"
    );
  }

  console.log("\n✅ ¡Demostración COMPLETA finalizada exitosamente!");
  console.log("\n📝 Resumen del proceso:");
  console.log("   1. ✅ Owner minta LP Tokens para usuarios");
  console.log("   2. ✅ Usuarios aprueban al TokenFarm");
  console.log("   3. ✅ Usuarios depositan LP Tokens (staking)");
  console.log("   4. ✅ Tiempo pasa y se generan recompensas");
  console.log("   5. ✅ Usuarios reclaman recompensas DAPP");
  console.log("   6. ✅ User1 retira sus LP Tokens");
  console.log("   7. ✅ User1 aún puede reclamar recompensas pendientes");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
