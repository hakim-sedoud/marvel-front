// ComicsDetailPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../CSS/ComicsDetailPage.css';
import Cookies from 'js-cookie';


const ComicsDetailPage = () => {
  const { comicId } = useParams();
  const [comic, setComic] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);


  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/comic/${comicId}`);
        setComic(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du comic spécifié:', error);
      }
    };

    fetchComic();
  }, [comicId]);
  
  
  const isFavoritePresent = async (token, comicId) => {
    try {
        const response = await axios.get('http://localhost:3000/favorites', { params: { token: token } });
        return response.data.some(fav => fav.favoriteId === comicId && fav.favoriteType === "comic");
    } catch (error) {
        console.error("Erreur lors de la vérification des favoris:", error);
        return false;
    }
};

const addToFavorites = async (token, comicId) => {
  try {
      const response = await axios.post('http://localhost:3000/favorites/add', {
          token: token,
          favoriteId: comicId,
          favoriteType: "comic"
      });
      return response.status === 200;
  } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
      return false;
  }
};

const removeFromFavorites = async (token, comicId) => {
  try {
      const response = await axios.delete('http://localhost:3000/favorites/remove', {
          data: { 
              token: token,
              favoriteId: comicId,
              favoriteType: "comic"
          }
      });
      return response.status === 200;
  } catch (error) {
      console.error("Erreur lors de la suppression des favoris:", error);
      return false;
  }
};

const handleToggleFavorite = async () => {
  const token = Cookies.get('userToken');

  // Vérifier si l'élément est présent dans la base de données
  const isPresent = await isFavoritePresent(token, comicId);

  // Si l'élément est présent, le supprimer
  if (isPresent) {
      const success = await removeFromFavorites(token, comicId);
      if (success) {
          console.log("Favori retiré");
          setIsFavorited(false);
      }

  // Si l'élément est absent, l'ajouter
  } else {
      const success = await addToFavorites(token, comicId);
      if (success) {
          console.log("Favori ajouté");
          setIsFavorited(true);
      }
  }
};


  return (
    <div className="comicsDetail-container">
      {comic ? (
        <div>
          <button onClick={handleToggleFavorite} className="fav-button">
    {isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
</button>     

          <h1>{comic.title}</h1>
          <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} />
          <p>{comic.description}</p>
        </div>
      ) : (
        <p>Chargement en cours...</p>
      )}
    </div>
  );
};

export default ComicsDetailPage;
