// App.js
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

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
    const onDrop = (acceptedFiles) => {
        // Create an array to hold the image files from all folders
        let imageFiles = [];
      
        // Iterate through each dropped folder
        acceptedFiles.forEach(folder => {
          // Check if the dropped item is a directory (folder)
          if (folder.isDirectory) {
            // Iterate through each file in the folder
            folder.createReader().readEntries(entries => {
              entries.forEach(entry => {
                // Check if the entry is a file and has an image MIME type
                if (entry.isFile && entry.type.startsWith('image/')) {
                  // Add the image file to the array
                  imageFiles.push(entry);
                }
              });
              // Update state with the collected image files
              setImages(prevImages => [...prevImages, ...imageFiles]);
            });
          }
        });
      };      
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
  return (
    <div >
      <h1>Custom Drag and Drop Box</h1>
      <DropBox style={dropzoneStyle} onDrop={onDrop} />
      <div className="image-list">
        {images.map((file, index) => (
          <div key={index} className="image-item">
            <img src={URL.createObjectURL(file)} alt={`Image ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadDropBox;
