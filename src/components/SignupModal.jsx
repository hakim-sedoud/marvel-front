import React, { useState } from 'react';
import "../CSS/Modal.css"

function SignupModal({ isOpen, onClose, onSwitch, handleSignupSubmit }) {
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

        if (!email) {
            setError("Merci de renseigner un email valide.");
            return;
        }        

        if (!password) {
            setError("Merci de renseigner un mot de passe valide.");
            return;
        }

        try {
            await handleSignupSubmit(event, email, password);
            handleClose(); 
        } catch (err) {
            setError(err.response?.data.message || "Une erreur s'est produite lors de l'inscription.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                {error && <p className="error-message">{error}</p>}
                <p>Vous avez déjà un compte ? <span onClick={onSwitch}>Connectez-vous</span></p>
                <button onClick={handleClose}>Fermer</button>
            </div>
        </div>
    );
}

export default SignupModal;
