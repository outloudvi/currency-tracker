import dayjs from '../tools/day.ts'
import { CurrencyGetterList, CurrencyResult } from '../types.ts'
import { JSDOM } from 'jsdom'

const getCurrency = async <T extends string>(
  currencyMark: T,
  currencyName: string
): Promise<CurrencyResult<T>> => {
  const resultHtml = await fetch(
    'https://thingproxy.freeboard.io/fetch/https://www.boc.cn/sourcedb/whpj/',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; rv:130.0) Gecko/20100101 Firefox/130.0',
      },
      referrer: 'https://www.boc.cn/',
      method: 'GET',
    }
  ).then((x) => x.text())

  const {
    window: { document },
  } = new JSDOM(resultHtml)
  const line = [
    ...(document.querySelector('div.BOC_main > div > div > table > tbody')
      ?.children ?? []),
  ].find((x) => x.innerHTML.includes(currencyName))
  if (!line) {
    throw new Error(`No ${currencyName} found for BOC`)
  }

  return {
    currency: currencyMark,
    rate: Number((line.children[4] as HTMLTableCellElement).innerHTML) / 100,
    date: dayjs(
      `${(line.children[6] as HTMLTableCellElement).innerHTML} ${
        (line.children[7] as HTMLTableCellElement).innerHTML
      }`,
      'YYYY-MM-DD HH:mm:ss'
    )
      .tz('Asia/Shanghai')
      .toDate(),
  }
}

const methods: CurrencyGetterList<'JPY'> = {
  JPY: () => getCurrency('JPY', '日元'),
}

export default methods
