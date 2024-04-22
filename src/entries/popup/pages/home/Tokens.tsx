/* eslint-disable no-nested-ternary */
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion } from 'framer-motion';
import uniqBy from 'lodash/uniqBy';
import { memo, useMemo, useState } from 'react';
import { Chain } from 'wagmi';

import { i18n } from '~/core/languages';
import { supportedCurrencies } from '~/core/references';
import { shortcuts } from '~/core/references/shortcuts';
import { selectUserAssetsList } from '~/core/resources/_selectors';
import {
  selectUserAssetsFilteringSmallBalancesList,
  selectorFilterByUserChains,
} from '~/core/resources/_selectors/assets';
import { useUserAssets } from '~/core/resources/assets';
import { useCustomNetworkAssets } from '~/core/resources/assets/customNetworkAssets';
import {
  useCurrentAddressStore,
  useCurrentCurrencyStore,
  useRainbowChainsStore,
} from '~/core/state';
import { useCurrentThemeStore } from '~/core/state/currentSettings/currentTheme';
import { useHideAssetBalancesStore } from '~/core/state/currentSettings/hideAssetBalances';
import { useHideSmallBalancesStore } from '~/core/state/currentSettings/hideSmallBalances';
import { useRainbowChainAssetsStore } from '~/core/state/rainbowChainAssets';
import { useUserChainsStore } from '~/core/state/userChains';
import { ParsedUserAsset } from '~/core/types/assets';
import { ChainId } from '~/core/types/chains';
import { truncateAddress } from '~/core/utils/address';
import { isCustomChain } from '~/core/utils/chains';
import {
  Box,
  Button,
  Column,
  Columns,
  Inline,
  Inset,
  Stack,
  Symbol,
  Text,
} from '~/design-system';
import { useContainerRef } from '~/design-system/components/AnimatedRoute/AnimatedRoute';
import { TextOverflow } from '~/design-system/components/TextOverflow/TextOverflow';
import { CoinRow } from '~/entries/popup/components/CoinRow/CoinRow';

import { Asterisks } from '../../components/Asterisks/Asterisks';
import { QuickPromo } from '../../components/QuickPromo/QuickPromo';
import { triggerToast } from '../../components/Toast/Toast';
import useKeyboardAnalytics from '../../hooks/useKeyboardAnalytics';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { useRainbowNavigate } from '../../hooks/useRainbowNavigate';
import { useSystemSpecificModifierKey } from '../../hooks/useSystemSpecificModifierKey';
import { useTokensShortcuts } from '../../hooks/useTokensShortcuts';
import { ROUTES } from '../../urls';
import {
  bitfinityTestnetInfo,
  cashiumTestnetToken,
  demoTestnetToken,
} from '../../utils/bitnity-tokens';

import { TokensSkeleton } from './Skeletons';
import { TokenContextMenu } from './TokenDetails/TokenContextMenu';

const TokenRow = memo(function TokenRow({
  token,
  testId,
}: {
  token: ParsedUserAsset;
  testId: string;
}) {
  const navigate = useRainbowNavigate();

  const openDetails = () =>
    navigate(ROUTES.TOKEN_DETAILS(token.uniqueId), {
      state: { skipTransitionOnRoute: ROUTES.HOME },
    });

  return (
    <TokenContextMenu token={token}>
      <Box onClick={openDetails}>
        <AssetRow asset={token} testId={testId} />
      </Box>
    </TokenContextMenu>
  );
});

const AddBitfinityTokens = ({ onAddTokens }: { onAddTokens: () => void }) => {
  const { addCustomRPC, setActiveRPC } = useRainbowChainsStore();
  const { rainbowChainAssets, addRainbowChainAsset } =
    useRainbowChainAssetsStore();
  const { addUserChain } = useUserChainsStore();

  const addCashiumToken = () => {
    addRainbowChainAsset({
      chainId: ChainId.bitfinityTestnet,
      rainbowChainAsset: cashiumTestnetToken,
    });
  };

  const addDemoTestnetToken = () => {
    addRainbowChainAsset({
      chainId: ChainId.sepolia,
      rainbowChainAsset: demoTestnetToken,
    });
  };

  const addBitfinityTokens = () => {
    const chainId = ChainId.bitfinityTestnet;
    const { name, symbol, decimals, rpcUrl, explorerUrl, testnet } =
      bitfinityTestnetInfo;
    const bitfinityChain: Chain = {
      id: 355113,
      name,
      network: name,
      nativeCurrency: {
        symbol,
        decimals,
        name: symbol,
      },
      rpcUrls: { default: { http: [rpcUrl] }, public: { http: [rpcUrl] } },
      blockExplorers: {
        default: {
          name: explorerUrl,
          url: explorerUrl,
        },
      },
      testnet,
    };
    addCustomRPC({
      chain: bitfinityChain,
    });
    addUserChain({ chainId });
    triggerToast({
      title: i18n.t('settings.networks.custom_rpc.network_added'),
      description: i18n.t(
        'settings.networks.custom_rpc.network_added_correctly',
        { networkName: name },
      ),
    });
    setActiveRPC({ rpcUrl, chainId });
    addCashiumToken();
    addDemoTestnetToken();
    onAddTokens();
    console.error('rainbow chain assets:', JSON.stringify(rainbowChainAssets));
  };

  return (
    <Box>
      <Button
        color="accent"
        height="44px"
        variant="flat"
        width="full"
        onClick={addBitfinityTokens}
      >
        Add Bitfinity Tokens
      </Button>
    </Box>
  );
};

export function Tokens() {
  const { currentAddress } = useCurrentAddressStore();
  const { currentCurrency: currency } = useCurrentCurrencyStore();
  const [manuallyRefetchingTokens, setManuallyRefetchingTokens] =
    useState(false);
  const { hideSmallBalances } = useHideSmallBalancesStore();
  const { trackShortcut } = useKeyboardAnalytics();
  const { modifierSymbol } = useSystemSpecificModifierKey();

  const {
    data: assets = [],
    isInitialLoading,
    refetch: refetchUserAssets,
  } = useUserAssets(
    {
      address: currentAddress,
      currency,
    },
    {
      select: (data) =>
        selectorFilterByUserChains({
          data,
          selector: hideSmallBalances
            ? selectUserAssetsFilteringSmallBalancesList
            : selectUserAssetsList,
        }),
    },
  );

  const {
    data: customNetworkAssets = [],
    refetch: refetchCustomNetworkAssets,
  } = useCustomNetworkAssets(
    {
      address: currentAddress,
      currency,
    },
    {
      select: (data) =>
        selectorFilterByUserChains({
          data,
          selector: hideSmallBalances
            ? selectUserAssetsFilteringSmallBalancesList
            : selectUserAssetsList,
        }),
    },
  );

  const allAssets = useMemo(
    () =>
      uniqBy(
        [...assets, ...customNetworkAssets].sort(
          (a: ParsedUserAsset, b: ParsedUserAsset) =>
            parseFloat(b?.native?.balance?.amount) -
            parseFloat(a?.native?.balance?.amount),
        ),
        'uniqueId',
      ),
    [assets, customNetworkAssets],
  );

  const containerRef = useContainerRef();
  const assetsRowVirtualizer = useVirtualizer({
    count: allAssets?.length || 0,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 52,
    overscan: 20,
  });

  useKeyboardShortcut({
    handler: async (e: KeyboardEvent) => {
      if (e.key === shortcuts.tokens.REFRESH_TOKENS.key) {
        trackShortcut({
          key: shortcuts.tokens.REFRESH_TOKENS.display,
          type: 'tokens.refresh',
        });
        setManuallyRefetchingTokens(true);
        await Promise.all([refetchUserAssets(), refetchCustomNetworkAssets()]);
        setManuallyRefetchingTokens(false);
      }
    },
    condition: () => !manuallyRefetchingTokens,
  });

  useTokensShortcuts();

  if (isInitialLoading || manuallyRefetchingTokens) {
    return <TokensSkeleton />;
  }

  if (!allAssets?.length) {
    return <TokensEmptyState />;
  }

  return (
    <Box
      width="full"
      style={{
        // Prevent bottommost coin icon shadow from clipping
        overflow: 'visible',
      }}
      paddingBottom="8px"
      paddingTop="2px"
      marginTop="-14px"
    >
      <QuickPromo
        text={i18n.t('command_k.quick_promo.text', { modifierSymbol })}
        textBold={i18n.t('command_k.quick_promo.text_bold')}
        style={{
          paddingBottom: 12,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
        }}
        symbol="sparkle"
        symbolColor="accent"
        promoType="command_k"
      />
      <Box
        width="full"
        style={{
          height: assetsRowVirtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        <Box style={{ overflow: 'auto' }}>
          {assetsRowVirtualizer.getVirtualItems().map((virtualItem) => {
            const { key, size, start, index } = virtualItem;
            const token = allAssets[index];
            return (
              <Box
                key={key}
                as={motion.div}
                whileTap={{ scale: 0.98 }}
                layoutId={`list-${index}`}
                layoutScroll
                layout="position"
                position="absolute"
                width="full"
                style={{ height: size, y: start }}
              >
                <TokenRow token={token} testId={`coin-row-item-${index}`} />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

type AssetRowProps = {
  asset: ParsedUserAsset;
  testId?: string;
};

export const AssetRow = memo(function AssetRow({
  asset,
  testId,
}: AssetRowProps) {
  const name = asset?.name || asset?.symbol || truncateAddress(asset.address);
  const uniqueId = asset?.uniqueId;
  const { hideAssetBalances } = useHideAssetBalancesStore();
  const { currentCurrency } = useCurrentCurrencyStore();

  const priceChange = asset?.native?.price?.change;
  const priceChangeDisplay = priceChange?.length ? priceChange : '-';
  const priceChangeColor =
    priceChangeDisplay[0] !== '-' ? 'green' : 'labelTertiary';

  const balanceDisplay = useMemo(
    () =>
      hideAssetBalances ? (
        <Inline space="4px">
          <Asterisks color="labelTertiary" size={8} />
          <TextOverflow color="labelTertiary" size="12pt" weight="semibold">
            {asset?.symbol}
          </TextOverflow>
        </Inline>
      ) : (
        <TextOverflow color="labelTertiary" size="12pt" weight="semibold">
          {asset?.balance?.display}
        </TextOverflow>
      ),
    [asset?.balance?.display, asset?.symbol, hideAssetBalances],
  );

  const nativeBalanceDisplay = useMemo(
    () =>
      hideAssetBalances ? (
        <Inline alignHorizontal="right">
          <TextOverflow size="14pt" weight="semibold" align="right">
            {supportedCurrencies[currentCurrency].symbol}
          </TextOverflow>
          <Asterisks color="label" size={10} />
        </Inline>
      ) : isCustomChain(asset.chainId) &&
        asset?.native?.balance?.amount === '0' ? null : (
        <Text size="14pt" weight="semibold" align="right">
          {asset?.native?.balance?.display}
        </Text>
      ),
    [
      hideAssetBalances,
      currentCurrency,
      asset.chainId,
      asset?.native?.balance?.amount,
      asset?.native?.balance?.display,
    ],
  );

  const topRow = useMemo(
    () => (
      <Columns>
        <Column>
          <Box paddingVertical="4px">
            <TextOverflow size="14pt" weight="semibold">
              {name}
            </TextOverflow>
          </Box>
        </Column>
        <Column width="content">
          <Box paddingVertical="4px">{nativeBalanceDisplay}</Box>
        </Column>
      </Columns>
    ),
    [name, nativeBalanceDisplay],
  );

  const bottomRow = useMemo(
    () => (
      <Columns>
        <Column>
          <Box paddingVertical="4px" testId={`asset-name-${uniqueId}`}>
            {balanceDisplay}
          </Box>
        </Column>
        <Column width="content">
          <Box paddingVertical="4px">
            <Text
              color={priceChangeColor}
              size="12pt"
              weight="semibold"
              align="right"
            >
              {priceChangeDisplay}
            </Text>
          </Box>
        </Column>
      </Columns>
    ),
    [balanceDisplay, priceChangeColor, priceChangeDisplay, uniqueId],
  );

  return (
    <CoinRow
      testId={testId}
      asset={asset}
      topRow={topRow}
      bottomRow={bottomRow}
    />
  );
});

function TokensEmptyState() {
  const { currentTheme } = useCurrentThemeStore();

  const [tokensAdded, setTokensAdded] = useState(false);

  return (
    <Inset horizontal="20px">
      <Stack space="12px">
        <Box
          borderRadius="16px"
          padding="16px"
          style={{
            boxShadow: `0 0 0 1px ${
              currentTheme === 'dark'
                ? 'rgba(245, 248, 255, 0.025)'
                : 'rgba(9, 17, 31, 0.03)'
            } inset`,
          }}
        >
          <Stack space="12px">
            <Inline alignVertical="center" space="7px">
              <Box
                alignItems="center"
                display="flex"
                justifyContent="center"
                paddingLeft="2px"
                style={{ height: 12, width: 18 }}
              >
                <Symbol
                  color="accent"
                  size={14.5}
                  symbol="arrow.turn.right.down"
                  weight="bold"
                />
              </Box>
              <Text as="p" size="14pt" color="label" weight="bold">
                {i18n.t('tokens_tab.send_from_wallet')}
              </Text>
            </Inline>
            <Box alignItems="center" display="flex" style={{ height: 10 }}>
              <Text as="p" size="11pt" color="labelTertiary" weight="bold">
                {i18n.t('tokens_tab.send_description_1')}
                <Box
                  background="fillTertiary"
                  as="span"
                  borderWidth="1px"
                  borderColor="separatorTertiary"
                  boxShadow="1px"
                  style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '14px',
                    borderRadius: '4.5px',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                    lineHeight: '12px',
                    marginLeft: '4px',
                    marginRight: '4px',
                  }}
                >
                  {shortcuts.home.COPY_ADDRESS.display}
                </Box>
                {i18n.t('tokens_tab.send_description_2')}
                <Box
                  background="fillTertiary"
                  as="span"
                  borderWidth="1px"
                  borderColor="separatorTertiary"
                  boxShadow="1px"
                  style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '14px',
                    borderRadius: '4.5px',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                    lineHeight: '12px',
                    marginLeft: '4px',
                    marginRight: '4px',
                  }}
                >
                  {shortcuts.home.GO_TO_QR.display}
                </Box>
                {i18n.t('tokens_tab.send_description_3')}
              </Text>
            </Box>
          </Stack>
        </Box>
        {!tokensAdded && (
          <AddBitfinityTokens onAddTokens={() => setTokensAdded(true)} />
        )}
      </Stack>
    </Inset>
  );
}
