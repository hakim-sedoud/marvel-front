import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../CSS/ComicsPage.css';

const ComicsPage = () => {
    const [comics, setComics] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);

    const fetchComics = async (search = "") => {
        const response = await axios.get(
            `https://site--marvel--8bd4m7bpgzgn.code.run/comics`, {
                params: {
                    title: search,
                    limit: search ? 50 : 100,  
                    skip: (currentPage - 1) * 100,
                }
            }
        );
        setComics(response.data.results);
        setIsLastPage(response.data.results.length < 100);
    };

    useEffect(() => {
        fetchComics();
    }, [currentPage]);

    useEffect(() => {
        if (searchTerm !== '') {
            fetchComics(searchTerm);
        } else {
            fetchComics();
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
                placeholder="Rechercher un comic..."
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
            <div className="comics-container">
                {comics.map((comic) => (
                    <Link to={`/comic/${comic._id}`} key={comic._id} className="comics-card-link">
                        <div className="comics-card">
                            <h3>{comic.title}</h3>
                            <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} />
                            {/* <p>{comic.description}</p> */}
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

export default ComicsPage;
