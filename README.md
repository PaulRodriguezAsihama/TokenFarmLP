# 🚀 TokenFarm - Proportional Staking Protocol

![Solidity](https://img.shields.io/badge/Solidity-0.8.22-blue)
![Hardhat](https://img.shields.io/badge/Hardhat-2.26.2-yellow)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-5.0.0-green)
![License](https://img.shields.io/badge/License-MIT-red)

Un protocolo de staking descentralizado que distribuye recompensas de manera proporcional basado en la participación de cada usuario en el pool total de staking.

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Contratos](#-contratos)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Scripts de Demostración](#-scripts-de-demostración)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## 🎯 Descripción

TokenFarm es un sistema de staking donde los usuarios pueden depositar LP Tokens y recibir recompensas en DAPP Tokens de manera proporcional a su participación en el pool total. El protocolo calcula las recompensas basándose en:

- **Participación proporcional**: Cada usuario recibe recompensas según su % del total stakeado
- **Tiempo de staking**: Las recompensas se acumulan por bloque
- **Distribución justa**: Sistema matemáticamente verificable y transparente

## ✨ Características

- 🏦 **Staking de LP Tokens**: Los usuarios pueden depositar y retirar LP tokens
- 💎 **Recompensas Proporcionales**: Distribución basada en la participación individual
- ⏰ **Recompensas por Bloque**: Sistema continuo de generación de recompensas
- 🔄 **Reclamo Flexible**: Los usuarios pueden reclamar recompensas en cualquier momento
- 🏧 **Retiro Completo**: Posibilidad de retirar todos los tokens stakeados
- 📊 **Transparencia Total**: Todos los balances y recompensas son públicamente verificables

## 🏗️ Arquitectura

El sistema está compuesto por tres contratos principales:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  DappToken  │    │   LPToken   │    │  TokenFarm  │
│             │    │             │    │             │
│ (Recompensas)│    │ (Staking)   │    │ (Protocolo) │
└─────────────┘    └─────────────┘    └─────────────┘
        ▲                   ▲                   │
        │                   │                   │
        └───────────────────┼───────────────────┘
                           │
                    ┌─────────────┐
                    │   Usuarios  │
                    └─────────────┘
```

## 🛠️ Instalación

### Prerrequisitos

- Node.js >= 16.0.0
- npm o yarn
- Git

### Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/token-farm.git
cd token-farm
```

### Instalar Dependencias

```bash
npm install
```

### Compilar Contratos

```bash
npx hardhat compile
```

## 🚀 Uso

### 1. Iniciar Red Local

```bash
# Terminal 1: Iniciar nodo Hardhat
npx hardhat node

# Terminal 2: Desplegar contratos
npx hardhat ignition deploy ignition/modules/Deploy.js --network localhost
```

### 2. Ejecutar Demostración

```bash
# Demostración completa del protocolo
npx hardhat run scripts/fixed-demo.js --network localhost
```

### 3. Ejecutar Tests

```bash
npx hardhat test
```

## 📜 Contratos

### DappToken.sol

Token ERC20 utilizado para las recompensas del protocolo.

**Características:**

- Minteable por el owner
- Transferible entre usuarios
- Utilizado como token de recompensa

### LPToken.sol

Token ERC20 que representa los tokens de liquidez para staking.

**Características:**

- Minteable por el owner
- Representa la participación en el pool de liquidez
- Token principal para el staking

### TokenFarm.sol

Contrato principal que maneja toda la lógica del staking.

**Funciones Principales:**

- `deposit(uint256 _amount)`: Depositar LP tokens para staking
- `withdraw()`: Retirar todos los LP tokens stakeados
- `claimRewards()`: Reclamar recompensas DAPP acumuladas
- `distributeRewardsAll()`: Distribuir recompensas a todos los stakers (solo owner)

**Variables Importantes:**

- `REWARD_PER_BLOCK`: 1e18 (1 DAPP token por bloque total)
- `totalStakingBalance`: Total de LP tokens en staking
- `stakingBalance[user]`: Balance de staking por usuario
- `pendingRewards[user]`: Recompensas pendientes por usuario

## 🧪 Testing

El proyecto incluye tests completos que cubren todos los casos de uso:

```bash
npx hardhat test
```

**Tests Incluidos:**

- ✅ Depósito de LP tokens
- ✅ Cálculo de recompensas proporcionales
- ✅ Reclamo de recompensas
- ✅ Retiro de LP tokens
- ✅ Distribución manual de recompensas
- ✅ Casos edge y validaciones

## 📤 Despliegue

### Red Local (Desarrollo)

```bash
# 1. Iniciar nodo local
npx hardhat node

# 2. Desplegar contratos
npx hardhat ignition deploy ignition/modules/Deploy.js --network localhost
```

### Testnet (Ejemplo: Sepolia)

```bash
# 1. Configurar variables de entorno
PRIVATE_KEY=tu_private_key
SEPOLIA_RPC_URL=tu_rpc_url

# 2. Desplegar
npx hardhat ignition deploy ignition/modules/Deploy.js --network sepolia
```

## 🎬 Scripts de Demostración

### Demo Completa

```bash
npx hardhat run scripts/fixed-demo.js --network localhost
```

Este script demuestra:

1. 🏗️ Despliegue de contratos
2. 🔑 Configuración de permisos
3. 🪙 Distribución de LP tokens
4. ✅ Proceso de aprobación
5. 🏦 Depósito en TokenFarm
6. ⏰ Generación de recompensas
7. 🎁 Reclamo de recompensas
8. 🏧 Proceso de retiro

### Demo Básica

```bash
npx hardhat run scripts/demo.js --network localhost
```

## 💰 Ejemplo de Uso

```javascript
// 1. Aprobar TokenFarm para gastar LP tokens
await lpToken.connect(user).approve(tokenFarm.address, amount);

// 2. Depositar LP tokens
await tokenFarm.connect(user).deposit(ethers.parseEther("100"));

// 3. Esperar tiempo (bloques) para generar recompensas
await network.provider.send("hardhat_mine", ["0x10"]);

// 4. Distribuir recompensas (owner)
await tokenFarm.connect(owner).distributeRewardsAll();

// 5. Reclamar recompensas
await tokenFarm.connect(user).claimRewards();

// 6. Retirar LP tokens (opcional)
await tokenFarm.connect(user).withdraw();
```

## 📊 Matemáticas del Sistema

### Cálculo de Recompensas

```
reward = (blocksPassed × REWARD_PER_BLOCK × userStake) / totalStake
```

**Ejemplo:**

- User A: 100 LP stakeados (25% del total)
- User B: 300 LP stakeados (75% del total)
- Total: 400 LP
- Bloques transcurridos: 10
- REWARD_PER_BLOCK: 1e18

**Resultados:**

- User A: `10 × 1e18 × 100 / 400 = 2.5e18 DAPP`
- User B: `10 × 1e18 × 300 / 400 = 7.5e18 DAPP`

## ⚠️ Consideraciones de Seguridad

1. **Ownership**: El TokenFarm debe ser owner del DappToken para mintear recompensas
2. **Approvals**: Los usuarios deben aprobar explícitamente sus tokens antes del depósito
3. **Reentrancy**: Los contratos utilizan patrones seguros para evitar ataques de reentrancia
4. **Integer Overflow**: Uso de Solidity 0.8.22+ para protección automática

## 🛠️ Estructura del Proyecto

```
token-farm/
├── contracts/
│   ├── DappToken.sol
│   ├── LPToken.sol
│   └── TokenFarm.sol
├── ignition/
│   └── modules/
│       └── Deploy.js
├── scripts/
│   ├── demo.js
│   ├── complete-demo.js
│   └── fixed-demo.js
├── test/
│   └── TokenFarm.test.js
├── hardhat.config.js
├── package.json
├── GUIA_USO.md
└── README.md
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.

## 📞 Contacto

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter) - tu.email@ejemplo.com

Link del Proyecto: [https://github.com/tu-usuario/token-farm](https://github.com/tu-usuario/token-farm)

---

⭐ **¡No olvides dar una estrella si este proyecto te fue útil!** ⭐
