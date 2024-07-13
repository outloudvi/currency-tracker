import dayjs from 'dayjs/'
import dayCustomParseFormat from 'dayjs/plugin/customParseFormat'
import dayUtc from 'dayjs/plugin/utc'
import dayTz from 'dayjs/plugin/timezone'

dayjs.extend(dayCustomParseFormat)
dayjs.extend(dayUtc)
dayjs.extend(dayTz)

export default dayjs
