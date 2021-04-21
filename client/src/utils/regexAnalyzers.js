export const findRepeatOptions = repeatStr => {
  const numMinutes = firstValue(repeatStr.match(/[1-6][0-9]?(?= ?minutes)/i))
  const numHours = firstValue(
    repeatStr.match(/([1-2][0-4]|1[1-9]|[2-9])(?= ?hours)/i)
  )
  const numDays = firstValue(repeatStr.match(/(\d+)(?= ?days)/i))
  const numMonths = firstValue(repeatStr.match(/(\d+)(?= ?months)/i))
  const numYears = firstValue(repeatStr.match(/(\d+)(?= ?years)/i))
  const numMornings = firstValue(repeatStr.match(/(\d+)(?= ?mornings)/i))
  const numAfternoons = firstValue(repeatStr.match(/(\d+)(?= ?afternoons)/i))
  const numEvenings = firstValue(repeatStr.match(/(\d+)(?= ?evenings)/i))
  const numNights = firstValue(repeatStr.match(/(\d+)(?= ?nights)/i))
  const oneMinute = !!repeatStr.match(/minute(?!s)/i)
  const oneHour = !!repeatStr.match(/hour(?!s)/i)
  const oneDay = !!repeatStr.match(/day(?!s)/i)
  const oneMonth = !!repeatStr.match(/month(?!s)/i)
  const oneYear = !!repeatStr.match(/year(?!s)/i)
  const oneMorning = !!repeatStr.match(/morning(?!s)/i)
  const oneAfternoon = !!repeatStr.match(/afternoon(?!s)/i)
  const oneEvening = !!repeatStr.match(/evening(?!s)/i)
  const oneNight = !!repeatStr.match(/night(?!s)/i)

  const repeatType =
    oneMinute || numMinutes
      ? "minute"
      : oneHour || numHours
      ? "hour"
      : oneDay || numDays
      ? "day"
      : oneMonth || numMonths
      ? "month"
      : oneYear || numYears
      ? "year"
      : oneMorning || numMornings
      ? "morning"
      : oneAfternoon || numAfternoons
      ? "afternoon"
      : oneEvening || numEvenings
      ? "evening"
      : oneNight || numNights
      ? "night"
      : null

  const repeatStep =
    numMinutes ||
    numHours ||
    numDays ||
    numMonths ||
    numYears ||
    numMornings ||
    numAfternoons ||
    numEvenings ||
    numNights ||
    null

  return [repeatType, parseInt(repeatStep)]
}

const firstValue = arr => {
  return arr ? arr[0] : null
}
