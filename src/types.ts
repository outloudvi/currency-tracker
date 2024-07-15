export type CurrencyResult<Curr extends string> = {
  /**
   * Currency mark.
   *
   * @example JPY
   */
  currency: Curr

  /**
   * Conversion rate on 1 CNY.
   */
  rate: number

  /**
   * Currency update date.
   */
  date: Date
}

export type CurrencyGetterList<Currs extends string> = {
  [Curr in Currs]: () => Promise<CurrencyResult<Curr>>
}

export type DisplayItem = {
  order: number
  text: string
}
