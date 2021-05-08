import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import renderer from 'react-test-renderer';
import Login from './login';
import WrapRootElement from '../wrap-root-element';
import lgoinMocks from '../../__mocks__/login-mocks';

describe('login input elements', () => {
  let loginPage;
  const component = (
    <WrapRootElement
      element={(
        <MockedProvider mocks={lgoinMocks} addTypename={false}>
          <Login />
        </MockedProvider>
      )}
    />
  );

  beforeEach(() => {
    loginPage = render(component);
  });

  afterEach(() => {
    cleanup();
  });

  it('matches the snapshot', () => {
    const tree = renderer.create(component).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('email input set value correctly', () => {
    const emailInput = loginPage.getByLabelText('email');

    fireEvent.change(emailInput, {
      target: {
        value: 'test',
      },
    });

    expect(emailInput.value).toMatch(/^test$/i);
  });

  it('displays an error when no email is entered', async () => {
    const loginButton = loginPage.getByTestId('login-button');

    fireEvent.click(loginButton);

    const emailErrorMessage = await waitFor(() => loginPage.getByText(/email must not be empty/i));

    expect(emailErrorMessage).toBeTruthy();
  });

  it('displays an error when no password is entered', async () => {
    const loginButton = loginPage.getByTestId('login-button');

    fireEvent.click(loginButton);

    const passwordErrorMessage = await waitFor(() => loginPage.getByText(/password must not be empty/i));

    expect(passwordErrorMessage).toBeTruthy();
  });

  it('displays an error when no email is entered', async () => {
    const emailInput = loginPage.getByLabelText('email');

    fireEvent.change(emailInput, {
      target: {
        value: 'wrong@email..com',
      },
    });

    const loginButton = loginPage.getByTestId('login-button');

    fireEvent.click(loginButton);

    const emailError = await waitFor(() => loginPage.getByText(/email not valid/i));

    expect(emailError).toBeTruthy();
  });

  it('incorrect password error', async () => {
    const emailInput = loginPage.getByLabelText('email');
    const passwordInput = loginPage.getByLabelText('password');

    fireEvent.change(emailInput, {
      target: {
        value: 'correct@email.com',
      },
    });

    fireEvent.change(passwordInput, {
      target: {
        value: 'incorrect password',
      },
    });

    const loginButton = loginPage.getByTestId('login-button');

    fireEvent.click(loginButton);

    const error = await waitFor(() => loginPage.getByText(/wrong credentials/i));

    expect(error).toBeTruthy();
  });

  it('login successfuly when correct info provided', async () => {
    Object.defineProperty(window, '___navigate', { value: jest.fn() });
    const emailInput = loginPage.getByLabelText('email');
    const passwordInput = loginPage.getByLabelText('password');

    fireEvent.change(emailInput, {
      target: {
        value: 'correct@email.com',
      },
    });

    fireEvent.change(passwordInput, {
      target: {
        value: 'valid password',
      },
    });

    const loginButton = loginPage.getByTestId('login-button');

    fireEvent.click(loginButton);

    const notValidError = await waitFor(() => screen.queryAllByText(/not valid/i));
    const emptyError = await waitFor(() => screen.queryAllByAltText(/must not be empty/i));

    expect(notValidError.length).toBe(0);
    expect(emptyError.length).toBe(0);
  });
});
