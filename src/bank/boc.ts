import dayjs from '../tools/day'
import { CurrencyGetterList, CurrencyResult } from '../types'
import { parseHTML } from 'linkedom/worker'

const getCurrency = async <T extends string>(
  currencyMark: T,
  currencyName: string,
): Promise<CurrencyResult<T>> => {
  const resultHtml = await fetch('https://www.boc.cn/sourcedb/whpj/', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; rv:130.0) Gecko/20100101 Firefox/130.0',
      Referrer: 'https://www.boc.cn/',
    },
    method: 'GET',
  }).then((x) => x.text())

  const { document } = parseHTML(resultHtml)
  const line = [
    ...(document.querySelector('#priceTable')?.children ?? []),
  ].find((x) => x.innerHTML.includes(currencyName))
  if (!line) {
    throw new Error(`No ${currencyName} found for BOC`)
  }

  return {
    currency: currencyMark,
    rate: Number((line.children[4] as any).innerHTML) / 100,
    date: dayjs(
      `${(line.children[6] as any).innerHTML} ${
        (line.children[7] as any).innerHTML
      }`,
      'YYYY-MM-DD HH:mm:ss',
    )
      .tz('Asia/Shanghai')
      .toDate(),
  }
}

const methods: CurrencyGetterList<'JPY'> = {
  JPY: () => getCurrency('JPY', '日元'),
}

export default methods
