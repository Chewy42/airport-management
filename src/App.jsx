import "./App.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "./Contexts/AuthContext";

import Homepage from "./Components/Homepage";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Dashboard from "./Components/Dashboard";
import Booking from "./Components/Booking";

function App() {
  // FOR AUTHENTICATION AND PUBLIC/PRIVATE ROUTES
  const { isAuthenticated } = useContext(AuthContext);

  const PublicRoute = ({ element }) => {
    return !isAuthenticated ? element : <Navigate to="/dashboard" replace />;
  };

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/signin" replace />;
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute element={<Homepage />} />} />
          <Route path="/signin" element={<PublicRoute element={<SignIn />} />} />
          <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/dashboard/booking" element={<PrivateRoute element={<Booking />} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
