import React, { useEffect, useLayoutEffect, useState } from "react"
import { storiesOf } from "@storybook/react"
import WrapRootElement from "../../src/wrap-root-element"
import { LOGIN_USER } from "../../src/apollo/queries"
import { useMutation } from "@apollo/client"
import { login as globalLogin } from "../../src/redux/user"
import TodoInput from "../../src/components/TodoInput"
import { useDispatch } from "react-redux"

const withProviders = story => <WrapRootElement element={story()} />

const TodoInputWithUser = () => {
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

  return <div>{loading || !data ? "loading" : <TodoInput />}</div>
}

storiesOf("TODO Input", module)
  .addDecorator(withProviders)
  .add("default", () => <TodoInputWithUser />)
