import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CharacterComicsPage = () => {
  const { characterId } = useParams();
  const [comics, setComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await axios.get(`https://site--marvel--8bd4m7bpgzgn.code.run/comics/${characterId}`);

        setComics(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des comics pour ce personnage:', error);
        setIsLoading(false);
      }
    };

    fetchComics();
  }, [characterId]);

  return (
    <div>
      <h1>Liste des Comics pour le personnage</h1>
      {isLoading ? (
        <p>Chargement en cours...</p>
      ) : comics.length > 0 ? (
        <ul>
          {comics.map((comic) => (
            <li key={comic._id}>
              <h3>{comic.title}</h3>
              {comic.thumbnail && <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} />}
              <p>{comic.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun comic trouvé pour ce personnage.</p>
      )}
    </div>
  );
};

export default CharacterComicsPage;
