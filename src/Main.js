import React, { useState, useRef, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import Header from './Header';
import styles from './MainPage.module.css';

// Complete list of cities in Turkey with only the first letter capitalized
const cities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
  'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 
  'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir',
  'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli', 
  'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa', 'Siirt', 'Sinop', 'Sivas', 'Şırnak',
  'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

const uniTypes = ['Vakıf', 'Devlet'];
const collections = ['say', 'ea', 'dil'];

function Main() {
  const [collectionName, setCollectionName] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [collectionSuggestions, setCollectionSuggestions] = useState([]);
  const [city, setCity] = useState('');
  const [uniTur, setUniTur] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [uniTurSuggestions, setUniTurSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const collectionRef = useRef();
  const cityRef = useRef();
  const uniTurRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        collectionRef.current && !collectionRef.current.contains(event.target) &&
        cityRef.current && !cityRef.current.contains(event.target) &&
        uniTurRef.current && !uniTurRef.current.contains(event.target)
      ) {
        setActiveDropdown(null); // Close all dropdowns when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCollectionFocus = () => {
    setCollectionSuggestions(collections);
    setActiveDropdown('collection');
  };

  const handleCityFocus = () => {
    setCitySuggestions(cities);
    setActiveDropdown('city');
  };

  const handleUniTurFocus = () => {
    setUniTurSuggestions(uniTypes);
    setActiveDropdown('uniTur');
  };

  const handleCollectionChange = (event) => {
    const value = event.target.value;
    setCollectionName(value);

    // Filter collections based on input
    const filteredCollections = collections.filter((col) =>
      col.toLowerCase().startsWith(value.toLowerCase())
    );
    setCollectionSuggestions(filteredCollections);
  };

  const handleCityChange = (event) => {
    const value = event.target.value;
    setCity(value);

    // Convert input to handle Turkish specific lowercase i and uppercase I correctly
    const formattedValue = value
      .replace(/i/g, 'İ')
      .replace(/ı/g, 'I')
      .replace(/^./, (char) => char.toUpperCase());

    // Filter cities based on input
    const filteredCities = cities.filter((c) =>
      c.startsWith(formattedValue)
    );
    setCitySuggestions(filteredCities);
  };

  const handleUniTurChange = (event) => {
    const value = event.target.value;
    setUniTur(value);

    // Filter university types based on input
    const filteredUniTypes = uniTypes.filter((type) =>
      type.toLowerCase().startsWith(value.toLowerCase())
    );
    setUniTurSuggestions(filteredUniTypes);
  };

  const handleCollectionSuggestionClick = (suggestion) => {
    setCollectionName(suggestion);
    setCollectionSuggestions([]);
    setActiveDropdown(null);
  };

  const handleCitySuggestionClick = (suggestion) => {
    setCity(suggestion);
    setCitySuggestions([]);
    setActiveDropdown(null);
  };

  const handleUniTurSuggestionClick = (suggestion) => {
    setUniTur(suggestion);
    setUniTurSuggestions([]);
    setActiveDropdown(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setCitySuggestions([]);
    setUniTurSuggestions([]);
    setActiveDropdown(null);

    try {
      const results = await fetchUniversitiesByCityAndType();
      console.log('Fetched results:', results);
      setResults(results);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Veriler alınamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversitiesByCityAndType = async () => {
    const universitiesRef = collection(db, collectionName); // Querying the selected collection
    const q = query(
      universitiesRef,
      where('sehir', '==', city.trim().toUpperCase()),
      where('uniTur', '==', uniTur.trim()), // Ensure uniTur matches exactly
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
          <div className={styles.inputGroup} ref={collectionRef}>
            <label>Alan Türü:</label>
            <input
              type="text"
              value={collectionName}
              onChange={handleCollectionChange}
              onFocus={handleCollectionFocus}
              placeholder="Alan türü girin"
              required
            />
            {activeDropdown === 'collection' && collectionSuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {collectionSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleCollectionSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.inputGroup} ref={cityRef}>
            <label>Şehir:</label>
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              onFocus={handleCityFocus}
              placeholder="Şehir ismi girin"
              required
            />
            {activeDropdown === 'city' && citySuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {citySuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleCitySuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.inputGroup} ref={uniTurRef}>
            <label>Üniversite Türü:</label>
            <input
              type="text"
              value={uniTur}
              onChange={handleUniTurChange}
              onFocus={handleUniTurFocus}
              placeholder="Vakıf veya Devlet"
              required
            />
            {activeDropdown === 'uniTur' && uniTurSuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {uniTurSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleUniTurSuggestionClick(suggestion)}
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
