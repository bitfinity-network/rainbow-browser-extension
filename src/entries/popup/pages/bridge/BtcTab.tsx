import React from 'react';

import { i18n } from '~/core/languages';
import { truncateAddress } from '~/core/utils/address';
import { Box, Button, Stack, Text } from '~/design-system';

import { triggerToast } from '../../components/Toast/Toast';
import { QRCode } from '../../pages/qrcode/qrcode';

export function BtcTab({ address }: { address: string }) {
  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(address);
    triggerToast({
      title: i18n.t('wallet_header.copy_toast'),
      description: truncateAddress(address),
    });
  }, [address]);

  return (
    <Box
      display="flex"
      width="full"
      alignItems="center"
      justifyContent="center"
    >
      <Stack alignItems="center">
        <QRCode size={280} value={address as string} />
        <Text color={'labelTertiary'} size="16pt" weight="bold">
          {truncateAddress(address)}
        </Text>
        <Box
          paddingTop="16px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            color="surfaceSecondaryElevated"
            symbol="square.on.square"
            height="28px"
            variant="raised"
            onClick={handleCopy}
            tabIndex={0}
          >
            {i18n.t('qr_code.copy_address')}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
