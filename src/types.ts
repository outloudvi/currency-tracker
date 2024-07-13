export type CurrencyResult<Curr extends string> = {
  currency: Curr
  rate: number
  date: Date
}

export type CurrencyGetterList<Currs extends string> = {
  [Curr in Currs]: () => Promise<CurrencyResult<Curr>>
}
