import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Customize from './pages/Customize';
import Customize2 from './pages/Customize2';
import Home from './pages/Home';
import { userDataContext } from './context/UserContext';

const App = () => {
  const context = useContext(userDataContext);

  if (!context) {
    return <div>Loading...</div>; // or handle gracefully
  }

  const { userData } = context;

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Home />
          ) : (
            <Navigate to="/customize" replace />
          )
        }
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/customize" replace />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to="/" replace />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/signup" replace />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/signup" replace />}
      />
    </Routes>
  );
};

export default App;
