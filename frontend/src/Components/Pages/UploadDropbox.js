// App.js
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios'
import ImageGallery from '../Layouts/Image-Gallery/ImageGallery';

const DropBox = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="drop-box">
      <input {...getInputProps()} />
      <p>Drag 'n' drop some folders containing images here, or click to select folders</p>
    </div>
  );
};

const UploadDropBox = () => {
  const [images, setImages] = useState([]);

  const onDrop = (acceptedFiles) => {
    console.log("Files dropped")
    let imageFiles = [];
    console.log(acceptedFiles)
    acceptedFiles.forEach(entry => {
      if (entry.type.startsWith('image/')) {
        console.log(entry)
        imageFiles.push(entry);
      }
    });
    setImages(imageFiles);
  };

  const dropzoneStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  }

  const uploadFolder = async () => {
    console.log("Upload Button Clicked")
    console.log(images);
    const formData = new FormData();

    // Append each image file to the formData
    images.forEach((file) => {
      formData.append(`files`, file);
    });

    // Make a POST request to the server
    try {
      const response = await axios.post('http://localhost:8080/uploadBulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.status === 200) {
        console.log('Upload successful:', response);
        alert("Your can view your images using the link - http://localhost:3000/view/" + response.data.collectionName);
      }
    }
    catch (error) {
      console.error('Error uploading images:', error);
    }
  }

  return (
    <div >
      <h1>Custom Drag and Drop Box</h1>
      <DropBox style={dropzoneStyle} onDrop={onDrop} />
      <div className="image-list">
        {images.length > 0 && <h4> Preview Images </h4>}
        <ul className="file-list">
          {images.map((value, index) => (
            <li key={index} className="file-item">
              {/* <ImageGallery image={{
                url: URL.createObjectURL(file),
                name: "val" + index
              }} /> */}

              <ImageGallery image={{
                url: value,
                name: "val" + index
              }} />

            </li>
          ))}
        </ul>
      </div>
      <button onClick={uploadFolder}>Upload Folder</button>
    </div>
  );
};

export default UploadDropBox;
