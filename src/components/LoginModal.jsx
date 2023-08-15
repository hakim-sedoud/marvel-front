import React, { useState } from 'react';
import Cookies from 'js-cookie';
import "../CSS/Modal.css"

function LoginModal({ isOpen, onClose, onSwitch, handleLoginSubmit, setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => {
        setError('');
        onClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); 
        
        try {
            const response = await handleLoginSubmit(event, email, password);
            
            if (response?.data?.token) {
                Cookies.set('userToken', response.data.token);
                setIsLoggedIn(true);
                handleClose();
            } else {
                setError("Email ou mot de passe incorrect.");
            }
        } catch (err) {
            console.log(err);
            setError("Une erreur s'est produite lors de la connexion.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Connexion</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Se connecter</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p>Vous n'avez pas de compte ? <span onClick={onSwitch}>Inscrivez-vous</span></p>
                <button onClick={handleClose}>Fermer</button>
            </div>
        </div>
    );
}

export default LoginModal;
