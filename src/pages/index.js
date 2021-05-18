import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { navigate } from 'gatsby-link';
import jwtDecode from 'jwt-decode';
import { Helmet } from 'react-helmet';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from 'clsx';
import { graphql } from 'gatsby';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useMutation } from '@apollo/client';
import { userSelector } from '../redux/selectors';
import Navbar from '../components/main/Navbar';
import Sidebar from '../components/main/Sidebar';
import TaskList from '../components/main/TaskList';
import PriorityTabs from '../components/PriorityTabs';
import NewTaskInput from '../components/NewTaskInput';
import { REFRESH_LOGIN_USER } from '../apollo/queries';
import { login as globalLogin } from '../redux/user';
import DateTimePicker from '../components/DateTimePicker';
import RepeatMenu from '../components/menus/RepeatMenu';
import CustomRepeatPopover from '../components/menus/CustomRepeatPopover';
import PriorityMenu from '../components/menus/PriorityMenu';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh',
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: (props) => ((props.onlySm && '26vw') || (props.sm && '20vw') || 0),
  },
  padded: {
    padding: theme.spacing(1.25),
  },
}));

const Index = ({ data, loggedIn }) => {
  const sm = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const onlySm = useMediaQuery((theme) => theme.breakpoints.only('sm'));
  const classes = useStyles({ sm, onlySm });
  const dispatch = useDispatch();
  const [drawerOpen, setOpen] = React.useState(true);
  const [filter, setFilter] = React.useState('ALL');

  const [refreshLogin] = useMutation(REFRESH_LOGIN_USER, {
    update(proxy, { data: { refreshLogin: userData } }) {
      dispatch(globalLogin({ ...userData }));
    },
    onError(err) {
      console.log(err);
    },
  });

  useLayoutEffect(() => {
    refreshLogin();
    setInterval(() => {
      refreshLogin();
    }, 39000);
  }, []);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{data.site.siteMetadata.title}</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Helmet>
      <CssBaseline />
      <Navbar
        toggleDrawer={toggleDrawer}
        drawerOpen={drawerOpen}
        filter={filter}
        setFilter={setFilter}
      />
      <Sidebar open={drawerOpen} toggle={toggleDrawer} />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: drawerOpen,
        })}
      >
        <div className={classes.padded}>
          <NewTaskInput />
          <TaskList />
          <DateTimePicker />
          <RepeatMenu />
          <CustomRepeatPopover />
          <PriorityMenu />

        </div>
        <PriorityTabs />
      </main>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loggedIn: !!userSelector(state).email,
});

export default connect(mapStateToProps)(Index);

Index.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string,
      }),
    }),
  }).isRequired,
  loggedIn: PropTypes.bool.isRequired,
};

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
