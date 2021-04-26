import {
  DUE_DATE_REGEXES,
  DUE_TIME_REGEXES,
  REMIND_REGEXES,
  REPEAT_REGEXES,
  PRIORITY_REGEX,
} from "../data/regex"
import moment from "moment"
import { createDateFromStr as createTimeFromStr } from "./datetime"
export const matchRepeat = str => {
  const match = matchRegexFromArray(str, REPEAT_REGEXES)

  const result = match ? match.replace(/( ?and ?)$/, "") : null

  return result
}

export const matchDueDate = str => {
  const match = matchRegexFromArray(str, DUE_DATE_REGEXES)

  const isDate = str.match(/\d+[\-\\\/]\d+/i) // To determine if the str is intended to be a date or not
  const date = createTimeFromStr(match)

  return !match || (!date && isDate) || (date && date.isBefore(moment()))
    ? null
    : match.trim()
}

export const matchDueTime = str => {
  const match = matchRegexFromArray(str, DUE_TIME_REGEXES)

  return !match ? null : match.trim()
}

export const matchRemind = str => {
  const match = matchRegexFromArray(str, REMIND_REGEXES)

  return !match ? null : match.trim()
}

export const matchPriorityAndReturnRange = str => {
  const match = matchRegexFromArray(str, [PRIORITY_REGEX])

  if (!match) return null

  let index = match.length - 1
  let count = 0

  while (match[index] === "!") {
    count++
    index--
  }

  index++

  return [index, index + count]
}

const matchRegexFromArray = (str, array) => {
  let matches = []

  for (let regex of array) {
    let arr = str.match(regex)
    matches = arr ? [...matches, arr[0]] : matches

    if (matches && matches.length) break
  }

  return matches && matches.length ? matches[0] : null
}
