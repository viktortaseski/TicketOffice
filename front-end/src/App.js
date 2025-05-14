
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import EventPage from './pages/EventPage';
import PurchasePage from './pages/PurchasePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'
import CreateEventPage from './components/create-event/CreateEventPage'
import ValidateOrganizationPage from './components/validate-organization/ValidateOrganizationPage'
import SelectSeatsPage from './pages/select-seats/SelectSeatsPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import CategoryPage from './components/home/CategoryPage';
import MyCartPage from './pages/checkout/MyCartPage';
import ConfirmationPage from './pages/ConfirmationPage';

const App = () => {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/events/:id' element={<EventPage />} />
        <Route path='/purchases' element={<PurchasePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/create-event' element={<CreateEventPage />} />
        <Route path="/validate-organization" element={<ValidateOrganizationPage />} />
        <Route path='/checkout/:id' element={<CheckoutPage />} />
        <Route path='/events/:id/seats' element={<SelectSeatsPage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
        <Route path="/cart" element={<MyCartPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
