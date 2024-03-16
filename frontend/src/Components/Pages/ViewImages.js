import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ImageGallery from '../Layouts/Image-Gallery/ImageGallery';
import { useParams } from 'react-router-dom';

const DropBox = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="drop-box">
      <input {...getInputProps()} />
      <p> Upload your image </p>
    </div>
  );
};

const ViewImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { collectionName } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("CollectionName --->", collectionName)
        const response = await axios.get(`http://localhost:8080/collections/${collectionName}`);
        if (response.status === 200) {
          setLoading(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('Invalid URL');
        } else {
          setError('An error occurred');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);

  const onDrop = (acceptedFiles) => {
    let imageFiles = [];
    acceptedFiles.forEach(entry => {
      if (entry.type.startsWith('image/')) {
        imageFiles.push(entry);
      }
    });
    setImages(imageFiles);
  };

  const searchFace = async () => {
    const formData = new FormData();
    formData.append(`file`, images[0]);

    try {
      const response = await axios.post('http://localhost:8080/searchImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        setImages(response.data.images);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  if (loading) {
    return <p>Loading . . .</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={alert("new")}>Go to Homepage</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Custom Drag and Drop Box</h1>
      <DropBox onDrop={onDrop} />
      <div className="image-list">
        {images.length > 0 && <h4>Preview Images</h4>}
        <ul className="file-list">
          {images.map((value, index) => (
            <li key={index} className="file-item">
              <ImageGallery image={{
                url: value,
                name: `val${index}`
              }} />
            </li>
          ))}
        </ul>
      </div>
      <button onClick={searchFace}>Search Pictures</button>
    </div>
  );
};

export default ViewImages;
