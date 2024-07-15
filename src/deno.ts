import cmb from './bank/cmb.ts'
import boc from './bank/boc.ts'
import dayjs from './tools/day.ts'
import { sendMessage } from './tools/telegram.ts'
import invariant from './tools/invariant.ts'
import { DisplayItem } from './types.ts'

const CurrencyList = {
  招商银行: () => cmb.JPY(),
  中国银行: () => boc.JPY(),
}

export async function updateCurrencyList() {
  const botToken = Deno.env.get('BOT_TOKEN')
  const chatId = Deno.env.get('CHAT_ID')
  invariant(botToken, 'No bot token')
  invariant(chatId, 'No chatId')

  const bankNameList = Object.keys(CurrencyList)
  const promiseList = Object.values(CurrencyList).map((x) => x())
  const promiseResults = await Promise.allSettled(promiseList)
  const resultLines: DisplayItem[] = []
  for (let i = 0; i < bankNameList.length; i++) {
    const bankName = bankNameList[i]
    const result = promiseResults[i]
    if (result.status === 'rejected') {
      resultLines.push({
        text: `${bankName}: ${result.reason}`,
        order: Infinity,
      })
    } else {
      const { date, rate } = result.value
      resultLines.push({
        text: `${bankName}: ${(rate * 100).toFixed(4)} (${dayjs(date).format(
          'HH:mm:ss'
        )})`,
        order: rate,
      })
    }
  }

  const textMessage = resultLines
    .sort((a, b) => a.order - b.order)
    .map((x) => x.text)
    .join('\n')
  console.log(textMessage)
  await sendMessage(botToken, chatId, textMessage)
}

Deno.cron('Update currency', '1 * * * *', updateCurrencyList)
