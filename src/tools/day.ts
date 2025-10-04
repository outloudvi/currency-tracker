import dayjs from 'dayjs/'
import dayCustomParseFormat from 'dayjs/plugin/customParseFormat.js'
import dayUtc from 'dayjs/plugin/utc.js'
import dayTz from 'dayjs/plugin/timezone.js'

dayjs.extend(dayCustomParseFormat)
dayjs.extend(dayUtc)
dayjs.extend(dayTz)

export default dayjs
