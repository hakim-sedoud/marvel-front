import React from 'react';
import "../CSS/Modal.css"
import { useState } from 'react'


function SignupModal({ isOpen, onClose, onSwitch, handleSignupSubmit }) {
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
            await handleSignupSubmit(event, email, password);
            if (email && password) {
                handleClose(); // Fermer la modal en cas d'inscription réussie
            } else if (!email){
                setError("merci de renseigner un email valide");
            }        
            else if (!password){
                setError("merci de renseigner un pasword valide");
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message); // Définir l'erreur renvoyée par le serveur
            } else {
                setError("Une erreur s'est produite lors de l'inscription.");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(event) => event.stopPropagation()}>
                <h2>Inscription</h2>
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
                    <button type="submit">S'inscrire</button>
                </form>
                {error && <p className="error-message">{error}</p>} {/* Afficher le message d'erreur s'il y en a un */}
                <p>Vous avez déjà un compte ? <span onClick={onSwitch}>Connectez-vous</span></p>
                <button onClick={handleClose}>Fermer</button>
            </div>
        </div>
    );
}

export default SignupModal;