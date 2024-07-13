import dayjs from '../tools/day.ts'
import { CurrencyGetterList, CurrencyResult } from '../types.ts'

const getCurrency = async <T extends string>(
  currencyMark: T,
  currencyName: string
): Promise<CurrencyResult<T>> => {
  const response: {
    ccyNbr: string
    ccyNbrEng: string
    rtcOfr: string
    ratTim: string
    ratDat: string
  }[] = await fetch('https://fx.cmbchina.com/api/v1/fx/rate', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; rv:130.0) Gecko/20100101 Firefox/130.0',
    },
    referrer: 'https://fx.cmbchina.com/hq',
    method: 'GET',
  })
    .then((x) => x.json())
    .then((x) => x.body)

  const currencyLine = response.find((x) => x.ccyNbr === currencyName)
  if (!currencyLine) {
    throw new Error(`No ${currencyName} found from CMB`)
  }

  return {
    currency: currencyMark,
    rate: Number(currencyLine.rtcOfr) / 100,
    date: dayjs(
      `${currencyLine.ratDat} ${currencyLine.ratTim}`,
      'YYYY年MM月DD日 H:m:s'
    )
      .tz('Asia/Shanghai')
      .toDate(),
  }
}

const methods: CurrencyGetterList<'JPY'> = {
  JPY: () => getCurrency('JPY', '日元'),
}

export default methods
