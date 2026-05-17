// App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Gearbox from "./pages/Gearbox/Gearbox";
import Layout from "./components/Layout";
import Halazooni from "./pages/Halazooni/Halazooni";
import Product from "./pages/Product/Product";
import ModelUploader from "./components/ModelUploader";
import AddProduct from "./components/addproduct";
import Example from "./components/example";
import CartIcon from "./components/CartIcon";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import CartDrawer from "./pages/Cart/Cart";
import Checkout from "./components/CheckOut";
import Login from "./pages/Auth/Auth";
import UserPanel from "./pages/UserPanel/UserPanel";
import EditProduct from "./components/EditProduct";
import ElectroMotor from "./pages/ElectroMotor/Electromotor";
import Searchedproducts from "./pages/SearchedProducts/SearchedProducts";
import Chini from "./pages/ElectroMotor/Chini/Chini";
import Motogen from "./pages/ElectroMotor/Motogen/Motogen";
import Tajhizat from "./pages/Tajhizat/page";
import Stock from "./pages/Stock/Stock";
import StockProducts from "./pages/StockProducts/StockProducts";
import AdminLogin from "./pages/admin/Login/Login";
import AddAdmin from "./pages/admin/AddAdmin/AddAdmin";
import ForgotPassword from "./pages/admin/ForgotPassword/ForgotPassword";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
function App() {
  return (
    <ShoppingCartProvider>
      <BrowserRouter>
        <CartIcon />        
        <CartDrawer />
        
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit/:id" element={<EditProduct />} />
            <Route path="products" element={<Searchedproducts />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/userpanel" element={<UserPanel />} />
            <Route path="/cart" element={<Checkout />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/add/admin" element={<AddAdmin />} />
            <Route path="/دسته-بندی-محصولات/محصولات-استوک/:slug/:id" element={<StockProducts />} />
            <Route path="/تجهیزات-انتقال-قدرت" element={<Tajhizat />} />
            <Route path="/دسته-بندی-محصولات/:slug/:id" element={<Example />} />
            <Route path="/دسته-بندی-محصولات/:slug/:slug/:id" element={<Example />} />
            <Route path="/دسته-بندی-محصولات/:slug/:slug/:slug/:id" element={<Example />} />
            <Route path="/modeluploader" element={<ModelUploader />} />
            <Route path="/دسته-بندی-محصولات/استوک" element={<Stock />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/گیربکس/گیربکس-حلزونی" element={<Halazooni />} />
            {/* <Route path="/گیربکس/حلزونی/:slug/:id" element={<NMRVMorakab />} /> */}
            <Route path="/گیربکس" element={<Gearbox />} />
            <Route path="/الکتروموتور" element={<ElectroMotor />} />
            <Route path="/الکتروموتور/چینی" element={<Chini />} />
            <Route path="/الکتروموتور/موتوژن" element={<Motogen />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ShoppingCartProvider>
  );
}

export default App;