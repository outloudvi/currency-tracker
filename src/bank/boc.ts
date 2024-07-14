import dayjs from '../tools/day.ts'
import { CurrencyGetterList, CurrencyResult } from '../types.ts'
import { JSDOM } from 'jsdom'

const getJpyCurrency = async (): Promise<CurrencyResult<'JPY'>> => {
  const resultHtml = await fetch(
    'https://srh.bankofchina.com/search/whpj/search_cn.jsp',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; rv:130.0) Gecko/20100101 Firefox/130.0',
      },
      referrer: 'https://www.boc.cn/',
      body: `erectDate=&nothing=&pjname=${encodeURIComponent('日元')}`,
      method: 'POST',
    }
  ).then((x) => x.text())

  console.log(resultHtml)
  const {
    window: { document },
  } = new JSDOM(resultHtml)
  const line = document.querySelector('div.BOC_main table tr:nth-child(2)')
  if (!line) {
    throw new Error('No line found for BOC')
  }

  return {
    currency: 'JPY',
    rate: Number((line.children[4] as HTMLTableCellElement).innerText),
    date: dayjs(
      (line.children[6] as HTMLTableCellElement).innerText,
      'YYYY.MM.DD HH:mm:ss'
    )
      .tz('Asia/Shanghai')
      .toDate(),
  }
}

const methods: CurrencyGetterList<'JPY'> = {
  JPY: getJpyCurrency,
}

export default methods
