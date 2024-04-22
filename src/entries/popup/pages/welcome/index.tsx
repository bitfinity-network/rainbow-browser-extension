import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { i18n } from '~/core/languages';
import { usePendingRequestStore } from '~/core/state';
import { useCurrentThemeStore } from '~/core/state/currentSettings/currentTheme';
import { useWalletBackupsStore } from '~/core/state/walletBackups';
import { Box, Stack, Text } from '~/design-system';

import BitfinityLogo from '../../../../../static/images/bitfinity_logo.png';
import ExternalImage from '../../components/ExternalImage/ExternalImage';

import { ImportOrCreateWallet } from './ImportOrCreateWallet';
import { OnboardBeforeConnectSheet } from './OnboardBeforeConnectSheet';

export function Welcome() {
  const { pendingRequests } = usePendingRequestStore();
  const [showOnboardBeforeConnectSheet, setShowOnboardBeforeConnectSheet] =
    useState(!!pendingRequests.length);
  const { setNeedsInitialization } = useWalletBackupsStore();
  const { currentTheme } = useCurrentThemeStore();
  const bgImage =
    currentTheme === 'dark'
      ? 'images/bitfinity_bg_dark.png'
      : 'images/bitfinity_bg_light.png';

  useEffect(() => {
    setNeedsInitialization(false);
  }, [setNeedsInitialization]);

  return (
    <>
      <OnboardBeforeConnectSheet
        show={showOnboardBeforeConnectSheet}
        onClick={() => setShowOnboardBeforeConnectSheet(false)}
      />
      <Box
        paddingHorizontal="24px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        background="surfaceSecondary"
        style={{
          paddingTop: 150,
          paddingBottom: 28,
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
        }}
      >
        <Box>
          <Stack space="4px">
            <Box
              width="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <ExternalImage
                height={32}
                width={40}
                style={{ marginRight: 8 }}
                src={BitfinityLogo}
              />
              <Text size="23pt" weight="bold">
                Bitfinity
              </Text>
            </Box>
            <Box
              width="full"
              justifyContent="center"
              alignItems="center"
              display="flex"
            >
              <Text
                align="center"
                color="labelTertiary"
                size="16pt"
                weight="bold"
              >
                {i18n.t('welcome.subtitle')}
              </Text>
            </Box>
          </Stack>
        </Box>
        <AnimatePresence mode="popLayout" initial={false}>
          <Box key="welcome" width="full">
            <ImportOrCreateWallet />
          </Box>
        </AnimatePresence>
      </Box>
    </>
  );
}
