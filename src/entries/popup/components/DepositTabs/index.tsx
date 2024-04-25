import React from 'react';

import { Box } from '~/design-system';

import { BtcTab } from '../../pages/bridge/BtcTab';

export const DepositTabs = () => {
  const btcAddress = 'bcrt1quyuy47jf5w299ydf4xmspevkvyq6prv0qsjmrs';

  return (
    // TODO: add tabs like BitfinityWallet
    <Box>
      <BtcTab address={btcAddress} />
    </Box>
  );
};
