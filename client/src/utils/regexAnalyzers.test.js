import { findRepeatOptions } from "./regexAnalyzers"

describe("repeat options", () => {
  describe("minutes", () => {
    test("30 minutes", () => {
      expect(findRepeatOptions("every 30 minutes")).toEqual(["minutes", 30])
    })

    test("59 minutes", () => {
      expect(findRepeatOptions("every 59 minutes")).toEqual(["minutes", 59])
    })

    test("60 minutes", () => {
      expect(findRepeatOptions("every 60 minutes")).toEqual(["minutes", 60])
    })

    test("120 minutes", () => {
      expect(findRepeatOptions("every 120 minutes")).toEqual(["minutes", 120])
    })
  })

  describe("hours", () => {
    test("2 hours)", () => {
      expect(findRepeatOptions("every 2 hours")).toEqual(["hours", 2])
    })

    test("24 hours)", () => {
      expect(findRepeatOptions("every 24 hours")).toEqual(["hours", 24])
    })

    test("25 hours)", () => {
      expect(findRepeatOptions("every 25 hours")).toEqual(["hours", 25])
    })

    test("48 hours)", () => {
      expect(findRepeatOptions("every 48 hours")).toEqual(["hours", 48])
    })
  })

  describe("testing days", () => {
    test("300 days)", () => {
      expect(findRepeatOptions("every 300 days")).toEqual(["days", 300])
    })

    test("30a days (wrong))", () => {
      expect(findRepeatOptions("every 30a days")).toEqual([null, null])
    })

    test("22 months)", () => {
      expect(findRepeatOptions("every 22 months")).toEqual(["months", 22])
    })
  })

  describe("testing times", () => {
    test("time AMPM)", () => {
      expect(findRepeatOptions("every 2:59AM")).toEqual(["times", ["2:59AM"]])
    })

    test("time 24h)", () => {
      expect(findRepeatOptions("every 14:00")).toEqual(["times", ["14:00"]])
    })

    test("time 16:00)", () => {
      expect(findRepeatOptions("every 16:00")).toEqual(["times", ["16:00"]])
    })

    test("time 24h but wrong)", () => {
      expect(findRepeatOptions("every 24:00")).toEqual([null, null])
    })

    test("time AMPM but wrong)", () => {
      expect(findRepeatOptions("every 2:60PM")).toEqual([null, null])
    })

    test("time AMPM but wrong)", () => {
      expect(findRepeatOptions("every 9:88AM")).toEqual([null, null])
    })

    test("2:00AM and 5:25PM)", () => {
      expect(findRepeatOptions("every 2:00AM and 5:25PM")).toEqual([
        "times",
        ["2:00AM", "5:25PM"],
      ])
    })

    test("2:00AM and 14:00)", () => {
      expect(findRepeatOptions("every 2:00AM and 14:00")).toEqual([
        "times",
        ["2:00AM", "14:00"],
      ])
    })

    test("2:00AM and 14:00 and 23:58)", () => {
      expect(findRepeatOptions("every 2:00AM and 14:00 and 23:58")).toEqual([
        "times",
        ["2:00AM", "14:00", "23:58"],
      ])
    })

    test("11:00AM and 16:00 and 28:58)", () => {
      expect(findRepeatOptions("every 11:00AM and 16:00 and 28:58")).toEqual([
        "times",
        ["11:00AM", "16:00"],
      ])
    })

    describe("testing daytimes", () => {
      test("morning and evening)", () => {
        expect(findRepeatOptions("every morning and evening")).toEqual([
          "daytimes",
          ["morning", "evening"],
        ])
      })

      test("morning)", () => {
        expect(findRepeatOptions("every morning")).toEqual(["mornings", 1])
      })

      test("5 mornings)", () => {
        expect(findRepeatOptions("every 5 mornings")).toEqual(["mornings", 5])
      })

      test("5 morning)", () => {
        expect(findRepeatOptions("every 5 morning")).toEqual(["mornings", 5])
      })

      test("20 nights)", () => {
        expect(findRepeatOptions("every 20 nights")).toEqual(["nights", 20])
      })
    })
  })
})

describe("testing weekdays", () => {
  test("sunday)", () => {
    expect(findRepeatOptions("every sunday")).toEqual(["weekdays", ["sunday"]])
  })

  test("sunday and friday)", () => {
    expect(findRepeatOptions("every sunday and friday")).toEqual([
      "weekdays",
      ["sunday", "friday"],
    ])
  })

  test("sun and tue)", () => {
    expect(findRepeatOptions("every sun and tue")).toEqual([
      "weekdays",
      ["sunday", "tuesday"],
    ])
  })

  test("sun and tue and wedensday)", () => {
    expect(findRepeatOptions("every sun and tue and wedensday")).toEqual([
      "weekdays",
      ["sunday", "tuesday", "wedensday"],
    ])
  })

  test("sunday and friday and saturday)", () => {
    expect(findRepeatOptions("every sunday and friday and saturday")).toEqual([
      "weekdays",
      ["sunday", "friday", "saturday"],
    ])
  })
})
