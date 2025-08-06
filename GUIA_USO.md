# 📋 Guía Paso a Paso: Uso del TokenFarm

## 🔧 Configuración Inicial

### 1. Desplegar Contratos

```javascript
// Desplegar DappToken
const DappToken = await ethers.getContractFactory("DappToken");
const dappToken = await DappToken.deploy(owner.address);

// Desplegar LPToken
const LPToken = await ethers.getContractFactory("LPToken");
const lpToken = await LPToken.deploy(owner.address);

// Desplegar TokenFarm
const TokenFarm = await ethers.getContractFactory("TokenFarm");
const tokenFarm = await TokenFarm.deploy(dappToken.target, lpToken.target);
```

### 2. Configurar Permisos (CRÍTICO)

```javascript
// El TokenFarm necesita poder mintear DappTokens para las recompensas
await dappToken.transferOwnership(tokenFarm.target);
```

## 👥 Proceso para Usuarios

### Paso 1: Owner Distribuye LP Tokens

```javascript
// El owner mintea LP Tokens para los usuarios
const lpAmount = ethers.parseEther("1000"); // 1000 LP tokens

await lpToken.mint(user1.address, lpAmount);
await lpToken.mint(user2.address, lpAmount);
```

### Paso 2: Usuarios Aprueban al TokenFarm

```javascript
// Los usuarios deben aprobar al TokenFarm para gastar sus LP tokens
const approveAmount = ethers.parseEther("500");

await lpToken.connect(user1).approve(tokenFarm.target, approveAmount);
await lpToken.connect(user2).approve(tokenFarm.target, approveAmount);
```

### Paso 3: Usuarios Depositan en TokenFarm

```javascript
// Los usuarios depositan LP tokens para empezar a hacer staking
const depositAmount1 = ethers.parseEther("100"); // User1: 100 LP
const depositAmount2 = ethers.parseEther("200"); // User2: 200 LP

await tokenFarm.connect(user1).deposit(depositAmount1);
await tokenFarm.connect(user2).deposit(depositAmount2);
```

## 💰 Sistema de Recompensas

### Distribución de Recompensas

```javascript
// El owner puede distribuir recompensas manualmente
await tokenFarm.connect(owner).distributeRewardsAll();

// O las recompensas se calculan automáticamente en cada depósito/retiro
```

### Reclamo de Recompensas

```javascript
// Los usuarios pueden reclamar sus recompensas DAPP acumuladas
await tokenFarm.connect(user1).claimRewards();
await tokenFarm.connect(user2).claimRewards();
```

### Retiro de LP Tokens

```javascript
// Los usuarios pueden retirar todos sus LP tokens
await tokenFarm.connect(user1).withdraw();

// Nota: Aún pueden reclamar recompensas pendientes después del retiro
```

## 📊 Verificaciones Útiles

### Consultar Estados

```javascript
// Balance de staking de un usuario
const stakingBalance = await tokenFarm.stakingBalance(user.address);

// Recompensas pendientes
const pendingRewards = await tokenFarm.pendingRewards(user.address);

// Si está haciendo staking
const isStaking = await tokenFarm.isStaking(user.address);

// Total de staking en el contrato
const totalStaking = await tokenFarm.totalStakingBalance();
```

### Consultar Balances de Tokens

```javascript
// Balance de LP tokens
const lpBalance = await lpToken.balanceOf(user.address);

// Balance de DAPP tokens (recompensas)
const dappBalance = await dappToken.balanceOf(user.address);
```

## ⚠️ Puntos Importantes

1. **Permisos**: El TokenFarm DEBE ser owner del DappToken para poder mintear recompensas
2. **Aprobación**: Los usuarios DEBEN aprobar al TokenFarm antes de depositar
3. **Recompensas Proporcionales**: Se distribuyen según el % de participación en el total staking
4. **Reclamo Post-Retiro**: Los usuarios pueden reclamar recompensas pendientes incluso después de retirar

## 🔄 Flujo Completo

1. Owner despliega contratos
2. Owner transfiere propiedad de DappToken a TokenFarm
3. Owner mintea LP Tokens para usuarios
4. Usuarios aprueban TokenFarm para gastar LP Tokens
5. Usuarios depositan LP Tokens (inicia staking)
6. Tiempo pasa → se generan recompensas
7. Owner ejecuta distributeRewardsAll() (opcional)
8. Usuarios reclaman recompensas DAPP
9. Usuarios pueden retirar LP Tokens cuando quieran
10. Usuarios pueden seguir reclamando recompensas pendientes

## 💡 Ejemplo Práctico

- User1 deposita 100 LP (33.33% del total)
- User2 deposita 200 LP (66.67% del total)
- Total staking: 300 LP
- Si se generan 6 DAPP de recompensas:
  - User1 recibe: 6 × 33.33% = 2 DAPP
  - User2 recibe: 6 × 66.67% = 4 DAPP
