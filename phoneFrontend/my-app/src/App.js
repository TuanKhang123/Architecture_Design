import './App.css';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getCart } from './components/feature/cart/cartSlice';

import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ForgotPassword from './pages/forgotpassword/ForgotPassword';
import ChangePassword from './pages/changepassword/ChangePassword';
import ProductsDetail from './pages/productsdetail/ProductsDetail';
import Detailbill from './pages/detailbill/Detailbill';
import Cart from './pages/cart/Cart';
import Orderinfo from './pages/orderinfo/Orderinfo';
import Cartthanks from './pages/cartthanks/Cartthanks';
import Profile from './pages/profile/Profile';
import ProductsModifier from './pages/productsmodifier/ProductsModifier';
import AdminRegister from './pages/adminregister/AdminRegister';
import PrivateRoute from './components/hook/PrivateRoute';
import PrivateRouteAdmin from './components/hook/PrivateRouteAdmin';

import ProductList from './pages/productlist/ProductList';
import Category from './pages/category/Category';
import { ToastContainer } from 'react-toastify';
import ListFavourite from './pages/listfavourite/ListFavourite';
import AdminChatManagement from './pages/adminchatmanagement/AdminChatManagement';
import ChatDetail from './pages/chatdetail/ChatDetail';
import DashBoard from './pages/dashboard/DashBoard';

export default function App() {
  const accessToken = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');
  const dispatch = useDispatch();
  const currentPath = window.location.pathname;
  const check = ['/admin/productsmodifier', '/admin/dashboard', '/admin/productlist', '/admin/chatdetail'].includes(
    currentPath
  );

  if (check && role === 'user') {
    window.location.href = '/';
  }

  useEffect(() => {
    dispatch(getCart({ accessToken }));
  }, []);

  return (
    <>
      <Router>
        <div className='App'>
          <Routes>
            <Route
              path='/admin/register'
              element={<AdminRegister />}
            />
            <Route
              path='/login'
              element={<Login />}>

            </Route>

            <Route
              path='/register'
              element={<Register />}>
            </Route>

            <Route
              path='/forgotpassword'
              element={<ForgotPassword />}></Route>
            <Route
              path='/changepassword/:accessToken'
              element={<ChangePassword />}></Route>
            {/* Visitor */}

            <Route
              path='/'
              element={<Home />}></Route>
            <Route
              path='/category/:id'
              element={<Category />}></Route>

            <Route
              path='/productsdetail/:id'
              element={<ProductsDetail />}></Route>

            {/* user */}
            <Route
              path='/'
              element={<PrivateRoute />}
            >
              <Route
                path='/cart'
                element={<Cart />}></Route>
              <Route
                path='/profile'
                element={<Profile />}></Route>
              <Route
                path='/orderinfo'
                element={<Orderinfo />}></Route>
              <Route
                path='/detailbill'
                element={<Detailbill />}></Route>
              <Route
                path='/cartthanks'
                element={<Cartthanks />}></Route>
              <Route
                path='/listfavourite'
                element={<ListFavourite />}></Route>
            </Route>

            {/* admin */}
            <Route
              path='/admin'
              element={<PrivateRouteAdmin />}>
              <Route
                path='/admin/productsmodifier'
                element={<ProductsModifier />}
              />
              <Route
                path='/admin/dashboard'
                element={<DashBoard />}></Route>
              <Route
                path='/admin/productlist'
                element={<ProductList />}></Route>
              <Route
                path='/admin/chatdetail'
                element={<ChatDetail />}></Route>
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}
