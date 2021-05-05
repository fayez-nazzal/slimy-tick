/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
  createMuiTheme,
  makeStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ButtonGroupIconButton from '../general/ButtonGroupIconButton';

const navbarTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#f6f7ff',
    },
  },
});

const iconsTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#bedc9b',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    boxShadow: 'none',
    borderBottom: '0.5px solid #d8d9e0',
    boxSizing: 'border-box',
  },
  appBarShift: {
    width: (props) => `calc(100% - ${props.onlySm ? '26vw' : props.sm ? '20vw' : '0px'})`,
    marginLeft: (props) => (props.onlySm ? '26vw' : props.sm ? '20vw' : 0),
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    margin: theme.spacing(0, 2, 0, 0.12),
  },
  button: {
    border: 0,
    borderRadius: 0,
  },
  selectedButton: {
    backgroundColor: '#bedc9b',
    '&:hover': {
      backgroundColor: '#ceddbc',
    },
  },
  hide: {
    display: 'none',
  },
  largeIcon: {
    transform: 'scale(1.2)',
  },
  fullFlex: {
    display: 'flex',
    justifyContent: 'stretch',
    width: '100%',
  },
}));

const NavBar = ({
  drawerOpen, toggleDrawer, filter, setFilter,
}) => {
  const sm = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const onlySm = useMediaQuery((theme) => theme.breakpoints.only('sm'));
  const classes = useStyles({ sm, onlySm });

  return (
    <MuiThemeProvider theme={navbarTheme}>
      <AppBar
        color="primary"
        position="sticky"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar className={classes.toolbar} variant="dense" disableGutters>
          <MuiThemeProvider theme={iconsTheme}>
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              edge="start"
              className={clsx(
                classes.menuButton,
                drawerOpen && classes.hide,
              )}
            >
              <MenuIcon color="primary" className={classes.largeIcon} />
            </IconButton>
          </MuiThemeProvider>
          <div className={classes.fullFlex}>
            <Button
              className={clsx(classes.button, {
                [classes.selectedButton]: filter === 'ALL',
              })}
              onClick={() => setFilter('ALL')}
              fullWidth
            >
              All
            </Button>
            <Button
              className={clsx(classes.button, {
                [classes.selectedButton]: filter === 'TODAY',
              })}
              onClick={() => setFilter('TODAY')}
              fullWidth
            >
              Today
            </Button>
            <Button
              className={clsx(classes.button, {
                [classes.selectedButton]: filter === 'TOMORROW',
              })}
              onClick={() => setFilter('TOMORROW')}
              fullWidth
            >
              Tomorrow
            </Button>
            <Button
              className={clsx(classes.button, {
                [classes.selectedButton]: filter === 'NEXT 7 DAYS',
              })}
              onClick={() => setFilter('NEXT 7 DAYS')}
              fullWidth
            >
              Next 7 days
            </Button>
            <MuiThemeProvider theme={iconsTheme}>
              <ButtonGroupIconButton>
                <AddIcon color="primary" />
              </ButtonGroupIconButton>
            </MuiThemeProvider>
          </div>
        </Toolbar>
      </AppBar>
    </MuiThemeProvider>
  );
};

export default NavBar;

NavBar.propTypes = {
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};
