import React from "react"
import { action } from "@storybook/addon-actions"
import "@storybook/addon-console"
import { withInfo } from "@storybook/addon-info"
import { withKnobs } from "@storybook/addon-knobs"
import { useDispatch } from "react-redux"
import WrapRootElement from "../src/wrap-root-element"
import { useLayoutEffect } from "react"
import { LOGIN_USER } from "../src/apollo/queries"
import { useMutation } from "@apollo/client"
import { login as globalLogin } from "../src/redux/user"
import "../src/styles/global.css"

const withProviders = Story => <WrapRootElement element={<Story />} />

const withUser = Story => {
  const dispatch = useDispatch()
  const [login, { loading, data }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: userData } }) {
      dispatch(globalLogin(userData))
    },
    onError(err) {
      console.log(JSON.stringify(err, null, 2))
    },
    variables: {
      email: "fayeznazzal98@gmail.com",
      password: "123123",
    },
  })

  useLayoutEffect(() => {
    login()
  }, [])

  return <div>{loading || !data ? "loading" : <Story />}</div>
}

export const decorators = [withInfo, withKnobs, withUser, withProviders]

// Gatsby's Link overrides:
// Gatsby Link calls the `enqueue` & `hovering` methods on the global variable ___loader.
// This global object isn't set in storybook context, requiring you to override it to empty functions (no-op),
// so Gatsby Link doesn't throw any errors.
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
}
// This global variable is prevents the "__BASE_PATH__ is not defined" error inside Storybook.
global.__BASE_PATH__ = "/"
// Navigating through a gatsby app using gatsby-link or any other gatsby component will use the `___navigate` method.
// In Storybook it makes more sense to log an action than doing an actual navigate. Checkout the actions addon docs for more info: https://github.com/storybookjs/storybook/tree/master/addons/actions.
window.___navigate = pathname => {
  action("NavigateTo:")(pathname)
}
