import React, { useEffect, useRef, useState } from "react"
import { DateTimePicker } from "@material-ui/pickers"
import { useDispatch, useSelector } from "react-redux"
import { setDrafttaskDueDate, setDrafttaskDueTime } from "../redux/user"
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles"
import {
  findDueDateOptions,
  findDueTimeOptions,
  findRepeatOptions,
} from "../utils/regexAnalyzers"
import moment from "moment"
import "moment-recur"
import { Button, Popover } from "@material-ui/core"
import { minutes, hours, days } from "time-convert"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#bedc9b",
    },
  },
})

const timeToDays = repeatArr => {
  const repeatFor = repeatArr && repeatArr[0]

  return repeatFor === "minutes"
    ? days.from(minutes)(repeatArr[1])
    : repeatFor === "hours"
    ? days.from(hours)(repeatArr[1])
    : repeatFor === "days"
    ? repeatArr[1]
    : null
}

const repeatArrToDays = repeatArr => {
  const repeatFor = repeatArr && repeatArr[0]
  return repeatFor === "mornings" ||
    repeatFor === "afternoons" ||
    repeatFor === "evenings" ||
    repeatFor === "nights" ||
    repeatFor === "days"
    ? ["days", repeatArr[1]]
    : repeatFor === "daytimes" || repeatFor === "times"
    ? ["days", 1]
    : repeatFor === "weeks"
    ? ["days", repeatArr[1] * 7]
    : repeatArr
}

const BasicDateTimePicker = props => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const taskRepeat = useSelector(state => state.user.drafttaskValues.repeat)
  const taskDueDate = useSelector(state => state.user.drafttaskValues.dueDate)
  const taskDueTime = useSelector(state => state.user.drafttaskValues.dueTime)
  const [selectedDate, setSelectedDate] = useState()
  const recurDates = useRef([])

  useEffect(() => {
    const analyzedRepeat = findRepeatOptions(taskRepeat)

    const normalizedRepeat = repeatArrToDays(analyzedRepeat)
    !selectedDate && setSelectedDate(getDate())
    const eqDays = timeToDays(normalizedRepeat)

    if (
      normalizedRepeat &&
      !normalizedRepeat["weekdays"] &&
      selectedDate &&
      (!eqDays || eqDays > 1)
    ) {
      const currClone = selectedDate.clone()
      recurDates.current = []
      const dateCount = eqDays < 4 ? 800 : eqDays < 8 ? 500 : 100

      for (let i = 0; i < dateCount; i++) {
        currClone.add(normalizedRepeat[1], normalizedRepeat[0])

        recurDates.current.push(currClone.clone())
      }
    }
  }, [taskRepeat, selectedDate])

  const handleOkButton = () => {
    const dateString = selectedDate.format("MMM DD, YYYY")
    const timeString = selectedDate.format("hh:mm a")
    dispatch(setDrafttaskDueDate(dateString))
    dispatch(setDrafttaskDueTime(timeString))
    props.onClose()
  }

  const handleAccept = date => {
    setSelectedDate(date)
  }

  const handleOnEnter = () => {
    setSelectedDate(getDate())
  }

  const getDate = () => {
    const taskMomentDate = findDueDateOptions(taskDueDate) || moment()
    const taskMomentTime = findDueTimeOptions(taskDueTime) || moment()

    return taskMomentDate.set({
      hour: taskMomentTime.get("hour"),
      minute: taskMomentTime.get("minute"),
    })
  }

  const renderDay = (day, selectedDate, _, DayComponent) => {
    const analyzedRepeat = findRepeatOptions(taskRepeat)
    const normalizedRepeat = repeatArrToDays(analyzedRepeat)

    const repeatToDays = selectedDate && timeToDays(normalizedRepeat)

    let renderCustom =
      normalizedRepeat &&
      ((repeatToDays && repeatToDays <= 1) ||
        recurDates.current.find(date => date.isSame(day, "day")) ||
        (normalizedRepeat[0] === "weekdays" &&
          normalizedRepeat[1].find(weekday => {
            return day.format("ddd").toLowerCase() === weekday
          }) !== undefined &&
          day.isAfter(selectedDate)))

    return (
      <CustomDay
        highlighted={renderCustom}
        component={DayComponent}
        day={day.format("D")}
      />
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Popover
        open={!!props.anchorEl}
        anchorEl={props.anchorEl}
        onClose={props.onClose}
        onEnter={handleOnEnter}
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <DateTimePicker
          variant="static"
          value={selectedDate}
          onChange={setSelectedDate}
          onAccept={handleAccept}
          renderDay={renderDay}
          rightArrowButtonProps={{
            "data-testid": "datetimepicker-rightarrow",
          }}
          color="primary"
          disablePast
          minutesStep={5}
          autoOk
        />
        <div className={classes.flex}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleOkButton}
          >
            Ok
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={props.onClose}
          >
            Cancel
          </Button>
        </div>
      </Popover>
    </ThemeProvider>
  )
}

export default BasicDateTimePicker

const CustomDay = props => {
  const [hovered, setHovered] = useState(false)

  return React.cloneElement(props.component, {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      boxShadow:
        props.highlighted &&
        `inset 0px 0px 0px 3px ${hovered ? "#bedeaf" : "#bedc9b95"}`,
    },
    "data-testid": `day-${props.day}`,
  })
}

const useStyles = makeStyles({
  flex: {
    marginTop: "8px",
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
  button: {
    margin: "0 6px",
  },
})
