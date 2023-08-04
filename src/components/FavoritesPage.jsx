import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Link } from "react-router-dom";
import "../CSS/FavoritesPage.css"


const FavoritesPage = () => {
    const [favoriteCharacters, setFavoriteCharacters] = useState([]);
    const [favoriteComics, setFavoriteComics] = useState([]);

    const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = Cookies.get('userToken');
    if (token) {
      setIsConnected(true);
    }
  }, []);

    useEffect(() => {
        const fetchFavoritesDetails = async () => {
            const token = Cookies.get('userToken');
            try {
                const response = await axios.get(
                    `http://localhost:3000/favorites`, 
                    { params: { token: token } }
                );
                if (response.data) {
                    const characterPromises = response.data.filter(fav => fav.favoriteType === "character").map(async (favorite) => {
                        const detailResponse = await axios.get(`http://localhost:3000/character/${favorite.favoriteId}`);
                        // console.log(detailResponse.data);
                        return {
                            id: favorite.favoriteId,
                            name: detailResponse.data.name,
                            thumbnail: detailResponse.data.thumbnail.path,
                            extension:detailResponse.data.thumbnail.extension
                        };
                    });

                    const comicPromises = response.data.filter(fav => fav.favoriteType === "comic").map(async (favorite) => {
                        const detailResponse = await axios.get(`http://localhost:3000/comic/${favorite.favoriteId}`);
                        // console.log(detailResponse.data);

                        return {
                            id: favorite.favoriteId,
                            name: detailResponse.data.title,
                            thumbnail: detailResponse.data.thumbnail.path,
                            extension:detailResponse.data.thumbnail.extension
                        };
                    });

                    const characters = await Promise.all(characterPromises);
                    const comics = await Promise.all(comicPromises);
                    
                    setFavoriteCharacters(characters);
                    setFavoriteComics(comics);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des détails des favoris:", error);
            }
        };

        fetchFavoritesDetails();
    }, []);

    if (!isConnected) {
        return <div className='disconnected'> <h1>Connectez-vous pour accéder aux favoris</h1></div>;
      }

    return (
        
    <div className='favorite-container'>
            <h1>Vos favoris</h1>
            <div className="favorite-characters-container">
    <h2>Personnages favoris</h2>
    <div className="favorite-card-container">
    {favoriteCharacters.map((character) => (
        <Link to={`/character/${character.id}`} key={character.id} className="favorite-card-link">
            <div className="favorite-card">
            <img src={`${character.thumbnail}.${character.extension}`} alt={character.name} />
                <h2>{character.name}</h2>
            </div>
        </Link>
    ))}
    </div>

</div>
<div className="favorite-comic-container">
<h2>Comics favoris</h2>
<div className="favorite-card-container">

    {favoriteComics.map((comic) => (
        <Link to={`/comic/${comic._id}`} key={comic.id} className="favorite-card-link">
            <div className="favorite-card">
            <img src={`${comic.thumbnail}.${comic.extension}`} alt={comic.name} />
                <h2>{comic.name}</h2>
            </div>
        </Link>
    ))}
    </div>
</div>
 </div>
    );
}

export default FavoritesPage;
