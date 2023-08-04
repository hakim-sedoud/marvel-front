import React from 'react';
import { Link } from 'react-router-dom';
import "../CSS/Header.css"

function Header({ setIsModalSing, isLoggedIn, handleLogout, setIsModalLogin }) {    
    return (
        <header>
            <div>
                <img src="https://res.cloudinary.com/duccldgqq/image/upload/v1691016667/samples/vg04ioc8dfmcahbakhho.png" alt="logo" />
            <nav>
                <Link to="/">Personnages</Link>
                <Link to="/comics">Comics</Link>
                {isLoggedIn && <Link to="/favorites">Favoris</Link>}
            </nav>
            {isLoggedIn ? (
                <button onClick={handleLogout}>Déconnexion</button>
            ) : (
                <>
                    <button onClick={() => setIsModalLogin(true)}>Se connecter</button>
                    <button onClick={() => setIsModalSing(true)}>S'inscrire</button>
                </>
            )}
            </div>

        </header>
    );
}

export default Header;