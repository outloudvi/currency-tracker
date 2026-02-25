import dayjs from '../tools/day.ts'
import { CurrencyGetterList, CurrencyResult } from '../types.ts'

const getCurrency = async <T extends string>(
  currencyMark: T,
  currencyName: string
): Promise<CurrencyResult<T>> => {
  const response: {
    bid: string
    ask: string
    timestamp: string
  }[] = await fetch('https://www.bochk.com/api/cms/rates', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; rv:130.0) Gecko/20100101 Firefox/130.0',
    },
    referrer: 'https://www.bochk.com/',
    method: 'GET',
  })
    .then((x) => x.json())
    .then((x) => x.rates)

  const currencyLine = response.find((x) => x.currencyCode === currencyName)
  if (!currencyLine) {
    throw new Error(`No ${currencyName} found from BOCHK`)
  }

  const rate = (Number(currencyLine.bid) + Number(currencyLine.ask)) / 2

  return {
    currency: currencyMark,
    rate: rate,
    date: dayjs(currencyLine.timestamp).tz('Asia/Hong_Kong').toDate(),
  }
}

const methods: CurrencyGetterList<'HKD'> = {
  HKD: () => getCurrency('HKD', 'JPY'),
}

export default methods