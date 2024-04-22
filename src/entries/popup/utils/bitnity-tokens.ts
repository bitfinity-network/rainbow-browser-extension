import { AddressZero } from '@ethersproject/constants';
import { Address } from 'wagmi';

export const bitfinityTestnetInfo = {
  name: 'Bitfinity Testnet',
  symbol: 'BFT',
  decimals: 18,
  rpcUrl: 'https://testnet.bitfinity.network',
  explorerUrl: 'explorer.bitfinity.network',
  testnet: true,
};

export const bftTestnetToken = {
  name: 'BFT Testnet',
  symbol: 'BFT',
  decimals: 18,
  address: AddressZero as Address,
};

export const cashiumTestnetToken = {
  address: '0x53611Ab037767647498EBd555C4CC339db4Ee617' as Address,
  name: 'Cashium',
  symbol: 'CSM',
  decimals: 18,
};

export const demoTestnetToken = {
  address: '0x6b52a89f73b79e24BBFc0E4B890D0DAee63567d5' as Address,
  name: 'DemoToken',
  symbol: 'DMT',
  decimals: 18,
};

export const DISCORD_URL = 'https://discord.com/invite/d9QRyEAYxJ';
export const TWITTER_URL = 'https://twitter.com/bitfinitynet';
export const DOC_URL = 'https://infinityswap-docs-wallet.web.app/docs/wallet';
export const BLOG_URL = 'https://www.blog.infinityswap.one/';
export const ZENDESK_URL = 'https://infinityswapsupport.zendesk.com/hc/en-us';
export const TERMS_URL = '#';
