import { matchRepeat, matchDueDate, matchDueTime } from "./matchers"

describe("repeat regex", () => {
  describe("minutes", () => {
    test("30 minutes", () => {
      expect(matchRepeat("do something every 30 minutes")).toBe(
        "every 30 minutes"
      )
    })

    test("59 minutes", () => {
      expect(matchRepeat("every 59 minutes you do something")).toBe(
        "every 59 minutes"
      )
    })

    test("60 minutes", () => {
      expect(matchRepeat("every 60 minutes is not 59 minutes")).toBe(
        "every 60 minutes"
      )
    })

    test("120 minutes", () => {
      expect(
        matchRepeat(
          "do you know that every 120 minutes is a the same as 2 hours"
        )
      ).toBe("every 120 minutes")
    })
  })

  describe("hours", () => {
    test("5 hours", () => {
      expect(matchRepeat("do something every 5 hours")).toBe("every 5 hours")
    })

    test("72 hours", () => {
      expect(
        matchRepeat("do you know that every 72 hours is the same as 3 days")
      ).toBe("every 72 hours")
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
      expect(matchRepeat("employess get paid every month")).toBe("every month")
    })
  })

  describe("times", () => {
    test("2:59AM", () => {
      expect(matchRepeat("every 2:59AM the clock ticks to reach 3:00AM")).toBe(
        "every 2:59AM"
      )
    })

    test("14:00", () => {
      expect(matchRepeat(">> every 14:00 <<")).toBe("every 14:00")
    })

    test("16:00", () => {
      expect(matchRepeat(">> every 16:00 <<")).toBe("every 16:00")
    })

    test("24:00 (wrong)", () => {
      expect(matchRepeat(">> every 24:00 <<")).toBe(null)
    })

    test("2:50 PM", () => {
      expect(matchRepeat(">> every 2:50 PM <<")).toBe("every 2:50 PM")
    })

    test("2:50PM", () => {
      expect(matchRepeat(">> every 2:50PM <<")).toBe("every 2:50PM")
    })

    test("2:60 PM (wrong)", () => {
      expect(matchRepeat(">> every 2:60 PM <<")).toBe(null)
    })
  })

  describe("multiple times", () => {
    test("2:00AM and 14:00", () => {
      expect(matchRepeat("every 2:00AM and 14:00")).toBe(
        "every 2:00AM and 14:00"
      )
    })

    test("2:00AM and 5:25PM", () => {
      expect(matchRepeat(">>>every 2:00AM and 5:25PM<<<")).toBe(
        "every 2:00AM and 5:25PM"
      )
    })

    test("11:00AM and 16:00 and 28:58", () => {
      expect(matchRepeat(">>>every 11:00AM and 16:00 and 28:58<<<")).toBe(
        "every 11:00AM and 16:00"
      )
    })
  })

  describe("daytimes", () => {
    test("morning", () => {
      expect(matchRepeat(">>>every morning<<<")).toBe("every morning")
    })

    test("afternoon", () => {
      expect(matchRepeat(">>>every afternoon<<<")).toBe("every afternoon")
    })

    test("evening", () => {
      expect(matchRepeat(">>>every evening<<<")).toBe("every evening")
    })

    test("night", () => {
      expect(matchRepeat(">>>every night<<<")).toBe("every night")
    })

    test("5 morning (without s)", () => {
      expect(matchRepeat(">>>every 5 morning<<<")).toBe("every 5 morning")
    })

    test("5 afternoons", () => {
      expect(matchRepeat(">>>every 5 afternoons<<<")).toBe("every 5 afternoons")
    })

    test("5 evening (without s)", () => {
      expect(matchRepeat(">>>every 5 evening<<<")).toBe("every 5 evening")
    })

    test("5 nights", () => {
      expect(matchRepeat(">>>every 5 nights<<<")).toBe("every 5 nights")
    })
  })

  describe("weekdays", () => {
    test("sun", () => {
      expect(matchRepeat(">>>every sun<<<")).toBe("every sun")
    })

    test("sunday", () => {
      expect(matchRepeat(">>>every sunday<<<")).toBe("every sunday")
    })

    test("mon", () => {
      expect(matchRepeat(">>>every mon<<<")).toBe("every mon")
    })

    test("monday", () => {
      expect(matchRepeat(">>>every monday<<<")).toBe("every monday")
    })

    test("tue", () => {
      expect(matchRepeat(">>>every tue<<<")).toBe("every tue")
    })

    test("tuesday", () => {
      expect(matchRepeat(">>>every tuesday<<<")).toBe("every tuesday")
    })

    test("wed", () => {
      expect(matchRepeat(">>>every wed<<<")).toEqual("every wed")
    })

    test("wedensday", () => {
      expect(matchRepeat(">>>every wedensday<<<")).toBe("every wedensday")
    })

    test("thu", () => {
      expect(matchRepeat(">>>every thu<<<")).toBe("every thu")
    })

    test("thursday", () => {
      expect(matchRepeat(">>>every thursday<<<")).toBe("every thursday")
    })

    test("fri", () => {
      expect(matchRepeat(">>>every fri<<<")).toBe("every fri")
    })

    test("friday", () => {
      expect(matchRepeat(">>>every friday<<<")).toBe("every friday")
    })
  })

  describe("multiple weekdays", () => {
    test("sun and mon", () => {
      expect(matchRepeat(">>>every sun and mon<<<")).toBe("every sun and mon")
    })
  })

  test("friday and saturday and thursday", () => {
    expect(matchRepeat(">>>every friday and saturday and thursday<<<")).toBe(
      "every friday and saturday and thursday"
    )
  })

  test("friday and sat and thursday", () => {
    expect(matchRepeat(">>>every friday and sat and thursday<<<")).toBe(
      "every friday and sat and thursday"
    )
  })
})

describe("match due", () => {
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

    it("match DD-MM", () => {
      expect(matchDueDate(">>>22-05<<")).toBe("22-05")
    })

    it("doesn't match old dates", () => {
      expect(matchDueDate(">>>05-22-2019<<")).toBe(null)
    })

    it("match next sunday", () => {
      expect(matchDueDate("next sunday")).toBe("sunday")
    })

    it("match tomorrow", () => {
      expect(matchDueDate(">> tomorrow <<")).toBe("tomorrow")
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

    it("match 23:05", () => {
      expect(matchDueTime(">>23:05<<")).toBe("23:05")
    })

    it("match at 23:05 (ignores AM)", () => {
      expect(matchDueTime(">>at 23:05 AM<<")).toBe("at 23:05")
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
  })

  describe("after days/weeks/months...", () => {
    it("match after 2 days", () => {
      expect(matchDueDate(">> after 2 days <<")).toBe("after 2 days")
    })

    it("match after 1 week", () => {
      expect(matchDueDate(">> after 1 week <<")).toBe("after 1 week")
    })

    it("match after month", () => {
      expect(matchDueDate(">> after month <<")).toBe("after month")
    })

    it("match after a week", () => {
      expect(matchDueDate(">> after a week <<")).toBe("after a week")
    })
  })

  describe("after minutes/hours", () => {
    it("match after 2 hours", () => {
      expect(matchDueTime(">> after 2 hours <<")).toBe("after 2 hours")
    })

    it("match after an hour", () => {
      expect(matchDueTime(">> after an hour <<")).toBe("after an hour")
    })

    it("match after 30 minutes", () => {
      expect(matchDueTime(">> after 30 minutes <<")).toBe("after 30 minutes")
    })
  })
})
