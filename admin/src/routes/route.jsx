import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router'
import App from '../App.jsx'
import { Add, List, Orders } from "../pages/index.js"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='add' element={<Add />}></Route>
      <Route path='list' element={<List />}></Route>
      <Route path='orders' element={<Orders />}></Route>
    </Route>
  )
)

export default router