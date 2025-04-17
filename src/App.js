
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import Checkout from './checkout/Checkout';
import Home from './Home/Home';
import Dashboardcost from './dashboard/Dashboardcost';
import DashboardAdmin from './dashboard/DashboardAdmin';
import Dashboardappoint from './dashboard/Dashboardappoint';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/Dashboardcosn/user/:userId" element={<Dashboardcost />} />
          <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
          <Route path="/user/:userId/appointments" element={<Dashboardappoint/>} />

        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
