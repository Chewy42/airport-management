import './App.css';
import {
  BrowserRouter as Router,
  //Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Homepage from './Components/Homepage';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';

function App() {

  // FOR AUTHENTICATION AND PUBLIC/PRIVATE ROUTES
  // const { isAuthenticated } = useContext(AuthContext);

  // const PublicRoute = ({ element }) => {
  //   return !isAuthenticated ? element : <Navigate to="/dashboard" replace />;
  // };

  // const PrivateRoute = ({ element }) => {
  //   return isAuthenticated ? element : <Navigate to="/signin" replace />;
  // };

  return (
      <>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
      </>
  );
}

export default App;
