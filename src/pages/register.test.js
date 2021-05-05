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
import RegisterPage from './register';
import WrapRootElement from '../wrap-root-element';
import registerMocks from '../../__mocks__/register-mocks';

describe('register input elements', () => {
  let registerPage;
  const component = (
    <WrapRootElement
      element={(
        <MockedProvider mocks={registerMocks} addTypename={false}>
          <RegisterPage />
        </MockedProvider>
      )}
    />
  );

  beforeEach(() => {
    registerPage = render(component);
  });

  afterEach(() => {
    cleanup();
  });

  it('matches the snapshot', () => {
    const tree = renderer.create(component).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('email input set value correctly', () => {
    const emailInput = registerPage.getByLabelText('email');

    fireEvent.change(emailInput, {
      target: {
        value: 'test',
      },
    });

    expect(emailInput.value).toMatch(/^test$/i);
  });

  it('displays an error when no email is entered', async () => {
    const loginButton = registerPage.getByTestId('register-button');

    fireEvent.click(loginButton);

    const emailErrorMessage = await waitFor(() => registerPage.getByText(/email must not be empty/i));

    expect(emailErrorMessage).toBeTruthy;
  });

  it('displays an error when no password is entered', async () => {
    const registerButton = registerPage.getByTestId('register-button');

    fireEvent.click(registerButton);

    const passwordErrorMessage = await waitFor(() => registerPage.getByText(/password must not be empty/i));

    expect(passwordErrorMessage).toBeTruthy;
  });

  it('displays an error when no email is entered', async () => {
    const emailInput = registerPage.getByLabelText('email');

    fireEvent.change(emailInput, {
      target: {
        value: 'wrong@email..com',
      },
    });

    const registerButton = registerPage.getByTestId('register-button');

    fireEvent.click(registerButton);

    const emailError = await waitFor(() => registerPage.getByText(/email not valid/i));

    expect(emailError).toBeTruthy();
  });

  it("displays error when passwords don't match", async () => {
    const emailInput = registerPage.getByLabelText('email');
    const passwordInput = registerPage.getByLabelText('password');
    const confirmPasswordInput = registerPage.getByLabelText(
      'confirm password',
    );

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

    fireEvent.change(confirmPasswordInput, {
      target: {
        value: 'valid.password',
      },
    });

    const registerButton = registerPage.getByTestId('register-button');

    fireEvent.click(registerButton);

    const noMatchError = await waitFor(() => registerPage.getByText(/passwords must match/i));

    expect(noMatchError).toBeTruthy();
  });

  it('show error for short passwords', async () => {
    const emailInput = registerPage.getByLabelText('email');
    const passwordInput = registerPage.getByLabelText('password');
    const confirmPasswordInput = registerPage.getByLabelText(
      'confirm password',
    );

    fireEvent.change(emailInput, {
      target: {
        value: 'correct@email.com',
      },
    });

    fireEvent.change(passwordInput, {
      target: {
        value: '123',
      },
    });

    fireEvent.change(confirmPasswordInput, {
      target: {
        value: '123',
      },
    });

    const registerButton = registerPage.getByTestId('register-button');

    fireEvent.click(registerButton);

    const lengthError = await waitFor(() => registerPage.getByText(/Pasword must have 6 or more characters/i));

    expect(lengthError).toBeTruthy();
  });

  it('register successfuly when correct info provided', async () => {
    Object.defineProperty(window, '___navigate', { value: jest.fn() });
    const emailInput = registerPage.getByLabelText('email');
    const passwordInput = registerPage.getByLabelText('password');
    const confirmPasswordInput = registerPage.getByLabelText(
      'confirm password',
    );

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

    fireEvent.change(confirmPasswordInput, {
      target: {
        value: 'valid password',
      },
    });

    const registerButton = registerPage.getByTestId('register-button');

    fireEvent.click(registerButton);

    const validErrors = await waitFor(() => screen.queryAllByText(/not valid/i));
    const emptyErrors = await waitFor(() => screen.queryAllByAltText(/must not be empty/i));
    const matchErrors = await waitFor(() => screen.queryAllByAltText(/must match/i));

    expect(validErrors.length).toBe(0);
    expect(emptyErrors.length).toBe(0);
    expect(matchErrors.length).toBe(0);
  });
});
