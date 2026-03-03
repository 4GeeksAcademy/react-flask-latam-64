import React, { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"


const LoginForm = () => {

  const { store, actions } = useGlobalReducer()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    const resp = await actions.login(username, password)
    if (resp.error) {
      alert(resp.error)
      return
    }
    alert(resp.message)
  }
  return <form onSubmit={handleSubmit} style={{ width: "400px" }}>
    <div className="mb-3">
      <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
      <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
    </div>
    <div className="mb-3">
      <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
      <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>
    <button type="submit" className="btn btn-primary">Submit</button>
  </form>
}

export default LoginForm