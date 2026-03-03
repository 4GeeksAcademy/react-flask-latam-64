import React, { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import LoginForm from "./LoginForm"
import RegisterForm from "./RegisterForm"

const UserDropdown = () => {


  return <div className="dropdown dropstart">
    <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
      Access
    </button>
    <div className="dropdown-menu p-4">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#login" type="button" role="tab" aria-controls="login" aria-selected="true">Login</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#register" type="button" role="tab" aria-controls="register" aria-selected="false">Register</button>
        </li>

      </ul>
      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="home-tab" tabIndex="0"><LoginForm /></div>
        <div className="tab-pane fade" id="register" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0"><RegisterForm /></div>
      </div>
    </div>
  </div>
}

export default UserDropdown