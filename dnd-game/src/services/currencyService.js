/**
 * Multi-Currency Wallet Service
 * Tracks Gold Coins, Soul Shards, and Ancient Relic Tokens.
 */

export const CURRENCIES = {
  GOLD: 'gold',
  SOUL_SHARDS: 'soulShards',
  ANCIENT_COINS: 'ancientCoins',
};

const _wallet = {
  gold: 145,
  soulShards: 3,
  ancientCoins: 1,
};

export function getWallet() {
  return { ..._wallet };
}

export function addCurrency(type, amount) {
  if (_wallet[type] !== undefined) {
    _wallet[type] += amount;
  }
  return getWallet();
}

export function spendCurrency(type, amount) {
  if (_wallet[type] !== undefined && _wallet[type] >= amount) {
    _wallet[type] -= amount;
    return true;
  }
  return false;
}


/**
 * Format currency delta string for floating feedback
 */
export function formatCurrencyGain(type, amount) {
  const labels = {
    gold: 'Gold',
    soulShards: 'Soul Shards',
    ancientCoins: 'Ancient Relic Coin',
  };
  return `+${amount} ${labels[type] || type}`;
}
