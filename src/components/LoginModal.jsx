import React from 'react';
import "../CSS/Modal.css"
import { useState } from 'react'
import Cookies from 'js-cookie';



function LoginModal({ isOpen, onClose, onSwitch, handleLoginSubmit, setIsLoggedIn }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleClose = () => {
        setError(''); // Réinitialiser les erreurs avant la fermeture
        onClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Réinitialiser les erreurs avant la soumission
    
        try {
            const response = await handleLoginSubmit(event, email, password);
    
            if (response && response.data && response.data.token) {
                Cookies.set('userToken', response.data.token);
                setIsLoggedIn(true);
                handleClose(); // Fermer la modal en cas de connexion réussie
            } else {
                setError("Email ou mot de passe incorrect."); // Définir le message d'erreur spécifique
            }
        } catch (error) {
            console.log(error);
            setError("Une erreur s'est produite lors de la connexion.");
        }
    };
    

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(event) => event.stopPropagation()}>
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
                {error && <p className="error-message">{error}</p>} {/* Afficher le message d'erreur s'il y en a un */}
                <p>Vous n'avez pas de compte ? <span onClick={onSwitch}>Inscrivez-vous</span></p>
                <button onClick={handleClose}>Fermer</button>
            </div>
        </div>
    );
}

export default LoginModal;