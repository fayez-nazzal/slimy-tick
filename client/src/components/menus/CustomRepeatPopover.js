import React from "react"
import Select from "@material-ui/core/Select"
import {
  MenuItem,
  TextField,
  Typography,
  Popover,
  Button,
} from "@material-ui/core"
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab"
import clsx from "clsx"
import { setDrafttaskRepeat } from "../../redux/user"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles"
import { findRepeatOptions } from "../../utils/regexAnalyzers"

const popoverTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#bedc9b",
    },
  },
  overrides: {
    MuiPopover: {
      paper: {
        border: "1px solid #d3d4d5",
        borderRadius: "4px",
        transition: "none",
        padding: "8px",
      },
    },
  },
})

const CustomRepeatPopover = ({ anchorEl, onClose }) => {
  const classes = useStyles()
  const [stepOption, setStepOption] = useState({
    every: "days",
    value: 2,
  })
  const [weekdays, setWeekdays] = useState([])
  const drafttaskValues = useSelector(state => state.user.drafttaskValues)
  const dispatch = useDispatch()

  useEffect(() => {
    if (drafttaskValues.repeat) {
      const analyzedRepeat = findRepeatOptions(drafttaskValues.repeat)
      setWeekdays(prev =>
        analyzedRepeat[0] === "weekdays" ? analyzedRepeat[1] : prev
      )
      setStepOption({
        every: analyzedRepeat[0],
        value: analyzedRepeat[1],
      })
    }
  }, [drafttaskValues.repeat])

  const onWeekdaysChange = (_, newWeekdays) => {
    setStepOption({
      every: "weekdays",
      value: newWeekdays,
    })
    setWeekdays(newWeekdays)
  }

  const onStepOptionChange = (e, changedValue) => {
    setWeekdays([])
    setStepOption(prev => ({
      every: changedValue === "every" ? e.target.value : prev.every,
      value:
        changedValue === "value" ? e.target.value : parseInt(prev.value) || 2,
    }))
  }

  const handleRepeatPopoverClose = () => {
    onClose()
  }

  const handleRepeatPopoverAccept = () => {
    onClose()
    weekdays.length &&
      dispatch(setDrafttaskRepeat(`every ${weekdays.join(", ")}`))
    stepOption.every &&
      parseInt(stepOption.value) > 0 &&
      dispatch(
        setDrafttaskRepeat(`every ${stepOption.value} ${stepOption.every}`)
      )
  }

  return (
    <ThemeProvider theme={popoverTheme}>
      <Popover
        anchorEl={anchorEl}
        onClose={onClose}
        open={!!anchorEl}
        aria-haspopup="true"
        aria-controls="custom-repeat-popup"
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
        <div aria-label="weekdays options">
          <ToggleButtonGroup
            value={weekdays}
            onChange={onWeekdaysChange}
            aria-label="repeat weekdays"
            size="small"
          >
            <ToggleButton value="sun" aria-label="sunday">
              <Typography variant="caption">Sun</Typography>
            </ToggleButton>
            <ToggleButton value="mon" aria-label="monday">
              <Typography variant="caption">Mon</Typography>
            </ToggleButton>
            <ToggleButton value="tue" aria-label="tuesday">
              <Typography variant="caption">Tue</Typography>
            </ToggleButton>
            <ToggleButton value="wed" aria-label="wednesday">
              <Typography variant="caption">Wed</Typography>
            </ToggleButton>
            <ToggleButton value="thu" aria-label="thursday">
              <Typography variant="caption">Thu</Typography>
            </ToggleButton>
            <ToggleButton value="fri" aria-label="friday">
              <Typography variant="caption">Fri</Typography>
            </ToggleButton>
            <ToggleButton value="sat" aria-label="saturday">
              <Typography variant="caption">Sat</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className={clsx([classes.rowFlex, classes.aroundCenter])}>
          <Typography variant="body1">Every</Typography>
          <TextField
            value={stepOption.value}
            onChange={e => onStepOptionChange(e, "value")}
            type={
              ["times", "weekdays"].includes(stepOption.every)
                ? "text"
                : "number"
            }
            disabled={["times", "weekdays"].includes(stepOption.every)}
            className={classes.repeatNumInput}
          />
          <Select
            labelId="custom-repeat-option-select-label"
            id="custom-repeat-option-select"
            value={stepOption.every}
            onChange={e => onStepOptionChange(e, "every")}
            className={classes.repeatEverySelect}
          >
            <MenuItem value="minutes">Minutes</MenuItem>
            <MenuItem value="hours">Hours</MenuItem>
            <MenuItem value="days">Days</MenuItem>
            <MenuItem value="weeks">Weeks</MenuItem>
            <MenuItem value="months">Months</MenuItem>
            <MenuItem value="years">Years</MenuItem>
            <MenuItem value="mornings" className={classes.hidden}>
              Mornings
            </MenuItem>
            <MenuItem value="afternoons" className={classes.hidden}>
              Afternoons
            </MenuItem>
            <MenuItem value="evenings" className={classes.hidden}>
              Evenings
            </MenuItem>
            <MenuItem value="nights" className={classes.hidden}>
              Nights
            </MenuItem>
            <MenuItem value="times" className={classes.hidden}>
              Times
            </MenuItem>
            <MenuItem value="weekdays" className={classes.hidden}>
              Weekdays
            </MenuItem>
          </Select>
        </div>
        <div className={clsx(classes.rowFlex, classes.aroundCenter)}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRepeatPopoverClose}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRepeatPopoverAccept}
          >
            OK
          </Button>
        </div>
      </Popover>
    </ThemeProvider>
  )
}

export default CustomRepeatPopover

const useStyles = makeStyles(theme => ({
  rowFlex: {
    flexGrow: 1,
    display: "flex",
    margin: "2px 8px",
  },
  aroundCenter: {
    margin: "1rem",
    justifyContent: "space-around",
    alignItems: "center",
  },
  repeatNumInput: {
    width: "5.8rem",
    marginLeft: "0.8rem",
  },
  repeatEverySelect: {
    width: "6.8rem",
    marginLeft: "0.8rem",
  },
  hidden: {
    display: "none",
  },
}))
