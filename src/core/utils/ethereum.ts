import { isHexString } from '@ethersproject/bytes';
import { isValidMnemonic } from '@ethersproject/hdnode';
import { Mnemonic, isAddress } from 'ethers/lib/utils';
import { startsWith } from 'lodash';
import { Address } from 'wagmi';

import { PrivateKey } from '../keychain/IKeychain';
import { EthereumWalletType } from '../types/walletTypes';

export type EthereumWalletSeed = PrivateKey | Mnemonic['phrase'];

/**
 * @desc Checks if a hex string, ignoring prefixes and suffixes.
 * @param value The string.
 * @return Whether or not the string is a hex string.
 */
export const isHexStringIgnorePrefix = (value: string): boolean => {
  if (!value) return false;
  const trimmedValue = value.trim();
  const updatedValue = addHexPrefix(trimmedValue);
  return isHexString(updatedValue);
};

/**
 * @desc Adds an "0x" prefix to a string if one is not present.
 * @param value The starting string.
 * @return The prefixed string.
 */
export const addHexPrefix = (value: string): string =>
  startsWith(value, '0x') ? value : `0x${value}`;

export const identifyWalletType = (
  walletSeed: EthereumWalletSeed,
): EthereumWalletType => {
  if (
    isHexStringIgnorePrefix(walletSeed) &&
    addHexPrefix(walletSeed).length === 66
  ) {
    return EthereumWalletType.privateKey;
  }
  // 12 or 24 words seed phrase
  if (isValidMnemonic(walletSeed)) {
    return EthereumWalletType.mnemonic;
  }
  // Public address (0x)
  if (isAddress(walletSeed)) {
    return EthereumWalletType.readOnly;
  }
  // seed
  return EthereumWalletType.seed;
};

/**
 * @desc Checks if a an address has previous transactions
 * @param  {String} address
 * @return {Promise<Boolean>}
 */
export const hasPreviousTransactions = async (
  address: Address,
): Promise<boolean> => {
  try {
    const url = `https://aha.rainbow.me/?address=${address}`;
    const response = await fetch(url);
    if (!response.ok) {
      return false;
    }

    const parsedResponse: {
      data: {
        addresses: Record<string, boolean>;
      };
    } = await response.json();

    return parsedResponse?.data?.addresses[address.toLowerCase()] === true;
  } catch (e) {
    return false;
  }
};
