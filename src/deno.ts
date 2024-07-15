import cmb from './bank/cmb.ts'
import boc from './bank/boc.ts'
import dayjs from './tools/day.ts'
import { sendMessage } from './tools/telegram.ts'
import invariant from './tools/invariant.ts'

const CurrencyList = {
  招商银行: cmb.JPY(),
  中国银行: boc.JPY(),
}

export async function updateCurrencyList() {
  const botToken = Deno.env.get('BOT_TOKEN')
  const chatId = Deno.env.get('CHAT_ID')
  invariant(botToken, 'No bot token')
  invariant(chatId, 'No chatId')

  const bankNameList = Object.keys(CurrencyList)
  const promiseList = Object.values(CurrencyList)
  const promiseResults = await Promise.allSettled(promiseList)
  const resultLines: string[] = []
  for (let i = 0; i < bankNameList.length; i++) {
    const bankName = bankNameList[i]
    const result = promiseResults[i]
    if (result.status === 'rejected') {
      resultLines.push(`${bankName}: ${result.reason}\n`)
    } else {
      const { currency, date, rate } = result.value
      resultLines.push(
        `${bankName}: ${(rate * 100).toFixed(4)} (${dayjs(date).format(
          'HH:mm:ss'
        )})`
      )
    }
  }

  const textMessage = resultLines.join('\n')
  await sendMessage(botToken, chatId, textMessage)
}

Deno.cron('Update currency', '1 * * * *', updateCurrencyList)
