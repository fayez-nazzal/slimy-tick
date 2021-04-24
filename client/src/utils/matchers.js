import { DUE_REGEXES, REPEAT_REGEXES } from "../data/regex"
import moment from "moment"
import { createDateFromStr } from "./datetime"
export const matchRepeat = str => {
  let matches = []

  for (let regex of REPEAT_REGEXES) {
    let arr = str.match(regex)
    matches = arr ? [...matches, ...arr] : matches

    if (matches && matches.length) break
  }

  const result =
    matches && matches.length ? matches[0].replace(/( ?and ?)$/, "") : null

  return result
}

export const matchDue = str => {
  let matches = []

  for (let regex of DUE_REGEXES) {
    let arr = str.match(regex)
    matches = arr ? [...matches, ...arr] : matches

    if (matches && matches.length) break
  }

  const match = matches && matches.length ? matches[0] : null
  const isDate = str.match(/\d+[\-\\\/]\d+/i) // To determine if the str is intended to be a date or not
  const date = createDateFromStr(match)

  return !match || (!date && isDate) || (date && date.isBefore(moment()))
    ? null
    : match.trim()
}
