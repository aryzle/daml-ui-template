export function formatCurrency(amount: string | number, currency = 'USD', locale = 'en-US') {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });

  const value = typeof amount === 'string' ? Number(amount) : amount;

  return formatter.format(value);
}

export function cache(options?: { permanent: boolean }) {
  const store = options?.permanent ? localStorage : sessionStorage;

  return {
    save: (key: string, value: string) => store.setItem(key, value),
    remove: (key: string) => store.removeItem(key),
    load: (key: string) => store.getItem(key),
  };
}
