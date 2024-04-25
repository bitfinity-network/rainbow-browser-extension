import React from 'react';

import { i18n } from '~/core/languages';
import { Box } from '~/design-system';

import { DepositTabs } from '../../components/DepositTabs';
import { Navbar } from '../../components/Navbar/Navbar';

export function Deposit() {
  return (
    <Box>
      <Navbar
        title={i18n.t('bridge_bitfinity.title')}
        background={'surfaceSecondary'}
        leftComponent={<Navbar.CloseButton />}
      />
      <DepositTabs />
    </Box>
  );
}
