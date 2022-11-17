import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import App from './App'
import NewPost from './components/NewPost';
import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/create-post', element: <NewPost /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
