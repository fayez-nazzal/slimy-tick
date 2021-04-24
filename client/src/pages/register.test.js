import React from "react"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import RegisterPage from "./register"
import WrapRootElement from "../wrap-root-element"
import { MockedProvider } from "@apollo/client/testing"
import { REGISTER_USER } from "../apollo/queries"
import { UserInputError } from "apollo-server-core"

describe("register input elements", () => {
  let registerPage
  const mocks = [
    {
      request: {
        query: REGISTER_USER,
        variables: {
          email: "",
          password: "",
          confirmPassword: "",
        },
      },
      result: {
        errors: [
          new UserInputError("Error", {
            errors: {
              email: "Email must not be empty",
              password: "Password must not be empty",
            },
          }),
        ],
      },
    },
    {
      request: {
        query: REGISTER_USER,
        variables: {
          email: "wrong@email..com",
          password: "",
          confirmPassword: "",
        },
      },
      result: {
        errors: [
          new UserInputError("Error", {
            errors: {
              email: "Email not valid",
            },
          }),
        ],
      },
    },
    {
      request: {
        query: REGISTER_USER,
        variables: {
          email: "correct@email.com",
          password: "123",
          confirmPassword: "321",
        },
      },
      result: {
        errors: [
          new UserInputError("Error", {
            errors: {
              confirmPassword: "Passwords must match",
            },
          }),
        ],
      },
    },
  ]

  beforeEach(() => {
    registerPage = render(
      <WrapRootElement
        element={
          <MockedProvider mocks={mocks} addTypename={false}>
            <RegisterPage />
          </MockedProvider>
        }
      />
    )
  })

  afterEach(() => {
    cleanup()
  })

  it("email input set value correctly", () => {
    const emailInput = registerPage.getByLabelText("email")

    fireEvent.change(emailInput, {
      target: {
        value: "test",
      },
    })

    expect(emailInput.value).toMatch(/^test$/i)
  })

  it("displays an error when no email is entered", async () => {
    const loginButton = registerPage.getByTestId("register-button")

    fireEvent.click(loginButton)

    const emailErrorMessage = await waitFor(() =>
      registerPage.getByText(/email must not be empty/i)
    )

    expect(emailErrorMessage).toBeTruthy
  })

  it("displays an error when no password is entered", async () => {
    const registerButton = registerPage.getByTestId("register-button")

    fireEvent.click(registerButton)

    const passwordErrorMessage = await waitFor(() =>
      registerPage.getByText(/password must not be empty/i)
    )

    expect(passwordErrorMessage).toBeTruthy
  })

  it("displays an error when no email is entered", async () => {
    const emailInput = registerPage.getByLabelText("email")

    fireEvent.change(emailInput, {
      target: {
        value: "wrong@email..com",
      },
    })

    const registerButton = registerPage.getByTestId("register-button")

    fireEvent.click(registerButton)

    const emailError = await waitFor(() =>
      registerPage.getByText(/email not valid/i)
    )

    expect(emailError).toBeTruthy()
  })

  it("displays error when passwords don't match", async () => {
    const emailInput = registerPage.getByLabelText("email")
    const passwordInput = registerPage.getByLabelText("password")
    const confirmPasswordInput = registerPage.getByLabelText("confirm password")

    fireEvent.change(emailInput, {
      target: {
        value: "correct@email.com",
      },
    })

    fireEvent.change(passwordInput, {
      target: {
        value: "123",
      },
    })

    fireEvent.change(confirmPasswordInput, {
      target: {
        value: "321",
      },
    })

    const registerButton = registerPage.getByTestId("register-button")

    fireEvent.click(registerButton)

    const noMatchError = await waitFor(() =>
      registerPage.getByText(/passwords must match/i)
    )

    expect(noMatchError).toBeTruthy()
  })
})
