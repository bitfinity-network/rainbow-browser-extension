import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

import { idlFactory } from './btc-bridge/btc-bridge.did';
import { ethAddrToSubaccount } from './utils';

const BTC_BRIDGE_CANISTER_ID = 'by6od-j4aaa-aaaaa-qaadq-cai';

const agent = new HttpAgent({
  host: 'http://127.0.0.1:4943',
});
export class BtcBridgeClass {
  async getBtcActor() {
    await agent.fetchRootKey();
    const btcActor = Actor.createActor(idlFactory, {
      canisterId: BTC_BRIDGE_CANISTER_ID,
      agent,
    });
    return btcActor;
  }

  async getDepositAddress(ethAddress: string) {
    const btcActor = await this.getBtcActor();
    const btcAddress = (await btcActor.get_btc_address({
      owner: [Principal.fromText(BTC_BRIDGE_CANISTER_ID)],
      subaccount: [ethAddrToSubaccount(ethAddress)],
      agent,
    })) as {
      Ok: string;
    };
    console.log('btc address', btcAddress);
    return btcAddress.Ok;
  }
  async bridgeBtc(ethAddress: string) {
    const btcActor = await this.getBtcActor();
    const btcAddress = await this.getDepositAddress(ethAddress);
    console.log('btcAddress', btcAddress);
    // await this.btc.sendBitcoin(btcAddress, satoshis);
    try {
      const result = await btcActor.btc_to_erc20(ethAddress);

      console.log('result', result);
      return result;
    } catch (error) {
      console.log('error', error);
    }
  }
}
