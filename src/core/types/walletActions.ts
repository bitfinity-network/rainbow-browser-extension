export enum walletActions {
  action = 'wallet_action',
  status = 'status',
  lock = 'lock',
  update_password = 'update_password',
  wipe = 'wipe',
  unlock = 'unlock',
  verify_password = 'verify_password',
  derive_accounts_from_secret = 'derive_accounts_from_secret',
  create = 'create',
  import = 'import',
  add = 'add',
  remove = 'remove',
  get_accounts = 'get_accounts',
  get_wallets = 'get_wallets',
  get_wallet = 'get_wallet',
  export_wallet = 'export_wallet',
  export_account = 'export_account',
  send_transaction = 'send_transaction',
  personal_sign = 'personal_sign',
  sign_typed_data = 'sign_typed_data',
  test_sandbox = 'test_sandbox',
  import_hw = 'import_hw',
  get_path = 'get_path',
}
export type WalletAction = keyof typeof walletActions;
