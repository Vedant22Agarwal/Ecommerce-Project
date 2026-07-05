import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from '../App.jsx'
import {Home, Collection, About, Contact, Product, Cart, Login, PlaceOrder, Order, Verify} from '../pages/index.js'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path= '/' element= {<App/>}>
        <Route index element = {<Home/>} ></Route>
        <Route path='collection' element = {<Collection/>} ></Route>
        <Route path='about' element = {<About/>} ></Route>
        <Route path='contact' element = {<Contact/>} ></Route>
        <Route path='product/:productId' element = {<Product/>} ></Route>
        <Route path='cart' element = {<Cart/>} ></Route>
        <Route path='login' element = {<Login/>} ></Route>
        <Route path='place-order' element = {<PlaceOrder/>} ></Route>
        <Route path='orders' element = {<Order/>} ></Route>
        <Route path='verify' element = {<Verify/>} ></Route>
    </Route>
  )
)

export default router