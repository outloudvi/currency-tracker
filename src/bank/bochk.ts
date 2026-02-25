import dayjs from '../tools/day.ts'
import { CurrencyGetterList, CurrencyResult } from '../types.ts'
import { JSDOM } from 'jsdom'

const getCurrency = async <T extends string>(
  currencyMark: T,
  currencyName: string,
): Promise<CurrencyResult<T>> => {
  const resultHtml = await fetch(
    'https://www.bochk.com/whk/rates/exchangeRatesHKD/exchangeRatesHKD-input.action?lang=hk',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; rv:130.0) Gecko/20100101 Firefox/130.0',
      },
      referrer: 'https://www.bochk.com/',
      method: 'GET',
    },
  ).then((x) => x.text())

  const {
    window: { document },
  } = new JSDOM(resultHtml)

  const line = [
    ...(document.querySelector('table.import-data > tbody')?.children ?? []),
  ].find((x) => x.innerHTML.includes(currencyName))
  if (!line) {
    throw new Error(`No ${currencyName} found for BOCHK`)
  }

  const ret: CurrencyResult<T> = {
    currency: currencyMark,
    rate: Number((line.children[2] as HTMLTableCellElement).innerHTML),
  }

  const timeTag = [...document.querySelectorAll('table b')].find((x) =>
    x.textContent.includes('資料更新於香港時間：'),
  )

  if (timeTag) {
    ret.date = dayjs(
      timeTag.textContent.split('：')[1].trim(),
      'YYYY/MM/DD HH:mm:ss',
    )
      .tz('Asia/Hong_Kong')
      .toDate()
  }

  return ret
}

const methods: CurrencyGetterList<'JPYHKD'> = {
  JPYHKD: () => getCurrency('JPYHKD', '日圓'),
}

export default methods
