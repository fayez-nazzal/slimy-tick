import { REPEAT_REGEXES } from "../data/regex"

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
