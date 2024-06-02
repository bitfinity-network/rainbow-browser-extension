/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import { Actor, HttpAgent } from '@dfinity/agent';

import { idlFactory } from './rune-bridge/service-did';

const RUNE_BRIDGE_CANISTER_ID = 'br5f7-7uaaa-aaaaa-qaaca-cai';

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
export class RuneBridgeClass {
  async getRuneActor() {
    const agent = new HttpAgent({
      host: 'http://127.0.0.1:4943',
    });
    await agent.fetchRootKey();
    const runeActor = Actor.createActor(idlFactory, {
      canisterId: RUNE_BRIDGE_CANISTER_ID,
      agent,
    });
    return runeActor;
  }
  async getDepositAddress(ethAddress: string) {
    const runeActor = await this.getRuneActor();
    const runeAddress = (await runeActor.get_deposit_address(ethAddress)) as {
      Ok: string;
    };

    console.log('runeAddress', runeAddress);
    if ('Ok' in runeAddress) {
      return runeAddress.Ok;
    }
    return '';
  }
  async bridgeBtc(ethAddress: string) {
    const runeActor = await this.getRuneActor();
    const runeAddress = await this.getDepositAddress(ethAddress);

    console.log('runeAddress', runeAddress);

    // await this.btc.sendBitcoin(btcAddress, satoshis);
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        const result = (await runeActor.deposit(ethAddress)) as {
          Ok: string;
        };

        console.log('result', result);
        if ('Ok' in result) {
          return result.Ok;
        }

        await wait(5000);
      }
    } catch (error) {
      console.log('error', error);
    }
  }
}
