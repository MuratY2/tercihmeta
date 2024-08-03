// UploadPage.js
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);

        const batch = writeBatch(db);
        const collectionRef = collection(db, 'soz'); // Specify your collection

        jsonData.forEach((entry) => {
          const docRef = doc(collectionRef, entry.bolumKodu); // Use unique field as document ID
          batch.set(docRef, entry);
        });

        await batch.commit();
        setStatus('Upload successful!');
      } catch (error) {
        console.error('Error uploading data:', error);
        setStatus('Upload failed.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <h2>Upload JSON File</h2>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{status}</p>
    </div>
  );
}

export default UploadPage;
