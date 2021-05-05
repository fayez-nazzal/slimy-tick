import React from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store';

const Provider = ({ children }) => (
  <ReduxProvider store={store}>{children}</ReduxProvider>
);

export default Provider;

Provider.propTypes = {
  children: PropTypes.element.isRequired,
};
