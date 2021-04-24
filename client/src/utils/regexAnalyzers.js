import { createDateFromStr } from "./datetime"
import moment from "moment"
export const findRepeatOptions = repeatStr => {
  const numMinutes = firstValue(repeatStr.match(/\b\d+?(?= ?minutes)/i))
  const numHours =
    firstValue(repeatStr.match(/\d+(?= ?hours)/i)) ||
    (repeatStr.match(/hour(?!s)/i) && 1)
  const numMonths =
    firstValue(repeatStr.match(/\d+(?= ?months)/i)) ||
    (repeatStr.match(/month(?!s)/i) && 1)
  const numYears =
    firstValue(repeatStr.match(/\d+(?= ?years)/i)) ||
    (repeatStr.match(/year(?!s)/i) && 1)
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
  const daytimes =
    repeatStr.includes("and") &&
    repeatStr.match(/\b((morning)|(afternoon)|(evening)|(night))\b/gi)
  const weekdays = fullWeekdaysName(repeatStr).match(
    /((sunday)|(monday)|(tuesday)|(wedensday)|(thursday)|(friday)|(saturday))/gi
  )
  const numDays =
    !weekdays &&
    (firstValue(repeatStr.match(/\d+(?= ?days)/i)) ||
      (repeatStr.match(/day(?!s)/i) && 1))

  const repeatType = numMinutes
    ? "minutes"
    : numHours
    ? "hours"
    : numDays
    ? "days"
    : numMonths
    ? "months"
    : numYears
    ? "years"
    : times
    ? "times"
    : daytimes
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
        numMonths ||
        numYears ||
        numMornings ||
        numEvenings ||
        numNights ||
        null

      return [repeatType, parseInt(repeatStep)]
  }
}

const firstValue = arr => {
  return arr ? arr[0] : null
}

const fullWeekdaysName = str => {
  return str
    .replace(/sun/, "sunday")
    .replace(/mon/, "monday")
    .replace(/tue/, "tuesday")
    .replace(/wed/, "wedensday")
    .replace(/thu/, "thursday")
    .replace(/fri/, "friday")
}

export const findDueOptions = str => {
  const date = createDateFromStr(str)
  if (date.isValid()) {
    return date.isAfter() ? date : null
  } else {
    const now = moment()
    const isTomorrow = str.match(/tomorrow/)
    const nDays = str.match(/\d+ ?(?=days)/i)
    const nWeeks = str.match(/\d+ ?(?=weeks)/i)
    const nMonths = str.match(/\d+ ?(?=months)/i)
    const nYears = str.match(/\d+ ?(?=years)/i)

    return isTomorrow
      ? now.add(1, "day")
      : nDays
      ? now.add(parseInt(nDays[0]), "days")
      : nWeeks
      ? now.add(parseInt(nWeeks[0]), "weeks")
      : nMonths
      ? now.add(parseInt(nMonths[0]), "months")
      : nYears
      ? now.add(parseInt(nYears[0]), "years")
      : null
  }
}
