import React, { useState, useRef, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import Header from './Header';
import styles from './MainPage.module.css';
import universitiesData from './universities.json'; // Import the JSON file
import departmentsData from './departments.json'; // Import departments JSON

// Access the array inside the JSON
const universities = universitiesData.universities;
const departments = departmentsData.departments;

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

// User-friendly labels mapped to backend collection names
const collectionLabels = {
  'Sayısal': 'say',
  'Eşit Ağırlık': 'ea',
  'Sözel': 'soz',
  'Dil': 'dil'
};

function Main() {
  const [collectionName, setCollectionName] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [collectionSuggestions, setCollectionSuggestions] = useState([]);
  const [city, setCity] = useState('');
  const [uniTur, setUniTur] = useState('');
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState('');
  const [rankMin, setRankMin] = useState(''); // Minimum rank input
  const [rankMax, setRankMax] = useState(''); // Maximum rank input
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [uniTurSuggestions, setUniTurSuggestions] = useState([]);
  const [universitySuggestions, setUniversitySuggestions] = useState([]);
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const collectionRef = useRef();
  const cityRef = useRef();
  const uniTurRef = useRef();
  const universityRef = useRef();
  const departmentRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        collectionRef.current && !collectionRef.current.contains(event.target) &&
        cityRef.current && !cityRef.current.contains(event.target) &&
        uniTurRef.current && !uniTurRef.current.contains(event.target) &&
        universityRef.current && !universityRef.current.contains(event.target) &&
        departmentRef.current && !departmentRef.current.contains(event.target)
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
    setCollectionSuggestions(Object.keys(collectionLabels));
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

  const handleUniversityFocus = () => {
    setUniversitySuggestions(universities);
    setActiveDropdown('university');
  };

  const handleDepartmentFocus = () => {
    setDepartmentSuggestions(departments);
    setActiveDropdown('department');
  };

  const handleCollectionChange = (event) => {
    const value = event.target.value;
    setCollectionName(value);

    // Filter collections based on input
    const filteredCollections = Object.keys(collectionLabels).filter((col) =>
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

  const handleUniversityChange = (event) => {
    const value = event.target.value;
    setUniversity(value);

    // Filter universities based on input
    const filteredUniversities = universities.filter((uni) =>
      uni.toLowerCase().startsWith(value.toLowerCase())
    );
    setUniversitySuggestions(filteredUniversities);
  };

  const handleDepartmentChange = (event) => {
    const value = event.target.value;
    setDepartment(value);

    // Filter departments based on input
    const filteredDepartments = departments.filter((dept) =>
      dept.toLowerCase().startsWith(value.toLowerCase())
    );
    setDepartmentSuggestions(filteredDepartments);
  };

  const handleRankMinChange = (event) => {
    setRankMin(event.target.value);
  };

  const handleRankMaxChange = (event) => {
    setRankMax(event.target.value);
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

  const handleUniversitySuggestionClick = (suggestion) => {
    setUniversity(suggestion);
    setUniversitySuggestions([]);
    setActiveDropdown(null);
  };

  const handleDepartmentSuggestionClick = (suggestion) => {
    setDepartment(suggestion);
    setDepartmentSuggestions([]);
    setActiveDropdown(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setCitySuggestions([]);
    setUniTurSuggestions([]);
    setUniversitySuggestions([]);
    setDepartmentSuggestions([]);
    setActiveDropdown(null);

    try {
      const results = await fetchUniversities();
      console.log('Fetched results:', results);
      setResults(results);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Veriler alınamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    const collectionKey = collectionLabels[collectionName];
    const universitiesRef = collection(db, collectionKey); // Querying the selected collection

    const conditions = [];
    if (city) {
      conditions.push(where('sehir', '==', city.trim().toUpperCase()));
    }
    if (uniTur) {
      conditions.push(where('uniTur', '==', uniTur.trim()));
    }
    if (university) {
      conditions.push(where('uniAdi', '==', university.trim().toUpperCase()));
    }
    if (department) {
      conditions.push(where('baseBolum', '==', department.trim()));
    }

    const queryResults = query(universitiesRef, ...conditions);

    const querySnapshot = await getDocs(queryResults);
    const results = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const rank = parseInt(data.rank2023, 10);
      if ((rankMin === '' || rank >= parseInt(rankMin, 10)) && (rankMax === '' || rank <= parseInt(rankMax, 10))) {
        results.push({ id: doc.id, ...data });
      }
    });

    return results.slice(0, 3); // Return only the first 3 results
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
          <div className={styles.inputGroup} ref={universityRef}>
            <label>Üniversite:</label>
            <input
              type="text"
              value={university}
              onChange={handleUniversityChange}
              onFocus={handleUniversityFocus}
              placeholder="Üniversite ismi girin"
            />
            {activeDropdown === 'university' && universitySuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {universitySuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleUniversitySuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.inputGroup} ref={departmentRef}>
            <label>Bölüm:</label>
            <input
              type="text"
              value={department}
              onChange={handleDepartmentChange}
              onFocus={handleDepartmentFocus}
              placeholder="Bölüm ismi girin"
            />
            {activeDropdown === 'department' && departmentSuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {departmentSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleDepartmentSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.inputGroup}>
            <label>Minimum Sıralama:</label>
            <input
              type="number"
              value={rankMin}
              onChange={handleRankMinChange}
              placeholder="Min sıralama"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Maksimum Sıralama:</label>
            <input
              type="number"
              value={rankMax}
              onChange={handleRankMaxChange}
              placeholder="Max sıralama"
            />
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
            <p>Üniversite Türü: {university.uniTur}</p>
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
