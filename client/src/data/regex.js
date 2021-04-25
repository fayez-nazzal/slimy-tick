const repeatTimeQuanityRegex = /every (\d* ?minutes?|\d* ?hours?|\d* ?days?|\d* ?months?|\d* ?years?|\d* ?mornings?|\d* ?afternoons?|\d* ?evenings??|\d* ?nights?)/i
const repeatWeekDaysRegex = /every (((sun(day)?)|(\bmon\b)|(monday)|(tue(sday)?)|(wed(ensday)?)|(thu(rsday)?)|(fri(day)?)|(sat(urday)?))( ?and ?)?)+/i
const repeatTimeRegex = /every (((([1-9]|1[1-2]|0[1-9]|10):[0-5][0-9] ?(AM|PM))|(([0-2][1-3]|1[0-9]|0[0-9]|[0-9]):[0-5][0-9]))( ?and ?)?)+/i
const repeatDayTimeRegex = /every ((morning|evening|night|afternoon)( ?and ?)?)+/

export const REMIND_REGEX = /\bremind\b( ?before ?(\d+? ?minutes|\d+ ?hours|\d+ ?days|\d+ ?weeks))?/i

// The date regex are simple ones, they relay on matchers to be validated (to check if a date is valid)
const dueDateFormat1Regex = /(on|before|after|due)? ?((((jan(uary)?)|(feb(ruary)?)|(mar(ch)?)|(apr(il)?)|(may)|(jun(e)?)|(jul(y)?)|(aug(ust)?)|(sep(tember)?)|(oct(ober)?)|(nov(ember)?)|(dec(ember)?)),? ?((\d{1}(st|nd|rd|th)?|\d{2}(th)?)) ?,? ?(\d{4}|\d{2})))/i
const dueDateFormat2Regex = /(on|before|after|due)? ?(((\d{1}(st|nd|rd|th)?|\d{2}(th)?)) ?,? ?(((jan(uary)?)|(feb(ruary)?)|(mar(ch)?)|(apr(il)?)|(may)|(jun(e)?)|(jul(y)?)|(aug(ust)?)|(sep(tember)?)|(oct(ober)?)|(nov(ember)?)|(dec(ember)?)) ?,? ?(\d{4}|\d{2})))/i
const dueDateFormat3Regex = /(on|before|after|due)? ?((\d{4}|\d{1,2})([\/\\\-])(\d{1,2})(([\/\\\-])(\d{4}|\d{1,2}))?)/i
const dueDateAfterRegex = /after ?((a|1|one)? ?(day|week|month|year)|\d+ ?(days|weeks|months|years))/i
const dueDateTomorrowRegex = /(due)? ?tomorrow/i
const dueDateWeekdaysRegex = /(on|before|after|due)? ?((sun(day)?)|(\bmon\b)|(monday)|(tue(sday)?)|(wed(ensday)?)|(thu(rsday)?)|(fri(day)?)|(sat(urday)?))/i

const dueTimeRegex = /(on|at|in|before|due)? ?((([1-9]|1[1-2]|0[1-9]|10):[0-5][0-9] ?(AM|PM))|(([0-2][1-3]|1[1-9]|0[0-9]|[0-9]):[0-5][0-9]))/i
const dueDayTimeRegex = /(on|before|due)? ?(morning|afternoon|evening|night)/
const dueTimeAfterRegex = /after ?((an?|1|one)? ?(minute|hour)|\d+ ?(minutes|hours))/i

export const REPEAT_REGEXES = [
  repeatTimeQuanityRegex,
  repeatTimeRegex,
  repeatDayTimeRegex,
  repeatWeekDaysRegex,
]

export const DUE_DATE_REGEXES = [
  dueDateFormat1Regex,
  dueDateFormat2Regex,
  dueDateFormat3Regex,
  dueDateAfterRegex,
  dueDateTomorrowRegex,
  dueDateWeekdaysRegex,
]

export const DUE_TIME_REGEXES = [
  dueTimeRegex,
  dueDayTimeRegex,
  dueTimeAfterRegex,
]
