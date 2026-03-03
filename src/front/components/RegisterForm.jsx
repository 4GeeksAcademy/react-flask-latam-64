import React, { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"


const RegisterForm = () => {

  const { actions } = useGlobalReducer()

  async function handleSubmit(e) {
    e.preventDefault()
    const formValues = new FormData(e.target)
    const user = {}
    formValues.forEach((value, key) => user[key] = value)
    const resp = await actions.registerUser(user)
    if (resp.error) {
      alert(resp.error)
      return
    }
    alert(resp.message)
  }
  return <form onSubmit={handleSubmit} style={{ width: "400px" }}>
    <div className="mb-3">
      <label className="form-label">Username</label>
      <input name="username" required type="text" className="form-control" />
    </div>
    <div className="mb-3">
      <label className="form-label">Password</label>
      <input name="password" required type="password" className="form-control" />
    </div>
    <div className="mb-3">
      <label className="form-label">Full name</label>
      <input name="full_name" type="text" className="form-control" />
    </div>
    <div className="mb-3">
      <label className="form-label">Address</label>
      <input name="address" type="text" className="form-control" />
    </div>
    <button type="submit" className="btn btn-primary">Submit</button>
  </form>
}

export default RegisterForm