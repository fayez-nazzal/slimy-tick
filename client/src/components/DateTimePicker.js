import React, { useEffect, useState } from "react"
import { DateTimePicker } from "@material-ui/pickers"
import { useDispatch, useSelector } from "react-redux"
import { toggleDuePicker } from "../redux/app"
import { setDraftTodoDueDate, setDraftTodoDueTime } from "../redux/user"
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles"
import { findDueDateOptions, findDueTimeOptions } from "../utils/regexAnalyzers"
import moment from "moment"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#bedc9b",
    },
  },
})

const BasicDateTimePicker = () => {
  const dispatch = useDispatch()
  const open = useSelector(state => state.app.duePickerOpen)
  const globalDueDate = useSelector(state => state.user.draftTodoValues.dueDate)
  const globalDueTime = useSelector(state => state.user.draftTodoValues.dueTime)
  const [selectedDate, setSelectedDate] = useState(
    globalDueDate ? new Date(globalDueDate) : new Date()
  )

  useEffect(() => {
    const selectedMomentDate = moment(selectedDate)
    if (globalDueDate)
      setSelectedDate(
        new Date(
          findDueDateOptions(globalDueDate)
            .set({
              hour: selectedMomentDate.get("hour"),
              minute: selectedMomentDate.get("minute"),
            })
            .toISOString()
        )
      )
  }, [globalDueDate])

  useEffect(() => {
    const selectedMomentDate = moment(selectedDate)
    if (globalDueTime)
      setSelectedDate(
        new Date(
          findDueTimeOptions(globalDueTime)
            .set({
              year: selectedMomentDate.get("year"),
              month: selectedMomentDate.get("month"),
              day: selectedMomentDate.get("day"),
            })
            .toISOString()
        )
      )
  }, [globalDueTime])

  const handleCloseClicked = () => {
    dispatch(toggleDuePicker())
  }

  const handleAccept = date => {
    const dateString = date.format("MMM DD, YYYY")
    const timeString = date.format("hh:mm a")
    dispatch(setDraftTodoDueDate(dateString))
    dispatch(setDraftTodoDueTime(timeString))
  }

  const renderDay = (day, selectedDate, inCurrentMonth, DayComponent) => {
    return <CustomDay component={DayComponent} day={day.format("D")} />
  }

  return (
    <ThemeProvider theme={theme}>
      <DateTimePicker
        inputVariant="outlined"
        value={selectedDate}
        onChange={setSelectedDate}
        open={open}
        onClose={handleCloseClicked}
        onAccept={handleAccept}
        renderDay={renderDay}
        rightArrowButtonProps={{
          "data-testid": "datetimepicker-rightarrow",
        }}
        color="primary"
        disablePast
      />
    </ThemeProvider>
  )
}

export default BasicDateTimePicker

const CustomDay = props => {
  const classes = useStyles()
  const [hovered, setHovered] = useState(false)

  return React.cloneElement(props.component, {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      backgroundColor: hovered ? "#2dc06590" : "#2dc06535",
    },
    "data-testid": `day-${props.day}`,
  })
}

const useStyles = makeStyles({
  customDay: {
    borderRadius: "50%",
    backgroundColor: "red",
  },
})
