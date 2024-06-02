import React from 'react';

import { i18n } from '~/core/languages';
import { Box } from '~/design-system';

import { DepositTabs } from '../../components/DepositTabs';
import { Navbar } from '../../components/Navbar/Navbar';

export function Deposit() {
  return (
    <>
      <Navbar
        title={i18n.t('bridge_bitfinity.title')}
        background={'surfaceSecondary'}
        leftComponent={<Navbar.CloseButton />}
      />
      <Box
        background="surfaceSecondary"
        style={{ height: 535, overflow: 'hidden' }}
      >
        <DepositTabs />
      </Box>
    </>
  );
}
