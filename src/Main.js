// Main.js
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import Header from './Header';
import styles from './MainPage.module.css'; // Import the CSS module

function Main() {
  const [city, setCity] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    console.log('City:', city);

    try {
      const results = await fetchUniversitiesByCity();
      console.log('Fetched results:', results);
      setResults(results);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again.');
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
      <h2>University Recommendation</h2>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>City:</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <button type="submit">Get Recommendations</button>
        </form>
      </div>

      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.resultsContainer}>
        {results.map((university) => (
          <div className={styles.resultCard} key={university.id}>
            <h3>{university.uniAdi}</h3>
            <p>{university.bolumAdi}</p>
            <p>City: {university.sehir}</p>
            <p>Burs: {university.burs}</p>
            <p>Rank: {university.rank2023}</p>
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
