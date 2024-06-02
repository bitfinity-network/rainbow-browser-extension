import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { Box, Stack, Text } from '~/design-system';

import { BtcTab } from '../../pages/bridge/BtcTab';
import { TabContent, Tabs } from '../../pages/messages/Tabs';
import { BtcBridgeClass } from '../../pages/send/btc';
import { RuneBridgeClass } from '../../pages/send/rune';

export const DepositTabs = () => {
  const { address } = useAccount();
  const [expanded, setExpanded] = useState(false);

  const [runeBtcAddress, setRuneBtcAddress] = useState<string | undefined>(
    undefined,
  );

  const [btcAddress, setBtcAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    const runeBridge = new RuneBridgeClass();
    const btcBridge = new BtcBridgeClass();
    if (address) {
      runeBridge.getDepositAddress(address).then((address) => {
        setRuneBtcAddress(address);
      });
      btcBridge.getDepositAddress(address).then((address) => {
        setBtcAddress(address);
      });
    }
  }, [address]);

  const tabs = [
    {
      label: 'BTC',
      content: btcAddress ? <BtcTab address={btcAddress || ''} /> : <></>,
      description: `This is the REAL Bitcoin Address for your wallet. You can use this Bitcoin Address with "Real BTC"`,
      title: 'Receive Btc',
    },
    {
      label: 'Rune',
      content: <BtcTab address={runeBtcAddress || ''} />,
      description: `This is the REAL Rune btc Address for your wallet. You can use this Address with "Real Rune"`,
      title: 'Receive Rune',
    },
  ];

  const tabLabels = tabs.map((tab) => tab.label);

  const onExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Tabs
      fullWidthTabContentNotExpanded
      tabs={tabLabels}
      expanded={expanded}
      onExpand={onExpand}
    >
      {tabs.map((tab) => (
        <TabContent key={tab.label} value={tab.label}>
          <Box
            style={{
              overflow: 'scroll',
              height: 450,
            }}
            paddingBottom="20px"
          >
            <Stack flexDirection="column" space="16px">
              <Text color="labelSecondary" size="16pt" weight="semibold">
                {tab.title}
              </Text>
              <Text size="14pt" weight="bold" color="labelQuaternary">
                {tab.description}
              </Text>

              {tab.content}
            </Stack>
          </Box>
        </TabContent>
      ))}
    </Tabs>
  );
};
