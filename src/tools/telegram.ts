async function tg(
  botToken: string,
  path: string,
  formData?: FormData
): Promise<any> {
  const requestUrl = `https://api.telegram.org/bot${botToken}/${path}`
  const fetchBase =
    formData === undefined
      ? fetch(requestUrl)
      : fetch(requestUrl, {
          method: 'POST',
          body: formData,
        })
  return fetchBase
    .then((x) => x.json())
    .then((x) => {
      console.debug('TG request:', path)
      console.debug('TG response:', x)
      return x
    })
}

async function tgJson(
  botToken: string,
  path: string,
  data?: string
): Promise<any> {
  const requestUrl = `https://api.telegram.org/bot${botToken}/${path}`
  const fetchBase =
    data === undefined
      ? fetch(requestUrl)
      : fetch(requestUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: data,
        })
  return fetchBase
    .then((x) => x.json())
    .then((x) => {
      console.debug('TG request:', path)
      console.debug('TG response:', x)
      return x
    })
}

export function setupWebhook(
  botToken: string,
  url: string,
  secretToken: string
) {
  return tg(
    botToken,
    `setWebhook?url=${encodeURIComponent(
      url
    )}&secret_token=${encodeURIComponent(secretToken)}`
  )
}

export async function changeAvatar(
  botToken: string,
  groupId: string,
  avatarUrl: string
) {
  const photo = await fetch(avatarUrl).then((x) => x.blob())
  const formData = new FormData()
  formData.set('chat_id', groupId)
  formData.set('photo', photo)
  return tg(botToken, 'setChatPhoto', formData)
}

export async function deleteMessage(
  botToken: string,
  chatId: string,
  messageId: string
) {
  return tg(botToken, `deleteMessage?chat_id=${chatId}&message_id=${messageId}`)
}

export async function sendMessage(
  botToken: string,
  chatId: string,
  message: string,
  replyToMessageId?: number
) {
  const body = {
    text: message,
    parse_mode: 'HTML',
    ...(replyToMessageId
      ? {
          reply_parameters: {
            message_id: replyToMessageId,
          },
        }
      : {}),
  }

  return tgJson(botToken, `sendMessage?chat_id=${chatId}`, JSON.stringify(body))
}
