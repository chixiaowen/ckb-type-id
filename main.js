const CKB = require('@nervosnetwork/ckb-sdk-core').default
const {SudtAccount} = require('./src/sudt')

const nodeUrl = 'http://localhost:8114'

const ckb = new CKB(nodeUrl)

const {utils} = require('@ckb-lumos/base')

const deploy = require('./src/deploy')

// const { Indexer, CellCollector } = require('@ckb-lumos/indexer')

// ckb.rpc.getBlockchainInfo().then(e => {
//     console.log(e);
// })

// SudtAccount.prototype.ckb.rpc.getBlockchainInfo().then(e => {
//     console.log(e);
// })

// deploy.deploy("contracts-bin/always-success").then(console.log, console.error);
// let input =

// let input = { , since: "0x0" }
// console.log(input.previousOutput.txHash);
const typeId = utils.generateTypeIdScript(
    { previousOutput: {txHash: "0x03b48b52a114224ab6d6d2d99d5af461b8da897df7a8efdd49215345cf73dd4a", index: "0x0"}, since: "0x0" },
"0x0"
);

console.log(typeId);
