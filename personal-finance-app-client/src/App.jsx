import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import axios from 'axios';
// import './App.css'

axios.defaults.baseURL = 'http://localhost:8000'

function App() {
  useEffect(() => {
    async function fetch() {
      const response = await axios.post( '/create_link_token');
      console.log("response", response.data);
    }
    fetch();
  }, []);

  return (
    <span>Hello World!</span>
  )
}

export default App
