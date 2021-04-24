import React from "react"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import Login from "./login"
import WrapRootElement from "../wrap-root-element"
import { MockedProvider } from "@apollo/client/testing"
import { LOGIN_USER } from "../apollo/queries"
import { UserInputError } from "apollo-server-core"

describe("input elements", () => {
  let loginPage
  const mocks = [
    {
      request: {
        query: LOGIN_USER,
        variables: {
          email: "",
          password: "",
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
        query: LOGIN_USER,
        variables: {
          email: "wrong@email..com",
          password: "",
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
  ]

  beforeEach(() => {
    loginPage = render(
      <WrapRootElement
        element={
          <MockedProvider mocks={mocks} addTypename={false}>
            <Login />
          </MockedProvider>
        }
      />
    )
  })

  afterEach(() => {
    cleanup()
  })

  it("email input set value correctly", () => {
    const emailInput = loginPage.getByLabelText("email")

    fireEvent.change(emailInput, {
      target: {
        value: "test",
      },
    })

    expect(emailInput.value).toMatch(/^test$/i)
  })

  it("displays an error when no email is entered", async () => {
    const loginButton = loginPage.getByTestId("login-button")

    fireEvent.click(loginButton)

    const emailErrorMessage = await waitFor(() =>
      loginPage.getByText(/email must not be empty/i)
    )

    expect(emailErrorMessage).toBeTruthy
  })

  it("displays an error when no password is entered", async () => {
    const loginButton = loginPage.getByTestId("login-button")

    fireEvent.click(loginButton)

    const passwordErrorMessage = await waitFor(() =>
      loginPage.getByText(/password must not be empty/i)
    )

    expect(passwordErrorMessage).toBeTruthy
  })

  it("displays an error when no email is entered", async () => {
    const emailInput = loginPage.getByLabelText("email")

    fireEvent.change(emailInput, {
      target: {
        value: "wrong@email..com",
      },
    })

    const loginButton = loginPage.getByTestId("login-button")

    fireEvent.click(loginButton)

    const emailError = await waitFor(() =>
      loginPage.getByText(/email not valid/i)
    )

    expect(emailError).toBeTruthy()
  })
})
