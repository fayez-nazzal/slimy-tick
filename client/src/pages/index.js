import React from "react"
import Layout from "../components/main/layout"
import { useDispatch, useSelector } from "react-redux"
import { navigate } from "gatsby-link"
import jwtDecode from "jwt-decode"
import { login } from "../redux/user"

const Index = () => {
  const userData = useSelector(state => state.user)
  const dispatch = useDispatch()

  const token = localStorage.getItem("slimy-tick-jwt")

  if (!userData && token) {
    const decodedToken = jwtDecode(token)

    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("jwt")
    } else {
      console.log(decodedToken)
    }
  }

  if (!userData) {
    navigate("/login")
  }

  return <Layout></Layout>
}

export default Index
