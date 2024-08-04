import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { useEffect, useState } from 'react';
import { LoginPage } from './pages/LoginPage';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("username", "Rafif");
    localStorage.setItem("password", "PokemonFireRed");
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          {!isLoggedIn ? (
            <Route path='/login' element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          ) :
            <Route path='/quiz' element={<QuizPage />} />
          }
          <Route path="*" element={<Navigate to='/' replace />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
