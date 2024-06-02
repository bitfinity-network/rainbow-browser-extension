const isValidBtcAddress = (address: string) => {
  const isBitcoinBech32RegtestAddress =
    /^bcrt1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{39,59}$/.test(address) &&
    !/^bcrt1qqu[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{34,54}$/.test(address);

  return isBitcoinBech32RegtestAddress;
};

const isValidRuneBtcAddress = (address: string) => {
  const isRuneBitcoinBech32RegtestAddress =
    /^bcrt1qqu[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{34,54}$/.test(address);
  return isRuneBitcoinBech32RegtestAddress;
};

export { isValidBtcAddress, isValidRuneBtcAddress };
