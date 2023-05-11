// Reference: https://gist.github.com/homura/d62e5d3fa243d30fb2df25a6e963fa74

const { readFileSync } = require('fs');
const { privateKeyToBlake160 } = require('@ckb-lumos/hd/lib/key');
const {
    generateSecp256k1Blake160Address,
    sealTransaction,
} = require("@ckb-lumos/helpers");
const { config, hd, Indexer, RPC } = require("@ckb-lumos/lumos");
const { generateDeployWithTypeIdTx } = require ("@ckb-lumos/common-scripts/lib/deploy");
const { prepareSigningEntries } = require ("@ckb-lumos/common-scripts/lib/helper");
const { predefined } = require ("@ckb-lumos/config-manager") ;

// address: https://ckb.tools/generator
// faucet: https://faucet.nervos.org
const PRIVATE_KEY =
    "0xd1a65dcc86610ba7a5b11ce61e0f9d7e6abff62693a9b81711ad8114fd7fb900";
const CKB_URL = "http://localhost:8114";
const CKB_INDEXER_URL = "http://localhost:8116/indexer";

let depfunc = async function deploy(contractBinPath) {
    config.initializeConfig(config.predefined.AGGRON4);

    const args = privateKeyToBlake160(PRIVATE_KEY);
    const fromAddr = generateSecp256k1Blake160Address(args, { config: predefined.AGGRON4 });
    const contractBin = readFileSync(contractBinPath);

    const result = await generateDeployWithTypeIdTx({
        cellProvider: new Indexer(CKB_INDEXER_URL, CKB_URL),
        fromInfo: fromAddr,
        scriptBinary: contractBin,
        config: config.predefined.AGGRON4,
    });

    // console.log(result.txSkeleton.outputs.toJSON());

    const tx = prepareSigningEntries(
        result.txSkeleton,
        config.predefined.AGGRON4,
        "SECP256K1_BLAKE160"
    );

    const signature = hd.key.signRecoverable(
        tx.get("signingEntries").get(0).message,
        PRIVATE_KEY
);

    const sealed = sealTransaction(tx, [signature]);
    console.log(sealed);
    const txHash = await new RPC(CKB_URL).send_transaction(sealed);

    console.log(txHash);
}

module.exports.deploy = depfunc

// export dp = deploy("contracts-bin/always-success").then(console.log, console.error);