/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/order */
/* eslint-disable spaced-comment */
import { Actor, HttpAgent } from '@dfinity/agent';
import { Secp256k1KeyIdentity } from '@dfinity/identity-secp256k1';
import { Principal } from '@dfinity/principal';
import { mnemonicToSeed } from '@ethersproject/hdnode';

import { idlFactory } from './btc-bridge/btc-bridge.did';
// import { BtcBridge } from './btc-bridge';

import { ethAddrToSubaccount } from './utils';

const BTC_BRIDGE_CANISTER_ID = 'by6od-j4aaa-aaaaa-qaadq-cai';

export const identityFromSeed = async (
  phrase: string,
): Promise<Secp256k1KeyIdentity> => {
  const seed = await mnemonicToSeed(phrase);
  console.log('seed', seed);
  //   const root = hdkey.fromMasterSeed(seed);
  //   const addrnode = root.derive("m/44'/223'/0'/0/0");

  const id = Secp256k1KeyIdentity.fromSeedPhrase(seed);
  console.log('id', id);
  return id;
};

export class BtcBridgeClass {
  async bridgeBtc(satoshis: number, ethAddress: string) {
    const agent = new HttpAgent({
      host: 'http://127.0.0.1:4943',
    });
    await agent.fetchRootKey();
    const btcActor = Actor.createActor(idlFactory, {
      canisterId: BTC_BRIDGE_CANISTER_ID,
      agent,
    });
    const btcAddress = await btcActor.get_btc_address({
      owner: [Principal.fromText(BTC_BRIDGE_CANISTER_ID)],
      subaccount: [ethAddrToSubaccount(ethAddress)],
      agent,
    });
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
