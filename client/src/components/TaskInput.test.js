import React from "react"
import {
  render,
  cleanup,
  createEvent,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react"
import WrapRootElement from "../wrap-root-element"
import { MockedProvider } from "@apollo/client/testing"
import taskMocks from "../../__mocks__/task-mocks"
import loginMocks from "../../__mocks__/login-mocks"
import renderer from "react-test-renderer"
import taskInput from "./taskInput"
import { useDispatch } from "react-redux"
import { useLayoutEffect } from "react"
import { LOGIN_USER } from "../apollo/queries"
import { useMutation } from "@apollo/client"
import { login as globalLogin } from "../redux/user"
import DateTimePicker from "./DateTimePicker"
import moment from "moment"

const WithUser = ({ children }) => {
  const dispatch = useDispatch()
  const [login, { loading, data }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: userData } }) {
      dispatch(globalLogin(userData))
    },
    onError(err) {
      console.log(JSON.stringify(err, null, 2))
    },
    variables: {
      email: "correct@email.com",
      password: "valid password",
    },
  })

  useLayoutEffect(() => {
    login()
  }, [])

  return (
    <div>
      {loading || !data ? (
        "loading"
      ) : (
        <>
          <taskInput />
          <DateTimePicker />
        </>
      )}
    </div>
  )
}

describe("task Input element", () => {
  let taskInput
  let draftInput

  const component = (
    <WrapRootElement
      element={
        <MockedProvider
          mocks={[...taskMocks, ...loginMocks]}
          addTypename={false}
        >
          <WithUser />
        </MockedProvider>
      }
    />
  )

  beforeEach(async () => {
    taskInput = render(component)
    const loadingText = await waitFor(() => taskInput.getByText("loading"))

    expect(loadingText).toBeInTheDocument()

    draftInput = await waitFor(() => taskInput.getByLabelText("task input"))
  })

  afterEach(() => {
    cleanup()
  })

  it("changes text correctly", async () => {
    const event = createEvent.paste(draftInput, {
      clipboardData: {
        types: ["text/plain"],
        getData: () => "sample text",
      },
    })

    fireEvent(draftInput, event)

    await waitFor(() => {
      expect(draftInput.innerHTML).toMatch(/sample text/)
    })
  })

  it("sets priority via regex (very high)", async () => {
    const event = createEvent.paste(draftInput, {
      clipboardData: {
        types: ["text/plain"],
        getData: () => "!!!",
      },
    })

    fireEvent(draftInput, event)

    const veryHighPrioritySpan = screen.queryByTestId("draft-priority-1")
    const highPrioritySpan = screen.queryByTestId("draft-priority-2")
    const mediumPrioritySpan = screen.queryByTestId("draft-priority-3")

    await waitFor(() => {
      expect(veryHighPrioritySpan).toBeTruthy()
      expect(highPrioritySpan).toBeFalsy()
      expect(mediumPrioritySpan).toBeFalsy()
    })
  })

  it("sets priority via regex (high)", async () => {
    const event = createEvent.paste(draftInput, {
      clipboardData: {
        types: ["text/plain"],
        getData: () => "!!",
      },
    })

    fireEvent(draftInput, event)

    const veryHighPrioritySpan = screen.queryByTestId("draft-priority-1")
    const highPrioritySpan = screen.queryByTestId("draft-priority-2")
    const mediumPrioritySpan = screen.queryByTestId("draft-priority-3")

    await waitFor(() => {
      expect(veryHighPrioritySpan).toBeFalsy()
      expect(highPrioritySpan).toBeTruthy()
      expect(mediumPrioritySpan).toBeFalsy()
    })
  })

  it("sets priority via regex (medium)", async () => {
    const event = createEvent.paste(draftInput, {
      clipboardData: {
        types: ["text/plain"],
        getData: () => "!",
      },
    })

    fireEvent(draftInput, event)

    const veryHighPrioritySpan = screen.queryByTestId("draft-priority-1")
    const highPrioritySpan = screen.queryByTestId("draft-priority-2")
    const mediumPrioritySpan = screen.queryByTestId("draft-priority-3")

    await waitFor(() => {
      expect(veryHighPrioritySpan).toBeFalsy()
      expect(highPrioritySpan).toBeFalsy()
      expect(mediumPrioritySpan).toBeTruthy()
    })
  })

  it("sets due date via regex MM-DD-YYYY format", async () => {
    const event = createEvent.paste(draftInput, {
      clipboardData: {
        types: ["text/plain"],
        getData: () => "12-25-2025",
      },
    })

    fireEvent(draftInput, event)

    let dueDate = screen.queryByTestId("draft-duedate")

    await waitFor(() => {
      expect(dueDate).toBeTruthy()
    })
  })

  it("sets due date via regex MMM DD, YYYY", async () => {
    const event = createEvent.paste(draftInput, {
      clipboardData: {
        types: ["text/plain"],
        getData: () => "Apr 25, 2025",
      },
    })

    fireEvent(draftInput, event)

    let dueDate = screen.queryByTestId("draft-duedate")

    await waitFor(() => {
      expect(dueDate).toBeTruthy()
    })
  })

  it("sets due via regex then menu -> change existing regex", async () => {
    const event = createEvent.paste(draftInput, {
      clipboardData: {
        types: ["text/plain"],
        getData: () => "12-10-2025",
      },
    })

    fireEvent(draftInput, event)

    let dueDate = screen.queryByTestId("draft-duedate")

    await waitFor(() => {
      expect(dueDate).toBeTruthy()
    })

    const dueButton = taskInput.getByTestId("due-button")

    fireEvent.click(dueButton)

    await waitFor(() => {
      const rightArrowButton = taskInput.getByTestId(
        "datetimepicker-rightarrow"
      )

      fireEvent.click(rightArrowButton)
    })

    await waitFor(() => {
      const day2thOfNextMonth = taskInput.getByTestId("day-20")

      fireEvent.click(day2thOfNextMonth)
    })

    await waitFor(() => {
      const okButton = taskInput.getByText(/ok/i)

      fireEvent.click(okButton)
    })

    dueDate = screen.queryByTestId("draft-duedate")

    await waitFor(() => {
      expect(dueDate.innerHTML.toLowerCase()).not.toMatch(/12-10-2025/i)
      expect(dueDate.innerHTML.toLowerCase()).toMatch(/\w\w\w 20, \d\d\d\d/i)
    })
  })

  it("sets priority via regex then via menu replaces the regex content", async () => {
    const event = createEvent.paste(draftInput, {
      clipboardData: {
        types: ["text/plain"],
        getData: () => "!!!",
      },
    })

    fireEvent(draftInput, event)

    let veryHighPrioritySpan = screen.queryByTestId("draft-priority-1")
    let mediumPrioritySpan = screen.queryByTestId("draft-priority-3")

    await waitFor(() => {
      expect(veryHighPrioritySpan).toBeTruthy()
      expect(mediumPrioritySpan).toBeFalsy()
    })

    const priorityButton = taskInput.getByTestId("priority-button")

    fireEvent.click(priorityButton)

    await waitFor(() => {
      const priorityMediumMenuItem = taskInput.getByTestId(
        "menuitem-priority-medium"
      )

      fireEvent.click(priorityMediumMenuItem)
    })

    veryHighPrioritySpan = screen.queryByTestId("draft-priority-1")
    mediumPrioritySpan = screen.queryByTestId("draft-priority-3")

    await waitFor(() => {
      expect(veryHighPrioritySpan).toBeFalsy()
      expect(mediumPrioritySpan).toBeTruthy()
    })
  })

  it("sets due time via regex 2:00 AM", async () => {
    const event = createEvent.paste(draftInput, {
      clipboardData: {
        types: ["text/plain"],
        getData: () => ">>>>>>2:00 AM<<<<<<<",
      },
    })

    fireEvent(draftInput, event)

    let dueTimeStrategy = screen.queryByTestId("draft-duetime")

    await waitFor(() => {
      expect(dueTimeStrategy).toBeTruthy()
    })
  })
})
