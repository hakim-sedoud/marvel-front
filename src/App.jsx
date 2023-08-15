import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios";

import './App.css';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import CharactersPage from './components/CharactersPage';
import CharacterDetailPage from './components/CharacterDetailPage';
import FavoritesPage from './components/FavoritesPage';
import ComicsPage from './components/ComicsPage';
import ComicsDetailPage from './components/ComicsDetailPage';
import CharacterComicsPage from '../src/components/CharactereComicsPage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isModalSing, setIsModalSing] = useState(false);
    const [isModalLogin, setIsModalLogin] = useState(false);

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
            const response = await axios.post('https://site--marvel--8bd4m7bpgzgn.code.run/login', {
                email,
                password
            });

            if (response.data && response.data.token) {
                Cookies.set('userToken', response.data.token);
                setIsLoggedIn(true);
            }
            window.location.reload();
        } catch (error) {
            console.error("Erreur lors de la tentative de connexion:", error);
        }
    };

    const handleSignupSubmit = async (event, email, password) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://site--marvel--8bd4m7bpgzgn.code.run/signup', {
                email,
                password
            });

            if (response.data && response.data.token) {
                Cookies.set('userToken', response.data.token);
                setIsLoggedIn(true);
            } else {
                console.log("pas de token");
            }
        } catch (error) {
            console.error("Erreur lors de la tentative d'inscription:", error);
        }
    };

    return (
        <Router>
            <Header
                setIsModalLogin={setIsModalLogin}
                setIsModalSing={setIsModalSing}
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
            />
            <div className='background-all'>
                <Routes>
                    <Route path="/" element={<CharactersPage />} />
                    <Route path="/character/:characterId" element={<CharacterDetailPage setIsModalLogin={setIsModalLogin} />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/comics" element={<ComicsPage />} />
                    <Route path="/comic/:comicId" element={<ComicsDetailPage setIsModalLogin={setIsModalLogin} />} />
                    <Route exact path="/comics/:characterId" component={<CharacterComicsPage />} />
                </Routes>
                {isModalLogin && <LoginModal
                    isOpen={isModalLogin}
                    onSwitch={() => { setIsModalSing(true); setIsModalLogin(false) }}
                    onClose={() => setIsModalLogin(false)}
                    handleLoginSubmit={handleLoginSubmit}
                    setIsLoggedIn={setIsLoggedIn}
                />}
                {isModalSing && <SignupModal
                    isOpen={isModalSing}
                    onSwitch={() => { setIsModalSing(false); setIsModalLogin(true) }}
                    onClose={() => setIsModalSing(false)}
                    handleSignupSubmit={handleSignupSubmit}
                />}
            </div>
        </Router>
    );
}

export default App;
