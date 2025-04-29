
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EventPage from './components/EventPage';
import PurchasePage from './pages/PurchasePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies/:id' element={<EventPage />} />
        <Route path='/purchases' element={<PurchasePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
