import {
  matchRepeat,
  matchDueDate,
  matchDueTime,
  matchPriorityAndReturnRange,
} from "./matchers"

describe("Testing repeat regexes", () => {
  describe("minutes", () => {
    test("every 30 minutes", () => {
      expect(matchRepeat("do something every 30 minutes")).toBe(
        "every 30 minutes"
      )
    })

    test("every 59 minutes", () => {
      expect(matchRepeat("every 59 minutes you do something")).toBe(
        "every 59 minutes"
      )
    })

    test("every 60 minutes", () => {
      expect(matchRepeat("every 60 minutes is not 59 minutes")).toBe(
        "every 60 minutes"
      )
    })

    test("every 120 minutes", () => {
      expect(
        matchRepeat(
          "do you know that every 120 minutes is a the same as 2 hours"
        )
      ).toBe("every 120 minutes")
    })
  })

  describe("hours", () => {
    test("every 5 hours", () => {
      expect(matchRepeat("do something every 5 hours")).toBe("every 5 hours")
    })

    test("every 72 hours", () => {
      expect(
        matchRepeat("do you know that every 72 hours is the same as 3 days")
      ).toBe("every 72 hours")
    })
  })

  describe("days", () => {
    test("every 30a days (wrong)", () => {
      expect(matchRepeat("one every 30a days ....")).toBe(null)
    })

    test("every 15 days", () => {
      expect(matchRepeat("every 15 days half of the month passes")).toEqual(
        "every 15 days"
      )
    })

    test("every 15 days", () => {
      expect(matchRepeat("every 15 days half of the month passes")).toEqual(
        "every 15 days"
      )
    })
    test("every day (between text)", () => {
      expect(matchRepeat("do programmers code every day ??")).toEqual(
        "every day"
      )
    })

    test("every day", () => {
      expect(matchRepeat(">>>>>>>>>>>>>every day<<<<<<<<<")).toEqual(
        "every day"
      )
    })

    test("everyday", () => {
      expect(matchRepeat(">>>>>>>>>>>>>everyday<<<<<<<<<")).toEqual("everyday")
    })

    test("every week", () => {
      expect(matchRepeat(">>>>>>>>>>>>>every week<<<<<<<<<")).toEqual(
        "every week"
      )
    })

    // those has some mistakes but someone may write it...
    test("everyweek", () => {
      expect(matchRepeat(">>>>>>>>>>>>>everyweek<<<<<<<<<")).toEqual(
        "everyweek"
      )
    })

    test("every month", () => {
      expect(matchRepeat(">>>>>>>>>>>>>every month<<<<<<<<<")).toEqual(
        "every week"
      )
    })

    test("everymonth", () => {
      expect(matchRepeat(">>>>>>>>>>>>>everymonth<<<<<<<<<")).toEqual(
        "everymonth"
      )
    })
  })

  describe("months", () => {
    test("every 12 months", () => {
      expect(matchRepeat("every 12 months = 1 year")).toBe("every 12 months")
    })

    test("every 12 month (no s)", () => {
      expect(matchRepeat("every 12 month = 1 year")).toBe("every 12 month")
    })

    test("every one month", () => {
      expect(matchRepeat("employess get paid every month")).toBe("every month")
    })
  })

  describe("times", () => {
    test("every 2:59AM", () => {
      expect(matchRepeat("every 2:59AM the clock ticks to reach 3:00AM")).toBe(
        "every 2:59AM"
      )
    })

    test("every 14:00", () => {
      expect(matchRepeat(">> every 14:00 <<")).toBe("every 14:00")
    })

    test("every 16:00", () => {
      expect(matchRepeat(">> every 16:00 <<")).toBe("every 16:00")
    })

    test("every 24:00 (wrong, no such time)", () => {
      expect(matchRepeat(">> every 24:00 <<")).toBe(null)
    })

    test("every 2:50 PM", () => {
      expect(matchRepeat(">> every 2:50 PM <<")).toBe("every 2:50 PM")
    })

    test("every 2:50PM", () => {
      expect(matchRepeat(">> every 2:50PM <<")).toBe("every 2:50PM")
    })

    test("every 2:60 PM (wrong)", () => {
      expect(matchRepeat(">> every 2:60 PM <<")).toBe(null)
    })
  })

  describe("multiple times", () => {
    test("every 2:00AM and 14:00", () => {
      expect(matchRepeat("every 2:00AM and 14:00")).toBe(
        "every 2:00AM and 14:00"
      )
    })

    test("every 2:00AM and 5:25PM", () => {
      expect(matchRepeat(">>>every 2:00AM and 5:25PM<<<")).toBe(
        "every 2:00AM and 5:25PM"
      )
    })

    test("every 11:00AM and 16:00 and 28:58", () => {
      expect(matchRepeat(">>>every 11:00AM and 16:00 and 28:58<<<")).toBe(
        "every 11:00AM and 16:00"
      )
    })

    test("every 2:00AM 14:00", () => {
      expect(matchRepeat("every 2:00AM 14:00")).toBe("every 2:00AM 14:00")
    })

    test("every 2:00AM, 14:00", () => {
      expect(matchRepeat("every 2:00AM, 14:00")).toBe("every 2:00AM, 14:00")
    })
  })

  describe("daytimes", () => {
    test("every morning", () => {
      expect(matchRepeat(">>>every morning<<<")).toBe("every morning")
    })

    test("every afternoon", () => {
      expect(matchRepeat(">>>every afternoon<<<")).toBe("every afternoon")
    })

    test("every evening", () => {
      expect(matchRepeat(">>>every evening<<<")).toBe("every evening")
    })

    test("every night", () => {
      expect(matchRepeat(">>>every night<<<")).toBe("every night")
    })

    test("every 5 morning (without s)", () => {
      expect(matchRepeat(">>>every 5 morning<<<")).toBe("every 5 morning")
    })

    test("every 5 afternoons", () => {
      expect(matchRepeat(">>>every 5 afternoons<<<")).toBe("every 5 afternoons")
    })

    test("every 5 evening (without s)", () => {
      expect(matchRepeat(">>>every 5 evening<<<")).toBe("every 5 evening")
    })

    test("every 5 nights", () => {
      expect(matchRepeat(">>>every 5 nights<<<")).toBe("every 5 nights")
    })
  })

  describe("weekdays", () => {
    test("every sun", () => {
      expect(matchRepeat(">>>every sun<<<")).toBe("every sun")
    })

    test("every sunday", () => {
      expect(matchRepeat(">>>every sunday<<<")).toBe("every sunday")
    })

    test("every mon", () => {
      expect(matchRepeat(">>>every mon<<<")).toBe("every mon")
    })

    test("every monday", () => {
      expect(matchRepeat(">>>every monday<<<")).toBe("every monday")
    })

    test("every tue", () => {
      expect(matchRepeat(">>>every tue<<<")).toBe("every tue")
    })

    test("every tuesday", () => {
      expect(matchRepeat(">>>every tuesday<<<")).toBe("every tuesday")
    })

    test("every wed", () => {
      expect(matchRepeat(">>>every wed<<<")).toEqual("every wed")
    })

    test("every wednesday", () => {
      expect(matchRepeat(">>>every wednesday<<<")).toBe("every wednesday")
    })

    test("every thu", () => {
      expect(matchRepeat(">>>every thu<<<")).toBe("every thu")
    })

    test("every thursday", () => {
      expect(matchRepeat(">>>every thursday<<<")).toBe("every thursday")
    })

    test("every fri", () => {
      expect(matchRepeat(">>>every fri<<<")).toBe("every fri")
    })

    test("every friday", () => {
      expect(matchRepeat(">>>every friday<<<")).toBe("every friday")
    })
  })

  describe("multiple weekdays", () => {
    test("every sun and mon", () => {
      expect(matchRepeat(">>>every sun and mon<<<")).toBe("every sun and mon")
    })
  })

  test("every sun mon fri", () => {
    expect(matchRepeat(">>>every sun mon fri<<<")).toBe("every sun mon fri")
  })

  test("every wed, thu and fri", () => {
    expect(matchRepeat(">>>every wed, thu and fri<<<")).toBe(
      "every wed, thu and fri"
    )
  })

  test("every friday and saturday and thursday", () => {
    expect(matchRepeat(">>>every friday and saturday and thursday<<<")).toBe(
      "every friday and saturday and thursday"
    )
  })

  test("every friday and sat and thursday", () => {
    expect(matchRepeat(">>>every friday and sat and thursday<<<")).toBe(
      "every friday and sat and thursday"
    )
  })
})

describe("Testing due", () => {
  describe("dates", () => {
    it("match format 1", () => {
      expect(matchDueDate(">>>january, 5th 25<<")).toBe("january, 5th 25")
    })

    it("match format 2", () => {
      expect(matchDueDate(">>>3rd jan 25<<")).toBe("3rd jan 25")
    })

    it("match MM/DD/YYYY", () => {
      expect(matchDueDate(">>>05/22/2025<<")).toBe("05/22/2025")
    })

    it("match MM/DD/YY", () => {
      expect(matchDueDate(">>>05/22/25<<")).toBe("05/22/25")
    })

    it("match DD/MM/YYYY", () => {
      expect(matchDueDate(">>>22/05/2025<<")).toBe("22/05/2025")
    })

    it("match DD/MM/YY", () => {
      expect(matchDueDate(">>>22/05/25<<")).toBe("22/05/25")
    })

    it("match MM-DD-YYYY", () => {
      expect(matchDueDate(">>>05-22-2025<<")).toBe("05-22-2025")
    })

    it("match MM-DD-YY", () => {
      expect(matchDueDate(">>>05-22-25<<")).toBe("05-22-25")
    })

    it("match DD-MM-YYYY", () => {
      expect(matchDueDate(">>>22-05-2025<<")).toBe("22-05-2025")
    })

    it("match DD-MM-YY", () => {
      expect(matchDueDate(">>>22-05-25<<")).toBe("22-05-25")
    })

    it("match MM\\DD\\YYYY", () => {
      expect(matchDueDate(">>>05\\22\\2025<<")).toBe("05\\22\\2025")
    })

    it("match MM\\DD\\YY", () => {
      expect(matchDueDate(">>>05\\22\\25<<")).toBe("05\\22\\25")
    })

    it("match DD\\MM\\YYYY", () => {
      expect(matchDueDate(">>>22\\05\\2025<<")).toBe("22\\05\\2025")
    })

    it("match DD\\MM\\YY", () => {
      expect(matchDueDate(">>>22\\05\\25<<")).toBe("22\\05\\25")
    })

    it("match M-D-YYYY", () => {
      expect(matchDueDate(">>>5-5-2025<<")).toBe("5-5-2025")
    })

    it("doesn't match old dates", () => {
      expect(matchDueDate(">>>05-22-2019<<")).toBe(null)
    })

    it("match next sunday", () => {
      expect(matchDueDate("next sunday")).toBe("next sunday")
    })

    it("match next fri", () => {
      expect(matchDueDate("next fri")).toBe("next fri")
    })

    it("match tomorrow", () => {
      expect(matchDueDate(">> tomorrow <<")).toBe("tomorrow")
    })

    it("match next day", () => {
      expect(matchDueDate(">> next day <<")).toBe("next day")
    })

    it("match next week", () => {
      expect(matchDueDate(">> next week <<")).toBe("next week")
    })
  })

  describe("time", () => {
    it("match 2:00AM", () => {
      expect(matchDueTime(">>2:00AM<<")).toBe("2:00AM")
    })

    it("match 12:00 AM", () => {
      expect(matchDueTime(">>12:00 AM<<")).toBe("12:00 AM")
    })

    it("not matching 15:80", () => {
      expect(matchDueTime(">>15:80<<")).toBeNull()
    })

    it("match 19:59", () => {
      expect(matchDueTime(">>19:59<<")).toBe("19:59")
    })

    it("match 10:00", () => {
      expect(matchDueTime(">>10:00<<")).toBe("10:00")
    })

    it("match 23:05", () => {
      expect(matchDueTime(">>23:05<<")).toBe("23:05")
    })

    it("match at 23:05 (ignores AM)", () => {
      expect(matchDueTime(">>at 23:05 AM<<")).toBe("at 23:05")
    })

    it("in 2:00AM (matches just 2:00AM)", () => {
      expect(matchDueTime("in 2:00AM")).toBe("2:00AM")
    })
  })

  describe("match daytimes", () => {
    it("match morning", () => {
      expect(matchDueTime(">>morning<<")).toBe("morning")
    })

    it("match afternoon", () => {
      expect(matchDueTime(">>before afternoon<<")).toBe("before afternoon")
    })

    it("match before evening", () => {
      expect(matchDueTime(">>before evening<<")).toBe("before evening")
    })

    it("match on night", () => {
      expect(matchDueTime("on night")).toBe("on night")
    })

    it("in night (matches just night)", () => {
      expect(matchDueTime("in night")).toBe("night")
    })
  })

  describe("after days/weeks/months...", () => {
    it("match after 2 days", () => {
      expect(matchDueDate(">> after 2 days <<")).toBe("after 2 days")
    })

    it("match after 1 week", () => {
      expect(matchDueDate(">> after 1 week <<")).toBe("after 1 week")
    })

    it("match after 4 weeks", () => {
      expect(matchDueDate(">> after 4 weeks <<")).toBe("after 4 weeks")
    })

    it("match after month", () => {
      expect(matchDueDate(">> after month <<")).toBe("after month")
    })

    it("match after a week", () => {
      expect(matchDueDate(">> after a week <<")).toBe("after a week")
    })

    it("match after one week", () => {
      expect(matchDueDate(">> after one week <<")).toBe("after one week")
    })

    it("match after week", () => {
      expect(matchDueDate(">> after week <<")).toBe("after week")
    })
  })

  describe("after minutes/hours", () => {
    it("match after 2 hours", () => {
      expect(matchDueTime(">> after 2 hours <<")).toBe("after 2 hours")
    })

    it("match after 22 hour (no s)", () => {
      expect(matchDueTime(">> after 22 hour <<")).toBe("after 22 hour")
    })

    it("match after one hour", () => {
      expect(matchDueTime(">> after one hour <<")).toBe("after one hour")
    })

    it("match after two hours", () => {
      expect(matchDueTime(">> after two hours <<")).toBe("after two hours")
    })

    it("match after five hour", () => {
      expect(matchDueTime(">> after five hour <<")).toBe("after five hour")
    })

    it("match after an hour", () => {
      expect(matchDueTime(">> after an hour <<")).toBe("after an hour")
    })

    it("match after 30 minutes", () => {
      expect(matchDueTime(">> after 30 minutes <<")).toBe("after 30 minutes")
    })
  })

  describe("after minutes/hours", () => {
    it("match after 2 hours", () => {
      expect(matchDueTime(">> after 2 hours <<")).toBe("after 2 hours")
    })

    it("match after 22 hour (no s)", () => {
      expect(matchDueTime(">> after 22 hour <<")).toBe("after 22 hour")
    })

    it("match after one hour", () => {
      expect(matchDueTime(">> after one hour <<")).toBe("after one hour")
    })

    it("match after two hours", () => {
      expect(matchDueTime(">> after two hours <<")).toBe("after two hours")
    })

    it("match after five hour", () => {
      expect(matchDueTime(">> after five hour <<")).toBe("after five hour")
    })

    it("match after an hour", () => {
      expect(matchDueTime(">> after an hour <<")).toBe("after an hour")
    })

    it("match after 30 minutes", () => {
      expect(matchDueTime(">> after 30 minutes <<")).toBe("after 30 minutes")
    })
  })

  describe("Testing priorities", () => {
    it("match medium", () => {
      expect(matchPriorityAndReturnRange(">>sample task~~! <<")).toEqual([
        15,
        16,
      ])
    })

    it("match high", () => {
      expect(matchPriorityAndReturnRange(">> !! <<")).toEqual([3, 5])
    })

    it("match very high", () => {
      expect(matchPriorityAndReturnRange(">> !!! <<")).toEqual([3, 6])
    })

    it("match the last priority (low)", () => {
      expect(
        matchPriorityAndReturnRange(">> !!! !! ! !! !!! ! !! ! <<")
      ).toEqual([24, 25])
    })
  })
})
