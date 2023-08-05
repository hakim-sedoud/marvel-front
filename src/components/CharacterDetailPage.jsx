import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../CSS/CharacterDetailPage.css"; 
import Cookies from 'js-cookie';

const CharacterDetailPage = ({setIsModalLogin}) => {
  const { characterId } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comics, setComics] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(`https://site--marvel--8bd4m7bpgzgn.code.run/character/${characterId}`);
        setCharacter(response.data);
        setLoading(false);

        const comicsDetails = await Promise.all(response.data.comics.map(async (comicId) => {
          const comicResponse = await axios.get(`https://site--marvel--8bd4m7bpgzgn.code.run/comic/${comicId}`);
          return comicResponse.data;
        }));
        setComics(comicsDetails);
      } catch (err) {
        setError(err.message || "Une erreur est survenue lors de la récupération des données.");
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  useEffect(() => {
    const checkIfFavorite = async () => {
      const token = Cookies.get('userToken');
      const isFav = await isFavoritePresent(token, characterId);
      setIsFavorited(isFav);
    };

    checkIfFavorite();
  }, [characterId]);

  const isFavoritePresent = async (token, characterId) => {
    try {
      const response = await axios.get('https://site--marvel--8bd4m7bpgzgn.code.run/favorites', { params: { token: token } });
      return response.data.some(fav => fav.favoriteId === characterId && fav.favoriteType === "character");
    } catch (error) {
      console.error("Erreur lors de la vérification des favoris:", error);
      return false;
    }
  };

  const addToFavorites = async (token, characterId) => {
    try {
      const response = await axios.post('https://site--marvel--8bd4m7bpgzgn.code.run/favorites/add', {
          token: token,
          favoriteId: characterId,
          favoriteType: "character"
      });
      return response.status === 200;
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
      return false;
    }
  };

  const removeFromFavorites = async (token, characterId) => {
    try {
      const response = await axios.delete('https://site--marvel--8bd4m7bpgzgn.code.run/favorites/remove', {
          data: { 
              token: token,
              favoriteId: characterId,
              favoriteType: "character"
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
    if (!token) {
      setIsModalLogin(true); 
      return;
  }
    const isPresent = await isFavoritePresent(token, characterId);

    if (isPresent) {
        const success = await removeFromFavorites(token, characterId);
        if (success) {
            setIsFavorited(false);
        }
    } else {
        const success = await addToFavorites(token, characterId);
        if (success) {
            setIsFavorited(true);
        }
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="character-container">
      <button onClick={handleToggleFavorite} className="fav-button">
        {isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
      </button>
      <img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} alt={character.name} />
      <h2>{character.name}</h2>
      <p>{character.description}</p>
      <h3>Comics où vous pouvez retrouver ce personnage :</h3>
      <div className="comics-list">
        {comics.map((comic, index) => (
          <div className="comic-card" key={index}>
            <p>{comic.title ? comic.title : "Comic sans nom"}</p>
            <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterDetailPage;
