import React from 'react'
import List from './main/List'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
    <div className='flex-col h-screen bg-pink-300'>
      <ToastContainer position="top-right" />
      <List/>
    </div>
  )
}

export default App
