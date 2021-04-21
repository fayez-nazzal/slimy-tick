import { REPEAT_REGEX } from "./regex"

describe("repeat regex", () => {
  describe("minutes", () => {
    test("30 minutes", () => {
      expect(matchRepeat("do something every 30 minutes")).toEqual(
        "every 30 minutes"
      )
    })

    test("59 minutes", () => {
      expect(matchRepeat("every 59 minutes you do something")).toEqual(
        "every 59 minutes"
      )
    })

    test("60 minutes", () => {
      expect(matchRepeat("every 60 minutes is not 59 minutes")).toEqual(
        "every 60 minutes"
      )
    })

    test("120 minutes", () => {
      expect(
        matchRepeat(
          "do you know that every 120 minutes is a the same as 2 hours"
        )
      ).toEqual("every 120 minutes")
    })
  })

  describe("hours", () => {
    test("5 hours", () => {
      expect(matchRepeat("do something every 5 hours")).toEqual("every 5 hours")
    })

    test("72 hours", () => {
      expect(
        matchRepeat("do you know that every 72 hours is the same as 3 days")
      ).toEqual("every 72 hours")
    })
  })

  describe("days", () => {
    test("30a days (wrong)", () => {
      expect(matchRepeat("one every 30a days ....")).toBe(null)
    })

    test("15 days", () => {
      expect(matchRepeat("every 15 days half of the month passes")).toEqual(
        "every 15 days"
      )
    })
  })

  describe("months", () => {
    test("12 months", () => {
      expect(matchRepeat("every 12 months = 1 year")).toBe("every 12 months")
    })

    test("one month", () => {
      expect(matchRepeat("employess get paid every month")).toEqual(
        "every month"
      )
    })
  })

  describe("times", () => {
    test("2:59AM", () => {
      expect(matchRepeat("every 2:59AM the clock ticks to reach 3:00AM")).toBe(
        "every 2:59AM"
      )
    })

    test("14:00", () => {
      expect(matchRepeat(">> every 14:00 <<")).toEqual("every 14:00")
    })

    test("16:00", () => {
      expect(matchRepeat(">> every 16:00 <<")).toEqual("every 16:00")
    })

    test("24:00 (wrong)", () => {
      expect(matchRepeat(">> every 24:00 <<")).toEqual(null)
    })

    test("2:50 PM", () => {
      expect(matchRepeat(">> every 2:50 PM <<")).toEqual("every 2:50 PM")
    })

    test("2:50PM", () => {
      expect(matchRepeat(">> every 2:50PM <<")).toEqual("every 2:50PM")
    })

    test("2:60 PM (wrong)", () => {
      expect(matchRepeat(">> every 2:60 PM <<")).toEqual(null)
    })
  })

  describe("multiple times", () => {
    test("2:00AM and 14:00", () => {
      expect(matchRepeat("every 2:00AM and 14:00")).toEqual(
        "every 2:00AM and 14:00"
      )
    })

    test("2:00AM and 5:25PM", () => {
      expect(matchRepeat(">>>every 2:00AM and 5:25PM<<<")).toEqual(
        "every 2:00AM and 5:25PM"
      )
    })

    test("11:00AM and 16:00 and 28:58", () => {
      expect(matchRepeat(">>>every 11:00AM and 16:00 and 28:58<<<")).toEqual(
        "every 11:00AM and 16:00"
      )
    })
  })

  describe("daytimes", () => {
    test("morning", () => {
      expect(matchRepeat(">>>every morning<<<")).toEqual("every morning")
    })

    test("afternoon", () => {
      expect(matchRepeat(">>>every afternoon<<<")).toEqual("every afternoon")
    })

    test("evening", () => {
      expect(matchRepeat(">>>every evening<<<")).toEqual("every evening")
    })

    test("night", () => {
      expect(matchRepeat(">>>every night<<<")).toEqual("every night")
    })

    test("5 morning (without s)", () => {
      expect(matchRepeat(">>>every 5 morning<<<")).toEqual("every 5 morning")
    })

    test("5 afternoons", () => {
      expect(matchRepeat(">>>every 5 afternoons<<<")).toEqual(
        "every 5 afternoons"
      )
    })

    test("5 evening (without s)", () => {
      expect(matchRepeat(">>>every 5 evening<<<")).toEqual("every 5 evening")
    })

    test("5 nights", () => {
      expect(matchRepeat(">>>every 5 nights<<<")).toEqual("every 5 nights")
    })
  })

  describe("weekdays", () => {
    test("sun", () => {
      expect(matchRepeat(">>>every sun<<<")).toEqual("every sun")
    })

    test("sunday", () => {
      expect(matchRepeat(">>>every sunday<<<")).toEqual("every sunday")
    })

    test("mon", () => {
      expect(matchRepeat(">>>every mon<<<")).toEqual("every mon")
    })

    test("monday", () => {
      expect(matchRepeat(">>>every monday<<<")).toEqual("every monday")
    })

    test("tue", () => {
      expect(matchRepeat(">>>every tue<<<")).toEqual("every tue")
    })

    test("tuesday", () => {
      expect(matchRepeat(">>>every tuesday<<<")).toEqual("every tuesday")
    })

    test("wed", () => {
      expect(matchRepeat(">>>every wed<<<")).toEqual("every wed")
    })

    test("wedensday", () => {
      expect(matchRepeat(">>>every wedensday<<<")).toEqual("every wedensday")
    })

    test("thu", () => {
      expect(matchRepeat(">>>every thu<<<")).toEqual("every thu")
    })

    test("thursday", () => {
      expect(matchRepeat(">>>every thursday<<<")).toEqual("every thursday")
    })

    test("fri", () => {
      expect(matchRepeat(">>>every fri<<<")).toEqual("every fri")
    })

    test("friday", () => {
      expect(matchRepeat(">>>every friday<<<")).toEqual("every friday")
    })
  })

  describe("multiple weekdays", () => {
    test("sun and mon", () => {
      expect(matchRepeat(">>>every sun and mon<<<")).toEqual(
        "every sun and mon"
      )
    })
  })

  test("friday and saturday and thursday", () => {
    expect(matchRepeat(">>>every friday and saturday and thursday<<<")).toEqual(
      "every friday and saturday and thursday"
    )
  })

  test("friday and sat and thursday", () => {
    expect(matchRepeat(">>>every friday and sat and thursday<<<")).toEqual(
      "every friday and sat and thursday"
    )
  })
})

const matchRepeat = str => {
  let arr = str.match(REPEAT_REGEX)
  arr = arr ? arr.filter(Boolean) : arr
  return arr ? arr[0] : null
}
