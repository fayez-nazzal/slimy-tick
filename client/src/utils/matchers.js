import {
  DUE_DATE_REGEXES,
  DUE_TIME_REGEXES,
  REPEAT_REGEXES,
} from "../data/regex"
import moment from "moment"
import { createDateFromStr } from "./datetime"
export const matchRepeat = str => {
  const match = matchRegexFromArray(str, REPEAT_REGEXES)

  const result = match ? match.replace(/( ?and ?)$/, "") : null

  return result
}

export const matchDueDate = str => {
  const match = matchRegexFromArray(str, DUE_DATE_REGEXES)

  const isDate = str.match(/\d+[\-\\\/]\d+/i) // To determine if the str is intended to be a date or not
  const date = createDateFromStr(match)

  return !match || (!date && isDate) || (date && date.isBefore(moment()))
    ? null
    : match.trim()
}

export const matchDueTime = str => {
  const match = matchRegexFromArray(str, DUE_TIME_REGEXES)

  const isDate = str.match(/\d+[\-\\\/]\d+/i) // To determine if the str is intended to be a date or not
  const date = createDateFromStr(match)

  return !match || (!date && isDate) || (date && date.isBefore(moment()))
    ? null
    : match.trim()
}

const matchRegexFromArray = (str, array) => {
  let matches = []

  for (let regex of array) {
    let arr = str.match(regex)
    matches = arr ? [...matches, ...arr] : matches

    if (matches && matches.length) break
  }

  return matches && matches.length ? matches[0] : null
}
