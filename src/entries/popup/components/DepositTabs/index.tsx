import React from 'react';

import { Box } from '~/design-system';

import { BtcTab } from '../../pages/bridge/BtcTab';

export const DepositTabs = () => {
  const btcAddress = 'bc1qv6fmy2yzetf4pp0jgrtzgs64g59c0sh2u6fxdw';

  return (
    // TODO: add tabs like BitfinityWallet
    <Box>
      <BtcTab address={btcAddress} />
    </Box>
  );
};
