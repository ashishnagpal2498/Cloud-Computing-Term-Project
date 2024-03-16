import React, { useState } from 'react';
import '../../../Stylesheets/image-gallery.css'; // Import your CSS file for styling

const ImageGallery = ({image}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const downloadImage = (imageUrl) => {
    // Implement download logic here
  };

  console.log(image);
  return (
    <>
      <img className='file-item-image' src={image.url} alt={image.name} onClick={() => openModal(image.url)} />
      {selectedImage && (
        <div className="modal">
          <div className="modal-content">
            <img src={selectedImage} alt="Selected" className="modal-image" />
            <div className="modal-buttons">
              <button onClick={downloadImage(selectedImage)}>Download</button>
              <svg onClick={closeModal} class="text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6m0 12L6 6"/>
  </svg>            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;