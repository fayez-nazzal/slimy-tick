import React, { Fragment, useState } from "react"
import { DateTimePicker } from "@material-ui/pickers"
import { useDispatch, useSelector } from "react-redux"
import { toggleDuePicker } from "../redux/app"
import { createMuiTheme, makeStyles, ThemeProvider } from "@material-ui/core"

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
  const [selectedDate, handleDateChange] = useState(new Date())

  const handleCloseClicked = () => {
    dispatch(toggleDuePicker())
  }

  const handleAccept = date => {
    console.log(date)
  }

  const renderDay = (day, selectedDate, inCurrentMonth, DayComponent) => {
    return <CustomDay component={DayComponent}>2</CustomDay>
  }

  return (
    <ThemeProvider theme={theme}>
      <DateTimePicker
        emptyLabel
        inputVariant="outlined"
        value={selectedDate}
        onChange={handleDateChange}
        open={open}
        onClose={handleCloseClicked}
        onAccept={handleAccept}
        renderDay={renderDay}
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
  })
}

const useStyles = makeStyles({
  customDay: {
    borderRadius: "50%",
    backgroundColor: "red",
  },
})
