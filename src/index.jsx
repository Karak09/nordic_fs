import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  createRoutesFromElements,
} from 'react-router-dom';
import './main.css';
import MainLayout from './layout/mainLayout';
import Home from './pages/home';
import About from './pages/about';
import Login from './pages/login';
import Register from './pages/register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [{ index: true, element: <Home></Home> }],
  },
]);

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<MainLayout />}>
//       <Route index element={<Home />} />
//       <Route path="about" element={<About />} />
//       <Route index element={<Login />} />
//       <Route path="register" element={<Register />} />
//     </Route>
//   )
// );

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<RouterProvider router={router} />);
