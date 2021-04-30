import React, { useEffect, useState } from "react"
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
import { Button, Popover } from "@material-ui/core"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#bedc9b",
    },
  },
})

const BasicDateTimePicker = props => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const todoDueDate = useSelector(state => state.user.draftTodoValues.dueDate)
  const todoDueTime = useSelector(state => state.user.draftTodoValues.dueTime)
  const [selectedDate, setSelectedDate] = useState()

  useEffect(() => {
    const selectedMomentDate = moment(selectedDate)
    if (todoDueDate)
      setSelectedDate(
        findDueDateOptions(todoDueDate)
          .set({
            hour: selectedMomentDate.get("hour"),
            minute: selectedMomentDate.get("minute"),
          })
          .toISOString()
      )
  }, [todoDueDate])

  useEffect(() => {
    const selectedMomentDate = moment(selectedDate)
    if (todoDueTime)
      setSelectedDate(
        findDueTimeOptions(todoDueTime)
          .set({
            year: selectedMomentDate.get("year"),
            month: selectedMomentDate.get("month"),
            day: selectedMomentDate.get("day"),
          })
          .toISOString()
      )
  }, [todoDueTime])

  const handleOkButton = () => {
    const dateString = selectedDate.format("MMM DD, YYYY")
    const timeString = selectedDate.format("hh:mm a")
    setTimeout(() => {
      dispatch(setDraftTodoDueDate(dateString))
      dispatch(setDraftTodoDueTime(timeString))
    }, 100)
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
    const todoMomentTime = findDueDateOptions(todoDueTime) || moment()

    return todoMomentDate.set({
      hour: todoMomentTime.get("hour"),
      minute: todoMomentTime.get("minute"),
    })
  }

  const renderDay = (day, selectedDate, inCurrentMonth, DayComponent) => {
    return <CustomDay component={DayComponent} day={day.format("D")} />
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
      backgroundColor: hovered ? "#2dc06590" : "#2dc06535",
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
