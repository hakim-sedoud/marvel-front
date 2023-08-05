import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../CSS/CharactersPage.css";

const CharactersPage = () => {
    const [characters, setCharacters] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);

    const fetchCharacters = async (search = "") => {
        const response = await axios.get(
            `http://site--marvel--8bd4m7bpgzgn.code.run/characters`, {
                params: {
                    name: search,
                    limit: search ? 50 : 100,  
                    skip: (currentPage - 1) * 100,
                }
            }
        );
        setCharacters(response.data.results);
        setIsLastPage(response.data.results.length < 100);
    };

    useEffect(() => {
        fetchCharacters();
    }, [currentPage]);

    useEffect(() => {
        if (searchTerm !== '') {
            fetchCharacters(searchTerm);
        } else {
            fetchCharacters();
        }
    }, [searchTerm]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    return (
        <div>
            
            <div className="page-button-container">
            <input 
                type="text" 
                placeholder="Rechercher un personnage..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
                <button 
                    className="page-button"
                    onClick={() => handlePageChange(currentPage - 1)} 
                    style={{ display: currentPage === 1 ? 'none' : 'inline-block' }}
                >
                    Page précédente
                </button>
                <button 
                    className="page-button"
                    onClick={() => handlePageChange(currentPage + 1)} 
                    style={{ display: isLastPage ? 'none' : 'inline-block' }}
                >
                    Page suivante
                </button>
            </div>
            <div className="characters-container">
                {characters.map((character) => (
                    <Link to={`/character/${character._id}`} key={character._id} className="character-card-link">
                        <div className="character-card">
                            <img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} alt={character.name} />
                            <h2>{character.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="page-button-container">
                <button 
                    className="page-button"
                    onClick={() => handlePageChange(currentPage - 1)} 
                    style={{ display: currentPage === 1 ? 'none' : 'inline-block' }}
                >
                    Page précédente
                </button>
                <button 
                    className="page-button"
                    onClick={() => handlePageChange(currentPage + 1)} 
                    style={{ display: isLastPage ? 'none' : 'inline-block' }}
                >
                    Page suivante
                </button>
            </div>
        </div>
    );
};

export default CharactersPage;
