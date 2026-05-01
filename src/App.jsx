import React from 'react'
import './App.css'
import router from './routes'
import { RouterProvider } from 'react-router'
import UseTabMessage from './commonfunction/UseTabMessage'

function App() {
  UseTabMessage()

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
