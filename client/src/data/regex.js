const repeatTimeQuanityRegex = /every (\d* ?minutes?|\d* ?hours?|\d* ?days?|\d* ?months?|\d* ?years?|\d* ?mornings?|\d* ?afternoons?|\d* ?evenings??|\d* ?nights?)/i
const repeatWeekDaysRegex = /every (((sun(day)?)|(\bmon\b)|(monday)|(tue(sday)?)|(wed(ensday)?)|(thu(rsday)?)|(fri(day)?)|(sat(urday)?))( ?and ?)?)+/i
const repeatTimeRegex = /every (((([1-9]|1[1-2]|0[1-9]):[0-5][0-9] ?(AM|PM))|(([0-2][1-3]|1[1-9]|0[1-5]|[0-9]):[0-5][0-9]))( ?and ?)?)+/i
const repeatDayTimeRegex = /every ((morning|evening|night|afternoon)( ?and ?)?)+/

export const REMIND_REGEX = /\bremind\b( ?before ?([1-6][0-9]? minutes|([1-2][0-4]|1[1-9]|[2-9]) ?hours|\d+ ?days))?/i

export const DUE_DATE_REGEX = /(on|at|in|before|due)? ?((((jan)|(january)|(feb)|(february)|(mar)|(march)|(apr)|(april)|(may)|(jun)|(june)|(jul)|(july)|(aug)|(august)|(sep)|(september)|(oct)|(october)|(nov)|(november)|(dec)|(december)),? ?\d{1,2}(st|th)?,? ?(\d{4}|\d{2}))|(\d{1,2}(th|st)?,? ?((jan)|(january)|(feb)|(february)|(mar)|(march)|(apr)|(april)|(may)|(jun)|(june)|(jul)|(july)|(aug)|(august)|(sep)|(september)|(oct)|(october)|(nov)|(november)|(dec)|(december)),? ?(\d{4}|\d{2}))|((0?[1-9]|[12][0-9]|3[01])[\\\/\-](0?[1-9]|1[012])[\\\/\-](\d{4}|\d{2}))|(2\d{3}[-\/\\](0[1-9]|1[0-2])[-\\\/](0[1-9]|[12]\d|3[01]))|((tomorrow)|(after ?\d+(th)? ?((days)|(hours)|(minutes)|(months)|(years)))))/i

export const DUE_TIME_REGEX = /(on|at|in|before|due)? ?((([1-9]|1[1-2]|0[1-9]):[0-5][0-9] ?(AM|PM))|(([0-2][1-3]|1[1-5]|0[1-5]|[0-9]):[0-5][0-9]))/i

export const REPEAT_REGEXES = [
  repeatTimeQuanityRegex,
  repeatTimeRegex,
  repeatDayTimeRegex,
  repeatWeekDaysRegex,
]