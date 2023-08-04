import { useState , useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import './App.css'
import Cookies from 'js-cookie';
import Header from './components/Header';
import LoginModal from '../src/components/LoginModal';
import SignupModal from '../src/components/SignupModal';
import CharactersPage from '../src/components/CharactersPage';
import CharacterDetailPage from '../src/components/CharacterDetailPage';
import FavoritesPage from '../src/components/FavoritesPage';
import ComicsPage from '../src/components/ComicsPage';
import ComicsDetailPage from '../src/components/ComicsDetailPage';
import CharacterComicsPage from '../src/components/ComicsDetailPage';
import axios from "axios";


CharacterComicsPage

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalSing , setIsModalSing] = useState(false)
  const [isModalLogin, setIsModalLogin] = useState(false)

  
  useEffect(() => {
      const token = Cookies.get('userToken');
      setIsLoggedIn(!!token);
  }, [Cookies.get('userToken')]);
  
  const handleLogout = () => {
      Cookies.remove('userToken');
      setIsLoggedIn(false);
      window.location.reload();
  };
    
  const handleLoginSubmit = async (event, email, password) => {
    event.preventDefault();

    try {
        const response = await axios.post('http://localhost:3000/login', {  
            email: email,
            password: password
        });

        if (response.data && response.data.token) {
            Cookies.set('userToken', response.data.token);
            setIsLoggedIn(true);
        }
        window.location.reload();
        return response;
    } catch (error) {
        console.error("Erreur lors de la tentative de connexion:", error);
        throw error;  // Propager l'erreur pour que nous puissions la gérer ailleurs
    }
    
}
  
  const handleSignupSubmit = async (event, email, password) => {
      event.preventDefault();
  
      try {
          const response = await axios.post('http://localhost:3000/signup', {
              email: email,
              password: password
          });
  
          if (response.data && response.data.token) {
              Cookies.set('userToken', response.data.token);
              setIsLoggedIn(true);
          }
          else {
            console.log("pas de token");
          }
      } catch (error) {
          console.error("Erreur lors de la tentative d'inscription:", error);
      }
  }

  

  return (
    <>
      <Router>
      <Header 
    setIsModalLogin={setIsModalLogin} 
    setIsModalSing={setIsModalSing} 
    isLoggedIn={isLoggedIn}
    handleLogout={handleLogout} 
/>      <Routes>
        <Route path="/"element={<CharactersPage />}/>
        <Route path="/character/:characterId" element={<CharacterDetailPage />}/>
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/comics" element={<ComicsPage/>} />
        <Route path="/comic/:comicId" element={<ComicsDetailPage />}/> 
        <Route exact path="/comics/:characterId" component={<CharacterComicsPage/>} /> 
      </Routes>
        {isModalLogin && <LoginModal 
        isOpen={isModalLogin} 
        onSwitch={() => {setIsModalSing(true); setIsModalLogin(false)}} 
        onClose={() => setIsModalLogin(false)} 
        handleLoginSubmit={handleLoginSubmit}
        setIsLoggedIn={setIsLoggedIn}/>}
        
        {isModalSing && <SignupModal 
        isOpen={isModalSing} 
        onSwitch={() => {setIsModalSing(false); setIsModalLogin(true)}} 
        onClose={() => setIsModalSing(false)} 
        handleSignupSubmit={handleSignupSubmit}/>}
      </Router>
    </>
  )
}

export default App
