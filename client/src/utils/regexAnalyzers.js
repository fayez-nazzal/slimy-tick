import { createDateFromStr, createTimeFromStr } from "./datetime"
import moment, { now } from "moment"
export const findRepeatOptions = repeatStr => {
  const numMinutes = firstValue(repeatStr.match(/\b\d+?(?= ?minute)/i))
  const numHours =
    firstValue(repeatStr.match(/\d+(?= ?hour)/i)) ||
    ((repeatStr.match(/(?!<\d) ?hour(?!s)/i) ||
      repeatStr.match(/(one|1) ?hour/i)) &&
      1)
  const numWeeks =
    firstValue(repeatStr.match(/\d+(?= ?week)/i)) ||
    ((repeatStr.match(/(?!<\d) ?week(?!s)/i) ||
      repeatStr.match(/(one|1) ?week/i)) &&
      1)
  const numMonths =
    firstValue(repeatStr.match(/\d+(?= ?month)/i)) ||
    ((repeatStr.match(/(?!<\d) ?month(?!s)/i) ||
      repeatStr.match(/(one|1) ?month/i)) &&
      1)
  const numYears =
    firstValue(repeatStr.match(/\d+(?= ?year)/i)) ||
    ((repeatStr.match(/(?!<\d) ?year(?!s)/i) ||
      repeatStr.match(/(one|1) ?year/i)) &&
      1)
  const numMornings =
    firstValue(repeatStr.match(/(\d+)(?= ?morning)/i)) ||
    (repeatStr.match(/morning(?!s)/i) && 1)
  const numAfternoons =
    firstValue(repeatStr.match(/(\d+)(?= ?afternoon)/i)) ||
    (repeatStr.match(/afternoon(?!s)/i) && 1)
  const numEvenings =
    firstValue(repeatStr.match(/(\d+)(?= ?evening)/i)) ||
    (repeatStr.match(/evening(?!s)/i) && 1)
  const numNights =
    firstValue(repeatStr.match(/(\d+)(?= ?night)/i)) ||
    (repeatStr.match(/night(?!s)/i) && 1)
  const times = repeatStr.match(
    /\b((([1-9]|1[1-2]|0[1-9]):[0-5][0-9] ?(AM|PM))|(([0-2][1-3]|1[1-9]|0[1-9]|[0-9]):[0-5][0-9]))\b/gi
  )
  const daytimes = repeatStr.match(
    /\b((morning)|(afternoon)|(evening)|(night))\b/gi
  )
  const weekdays = normalizeWeekdayName(repeatStr).match(
    /((sun)|(mon)|(tue)|(wed)|(thu)|(fri)|(sat))(?!\w)/gi
  )
  const numDays =
    !weekdays &&
    (firstValue(repeatStr.match(/\d+(?= ?day)/i)) ||
      ((repeatStr.match(/(?<!\d) ?day(?!s)/i) ||
        repeatStr.match(/(1|one) ?day(s?)/i)) &&
        1))
  const repeatType = numMinutes
    ? "minutes"
    : numHours
    ? "hours"
    : numDays
    ? "days"
    : numWeeks
    ? "weeks"
    : numMonths
    ? "months"
    : numYears
    ? "years"
    : times
    ? "times"
    : daytimes && daytimes.length > 1
    ? "daytimes"
    : numMornings
    ? "mornings"
    : numAfternoons
    ? "afternoons"
    : numEvenings
    ? "evenings"
    : numNights
    ? "nights"
    : weekdays
    ? "weekdays"
    : null

  switch (repeatType) {
    case "weekdays":
      return [repeatType, weekdays]
    case "times":
      return [repeatType, times]
    case "daytimes":
      return [repeatType, daytimes]
    case null:
      return [null, null]
    default:
      const repeatStep =
        numMinutes ||
        numHours ||
        numDays ||
        numWeeks ||
        numMonths ||
        numYears ||
        numMornings ||
        numAfternoons ||
        numEvenings ||
        numNights ||
        null

      return [repeatType, parseInt(repeatStep)]
  }
}

export const findDueDateOptions = str => {
  const date = createDateFromStr(str)
  if (date.isValid()) {
    return date.isAfter() ? date : null
  } else {
    let date = moment()
    const isTomorrow = str.match(/((tomorrow)|(next day))/)
    const nextMorning = str.match(/next morning/)
    const nextAfternoon = str.match(/next afternoon/)
    const nextEvening = str.match(/next evening/)
    const nextNight = str.match(/next night/)
    let nDays = str.match(/\d+ ?(?=days)/i)
    nDays = str.match(/(a|1|one)? ?day(?!s)/i) ? [1] : nDays
    let nWeeks = str.match(/\d+ ?(?=weeks)/i)
    nWeeks = str.match(/(a|1|one)? ?week(?!s)/i) ? [1] : nWeeks
    let nMonths = str.match(/\d+ ?(?=months)/i)
    nMonths = str.match(/(a|1|one)? ?month(?!s)/i) ? [1] : nMonths
    let nYears = str.match(/\d+ ?(?=years)/i)
    nYears = str.match(/(a|1|one)? ?year(?!s)/i) ? [1] : nYears
    let weekDay = str.match(
      /\b((sun(day)?)|(mon(day)?)|(tue(sday)?)|(wed(nesday)?)|(thu(rsday)?)|(fri(day)?)|(sat(urday)?))\b/i
    )
    const nextWeekDay = firstValue(weekDay) && str.match(/next/)

    nextWeekDay && date.add(1, "days")

    while (
      firstValue(weekDay) &&
      date.format("ddd").toLowerCase() !==
        normalizeWeekdayName(firstValue(weekDay))
    ) {
      date.add(1, "days")
    }

    return weekDay
      ? date
      : nextMorning
      ? moment("08:00", "HH:mm").add(+(parseInt(now.format("HH")) < 8), "days")
      : nextAfternoon
      ? moment("13:00", "HH:mm").add(+(parseInt(now.format("HH")) < 13), "days")
      : nextEvening
      ? moment("18:00", "HH:mm").add(+(parseInt(now.format("HH")) < 18), "days")
      : nextNight
      ? moment("21:00", "HH:mm").add(+(parseInt(now.format("HH")) < 21), "days")
      : isTomorrow
      ? date.add(1, "days")
      : nDays
      ? date.add(parseInt(nDays[0]), "days")
      : nWeeks
      ? date.add(parseInt(nWeeks[0]), "weeks")
      : nMonths
      ? date.add(parseInt(nMonths[0]), "months")
      : nYears
      ? date.add(parseInt(nYears[0]), "years")
      : null
  }
}

export const findDueTimeOptions = str => {
  const time = createTimeFromStr(str)
  if (!str.includes("after") && time.isValid()) {
    return time
  } else {
    const morning = str.match(/morning/)
    const afternoon = str.match(/afternoon/i)
    const evening = str.match(/evening/i)
    const night = str.match(/night/i)
    let nMinutes = str.match(/\d+ ?(?=minutes?)/i)
    nMinutes = str.match(/(an?|1|one)? ?(minute(?!s))/i) ? [1] : nMinutes
    let nHours = str.match(/\d+ ?(?=hours?)/i)
    nHours = str.match(/(an?|1|one)? ?(hour(?!s))/i) ? [1] : nHours

    return morning
      ? createTimeFromStr("8:00AM")
      : afternoon
      ? createTimeFromStr("01:00PM")
      : evening
      ? createTimeFromStr("6:00PM")
      : night
      ? createTimeFromStr("9:00PM")
      : nHours
      ? moment().add(parseInt(nHours[0]), "hours")
      : nMinutes
      ? moment().add(parseInt(nMinutes[0]), "minutes")
      : null
  }
}

const firstValue = arr => {
  return arr ? arr[0] : null
}

const normalizeWeekdayName = str => {
  return str
    .replace(/sun(day)?/i, "sun")
    .replace(/mon(day)?/i, "mon")
    .replace(/tue(sday)?/i, "tue")
    .replace(/wed(nesday)?/i, "wed")
    .replace(/thu(rsday)?/i, "thu")
    .replace(/fri(day)?/i, "fri")
    .replace(/sat(urday)?/i, "sat")
}
