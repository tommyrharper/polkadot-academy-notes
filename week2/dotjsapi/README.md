# JS API

```ts
> npm i @polkadot/api
> ts-node -i
import { ApiPromise, WsProvider } from "@polkadot/api";
let provider = new WsProvider("wss://rpc.polkadot.io");
let api = await ApiPromise.create({ provider });
api.sign
api.clone
api.stats
api.runtimeVersion
api.runtimeVersion.toU8a()
api.registry.chainDecimals
api.registry.chainTokens
api.registry.chainSS58
api.registry.metadata
api.registry.metadata.pallets
api.registry.metadata.pallets.map(x => x.name)
api.rpc
api.rpc.author
api.rpc.chain.getBlock()
api.rpc.chain.getBlockHash()
await api.rpc.chain.getBlock("0x3d68e452c5f59e2690aebec315b84e91ce78826d12525db8bcba35bbf023063d")
(await api.rpc.chain.getBlock("0x3d68e452c5f59e2690aebec315b84e91ce78826d12525db8bcba35bbf023063d")).toHuman()
let block = (await api.rpc.chain.getBlock("0x3d68e452c5f59e2690aebec315b84e91ce78826d12525db8bcba35bbf023063d")).toHuman()
let b = block.block as any
b.extrinsics[0]
await api.rpc.system.chain()
// get node health
(await api.rpc.system.health()).toHuman()
(await api.rpc.system.version()).toHuman()
api.rpc.state
// get first 10 keys in dot state
(await api.rpc.state.getKeysPaged("0x", 10)).toHuman()
(await api.rpc.state.getStorage("0x06de3d8a54d27e44a9d5ce189618f22d4e7b9012096b41c4eb3aaf947f6ea429") as any).toHuman()
(await api.rpc.state.getStorage("0x06de3d8a54d27e44a9d5ce189618f22d4e7b9012096b41c4eb3aaf947f6ea429") as any).unwrap()
(await api.rpc.state.getReadProof(["0x06de3d8a54d27e44a9d5ce189618f22d4e7b9012096b41c4eb3aaf947f6ea429"])).toHuman()
```

```ts
import KeyringPair from "@polkadot/keyring";
import { ApiPromise, WsProvider } from "@polkadot/api";
let provider = new WsProvider("wss://westend-rpc.polkadot.io");
let api = await ApiPromise.create({ provider });
import { Keyring } from "@polkadot/api";
let kr = new Keyring({ type: 'sr25519', ss58Format: 42 });
let account = kr.addFromUri("evil salad sauce traffic floor shove high famous blossom excite matter casino");
account.address
let call = api.tx.balances.transfer("5GBoBNFP9TA7nAk82i6SUZJimerbdhxaRgyC2PVcdYQMdb8e", 5);
let c = call;
c.toHuman();
let signed = c.sign(account)
c.signAndSend(account, ({ events = [], status, dispatchError }) => { console.log(status.toHuman()) });
// predict fee for transfer
(await c.paymentInfo(account)).toHuman()
api.registry.chainDecimals
``

