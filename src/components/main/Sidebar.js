import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  createMuiTheme,
  MuiThemeProvider,
  makeStyles,
} from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AddBoxSharpIcon from '@material-ui/icons/AddBoxSharp';
import { useDispatch, connect } from 'react-redux';
import AccountBoxSharpIcon from '@material-ui/icons/AccountBoxSharp';
import { setActiveGroupId } from '../../redux/activeGroupId';

const sidebarTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#bedc9b',
    },
  },
});

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  drawer: {
    flexShrink: 1,
    boxSizing: 'border-box',
  },
  drawerPaper: {
    width: (props) => (props.onlySm ? '26vw' : '20vw'),
    background: '#f6f7ff',
    borderRight: '1px #999999 solid',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  columnFlex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    width: '100%',
  },
  largeIcon: {
    transform: 'scale(1.2)',
  },
  accountInfo: {
    display: 'inline-flex',
    flexDirection: 'column',
    marginRight: 'auto',
    justifyContent: 'space-around',
  },
  profilePic: {
    width: '54px',
    height: '54px',
  },
  groupButton: {
    textTransform: 'none',
    fontSize: '20px',
    boxShadow: 'none',
    borderRadius: '0px',
  },
});

const Sidebar = ({
  open, toggle, userData, groups, activeGroupId,
}) => {
  const dispatch = useDispatch();

  const onlySm = useMediaQuery((theme) => theme.breakpoints.only('sm'));
  const classes = useStyles({ onlySm });

  return (
    <MuiThemeProvider theme={sidebarTheme}>
      <Box display={{ xs: 'none', sm: 'block' }}>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.flex}>
            <AccountBoxSharpIcon className={classes.profilePic} />
            <Box flexGrow={1} className={classes.accountInfo}>
              <Typography variant="subtitle1">
                {userData &&
                  userData.email.slice(0, userData.email.indexOf('@'))}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {moment(userData && userData.created)
                  .format('DD-MM-YYYY')
                  .toString()}
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={toggle}>
                {sidebarTheme.direction === 'rtl' ? (
                  <ChevronRightIcon
                    color="primary"
                    className={classes.largeIcon}
                  />
                ) : (
                  <ChevronLeftIcon
                    color="primary"
                    className={classes.largeIcon}
                  />
                )}
              </IconButton>
            </Box>
          </div>
          <div className={classes.flex}>
            <Box flexGrow={1}>
              <Typography variant="h5" color="textSecondary">
                Groups
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <AddBoxSharpIcon color="primary" />
              </IconButton>
            </Box>
          </div>
          <div className={classes.columnFlex}>
            {
              groups.map((group, index) => (
                <Button
                  key={group.id}
                  onClick={() => dispatch(setActiveGroupId(index))}
                  className={classes.groupButton}
                  variant={
                    activeGroupId && group.id === activeGroupId
                      ? 'contained'
                      : 'text'
                  }
                  color={
                    activeGroupId && group.id === activeGroupId
                      ? 'primary'
                      : 'none'
                  }
                  fullWidth
                >
                  {group.name}
                </Button>
              ))
}
          </div>
        </Drawer>
      </Box>
    </MuiThemeProvider>
  );
};

const mapStateToProps = (state) => ({
  activeGroupId: state.activeGroupId,
  groups: state.groups,
  userData: state.user,
});

export default connect(mapStateToProps)(Sidebar);

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    email: PropTypes.string,
    created: PropTypes.string,
  }).isRequired,
  activeGroupId: PropTypes.string.isRequired,
  groups: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })).isRequired,
};
