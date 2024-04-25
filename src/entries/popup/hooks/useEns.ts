import { isAddress } from '@ethersproject/address';
import { Address, useEnsAddress, useEnsName } from 'wagmi';

import { useENSProfile } from '~/core/resources/metadata/ensProfile';
import { isENSAddressFormat } from '~/core/utils/ethereum';

export const useEns = ({
  addressOrName,
  enableProfile = false,
}: {
  addressOrName: Address | string;
  enableProfile?: boolean;
}) => {
  const { data: ensAddress } = useEnsAddress({
    name: addressOrName,
    enabled: isENSAddressFormat(addressOrName),
  });
  const { data: ensName } = useEnsName({
    address: addressOrName as Address,
    enabled: isAddress(addressOrName),
  });
  const { data: ensProfile } = useENSProfile(
    {
      addressOrName,
    },
    {
      enabled: enableProfile,
    },
  );

  const isValidBtcAddress = (address: string) => {
    const isBitcoinAddress = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);

    const isBitcoinBech32Address = /^(bc1|tb1)[0-9a-zA-HJ-NP-Z]{39,59}$/.test(
      address,
    );

    const isBitcoinBech32RegtestAddress =
      /^bcrt1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{39,59}$/.test(address);

    const result =
      isBitcoinAddress ||
      isBitcoinBech32Address ||
      isBitcoinBech32RegtestAddress;

    return result;
  };

  return {
    ensName: isENSAddressFormat(addressOrName)
      ? addressOrName
      : ensName || undefined,
    ensAddress:
      isAddress(addressOrName) || isValidBtcAddress(addressOrName)
        ? addressOrName
        : ensAddress || undefined,
    ensAvatar: ensProfile?.avatar,
    ensBio: ensProfile?.description,
    ensCover: ensProfile?.header,
    ensTwitter: ensProfile?.['com.twitter'],
    ensWebsite: ensProfile?.url,
    hasProperties: Boolean(
      ensProfile?.avatar ||
        ensProfile?.description ||
        ensProfile?.header ||
        ensProfile?.['com.twitter'] ||
        ensProfile?.url,
    ),
  };
};
