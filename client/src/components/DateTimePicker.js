import React, { useEffect, useRef, useState } from "react"
import { DateTimePicker } from "@material-ui/pickers"
import { useDispatch, useSelector } from "react-redux"
import { setDraftTodoDueDate, setDraftTodoDueTime } from "../redux/user"
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles"
import { findDueDateOptions, findDueTimeOptions } from "../utils/regexAnalyzers"
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
  const todoRepeat = useSelector(state => state.user.draftTodoValues.repeat)
  const todoDueDate = useSelector(state => state.user.draftTodoValues.dueDate)
  const todoDueTime = useSelector(state => state.user.draftTodoValues.dueTime)
  const [selectedDate, setSelectedDate] = useState()
  const recurDates = useRef([])

  useEffect(() => {
    const normalizedRepeat = repeatArrToDays(todoRepeat)
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
  }, [todoRepeat, selectedDate])

  const handleOkButton = () => {
    const dateString = selectedDate.format("MMM DD, YYYY")
    const timeString = selectedDate.format("hh:mm a")
    dispatch(setDraftTodoDueDate(dateString))
    dispatch(setDraftTodoDueTime(timeString))
    props.onClose()
  }

  const handleAccept = date => {
    setSelectedDate(date)
  }

  const handleOnEnter = () => {
    setSelectedDate(getDate())
  }

  const getDate = () => {
    const todoMomentDate = findDueDateOptions(todoDueDate) || moment()
    const todoMomentTime = findDueTimeOptions(todoDueTime) || moment()

    return todoMomentDate.set({
      hour: todoMomentTime.get("hour"),
      minute: todoMomentTime.get("minute"),
    })
  }

  const renderDay = (day, selectedDate, _, DayComponent) => {
    const normalizedRepeat = repeatArrToDays(todoRepeat)

    const repeatToDays = selectedDate && timeToDays(normalizedRepeat)

    let renderCustom =
      normalizedRepeat &&
      ((repeatToDays && repeatToDays <= 1) ||
        recurDates.current.find(date => date.isSame(day, "day")) ||
        (normalizedRepeat[0] === "weekdays" &&
          normalizedRepeat[1].find(weekday => {
            return day.format("dddd").toLowerCase() === weekday
          }) !== undefined &&
          day.isAfter(selectedDate)))

    return renderCustom ? (
      <CustomDay component={DayComponent} day={day.format("D")} />
    ) : (
      DayComponent
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
      boxShadow: `inset 0px 0px 0px 3px ${hovered ? "#bedeaf" : "#bedc9b95"}`,
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
