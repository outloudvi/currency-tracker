/// <reference types="@cloudflare/workers-types" />

import cmb from './bank/cmb'
import boc from './bank/boc'
import bochk from './bank/bochk'
import dayjs from './tools/day'
import invariant from './tools/invariant'
import { DisplayItem } from './types'
import { sendMessage } from './tools/telegram'

const CurrencyList = {
  招商银行: () => cmb.JPY(),
  中国银行: () => boc.JPY(),

  // HKD
  '中銀香港 (HKD)': () => bochk.JPYHKD(),
}

export async function updateCurrencyList(env: any) {
  const botToken = env.BOT_TOKEN
  const chatId = env.CHAT_ID
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
          'HH:mm:ss',
        )})`,
        order: i,
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

export default {
  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext) {
    ctx.waitUntil(updateCurrencyList(env))
  },
}
