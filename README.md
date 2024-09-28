# Crowdfunding Contracts

基于 `@openzeppelin/contracts` 众筹智能合约的实现。

# networks

根据需求选择网络，自行配置网络参数。

```ts
npx hardhat node // 启动本地网络

// hardhat.config.js
  ...
  networks: {
    localhost: {
      url: "http://localhost:8545",
      accounts: [""], // 填入hardhat账户的私钥
    },
  },
  ...
```

# 本地开发环境

```ts

npm install

npm run test // 运行测试用例

npm run deploy // 部署合约

```
