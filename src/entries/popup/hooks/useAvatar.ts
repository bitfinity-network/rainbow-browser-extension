import { useQuery } from '@tanstack/react-query';

import { useCurrentThemeStore } from '~/core/state/currentSettings/currentTheme';
import {
  WalletAvatar,
  useWalletAvatarStore,
  walletAvatarStore,
} from '~/core/state/walletAvatar';
import { bitfinityColors } from '~/design-system/styles/designTokens';

import BitfinityLogo from '../../../../static/images/bitfinity_logo.png';

const fetchDefaultAvatar = ({
  addressOrName,
  currentTheme,
}: {
  addressOrName: string;
  currentTheme: 'dark' | 'light';
}): WalletAvatar => {
  const { setWalletAvatar } = walletAvatarStore.getState();

  const defaultAvatar = {
    color:
      currentTheme === 'dark'
        ? bitfinityColors.dark.primary
        : bitfinityColors.light.primary,
    imageUrl: BitfinityLogo,
  };
  setWalletAvatar({ addressOrName, walletAvatar: defaultAvatar });
  return defaultAvatar;
};

export function useAvatar({
  addressOrName,
}: {
  addressOrName?: string;
  avatarUrl?: string | null;
}) {
  const { walletAvatar } = useWalletAvatarStore();
  const { currentTheme } = useCurrentThemeStore();

  return useQuery(
    ['walletAvatar', addressOrName, currentTheme],
    async () =>
      addressOrName
        ? fetchDefaultAvatar({ addressOrName, currentTheme })
        : undefined,
    {
      enabled: !!addressOrName,
      initialData: () => {
        return addressOrName && walletAvatar
          ? walletAvatar[addressOrName]
          : undefined;
      },
    },
  );
}
