import React, { useState } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import Header from './Header';
import styles from './MainPage.module.css';

// List of cities for suggestions
const cities = [
  'ANTALYA',
  'ANKARA',
  'ALANYA',
  'ADANA',
  'AMASYA',
  // Add more cities as needed
];

function Main() {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCityChange = (event) => {
    const value = event.target.value.toUpperCase();
    setCity(value);

    // Filter cities based on input
    if (value.length > 0) {
      const filteredCities = cities.filter((c) => c.startsWith(value));
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setSuggestions([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuggestions([]); // Hide suggestions when submitting

    try {
      const results = await fetchUniversitiesByCity();
      console.log('Fetched results:', results);
      setResults(results);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Veriler alınamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversitiesByCity = async () => {
    const universitiesRef = collection(db, 'dil'); // Querying the 'dil' collection
    const q = query(
      universitiesRef,
      where('sehir', '==', city.trim().toUpperCase()), // Ensure city name matches exactly
      limit(10) // Limit to first 10 results
    );

    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    return results;
  };

  return (
    <div className={styles.mainContainer}>
      <Header />
      <h2>Üniversite Önerisi</h2>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Şehir:</label>
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              placeholder="Şehir ismi girin"
              required
            />
            {suggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit">Öneri Al</button>
        </form>
      </div>

      {loading && <p className={styles.loading}>Yükleniyor...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.resultsContainer}>
        {results.map((university) => (
          <div className={styles.resultCard} key={university.id}>
            <h3>{university.uniAdi}</h3>
            <p>{university.bolumAdi}</p>
            <p>Şehir: {university.sehir}</p>
            <p>Burs: {university.burs}</p>
            <p>Sıralama: {university.rank2023}</p>
          </div>
        ))}
      </div>
      <div className={styles.wave}></div>
      <div className={styles.wave}></div>
      <div className={styles.wave}></div>
    </div>
  );
}

export default Main;
