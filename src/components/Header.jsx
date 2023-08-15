import React from 'react';
import { Link } from 'react-router-dom';
import "../CSS/Header.css"

function Header({ setIsModalSing, isLoggedIn, handleLogout, setIsModalLogin }) {    
    return (
        <header>
            <div>
                <img 
                    src="https://res.cloudinary.com/duccldgqq/image/upload/v1691016667/samples/vg04ioc8dfmcahbakhho.png" 
                    alt="logo" 
                />

                <div className="nav-container"> 
                    <nav>
                        <Link to="/">Personnages</Link>
                        <Link to="/comics">Comics</Link>
                        {isLoggedIn && <Link to="/favorites">Favoris</Link>}
                    </nav>

                    <div className="buttons-container"> 
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className='header-button'>
                                Déconnexion
                            </button>
                        ) : (
                            <>
                                <button 
                                    onClick={() => setIsModalLogin(true)} 
                                    className='header-button'
                                >
                                    Se connecter
                                </button>
                                <button 
                                    onClick={() => setIsModalSing(true)} 
                                    className='header-button'
                                >
                                    S'inscrire
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
