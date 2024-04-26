const isValidBtcAddress = (address: string) => {
  const isBitcoinBech32RegtestAddress =
    /^bcrt1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{39,59}$/.test(address);

  return isBitcoinBech32RegtestAddress;
};

export { isValidBtcAddress };
