import {
  DUE_DATE_REGEXES,
  DUE_TIME_REGEXES,
  REPEAT_REGEXES,
  PRIORITY_REGEX,
} from "../data/regex"
import moment from "moment"
import { findDueDateOptions } from "./regexAnalyzers"
export const matchRepeat = str => {
  const match = matchRegexFromArray(str, REPEAT_REGEXES)

  const result = match ? match.replace(/( ?and ?)$/, "") : null

  return result
}

// works for dates and strings like tomorrow, after 2 months..etc
export const matchDueDate = str => {
  const match = matchRegexFromArray(str, DUE_DATE_REGEXES)
  const date = match && findDueDateOptions(match)
  console.log("match", match)
  console.log("date", date)
  return !match || !date || (date && date.isBefore(moment()))
    ? null
    : match.trim()
}

export const matchDueTime = str => {
  const match = matchRegexFromArray(str, DUE_TIME_REGEXES)

  return match && match.trim()
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
