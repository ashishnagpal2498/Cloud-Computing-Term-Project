import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ImageGallery from '../Layouts/Image-Gallery/ImageGallery';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../../Stylesheets/dropbox.css'; // Add your custom CSS for styling
import { backendURL } from '../../config';

const DropBox = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="drop-box">
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 40 }} />
      <p>Drag 'n' drop some folders containing images here, or click to select folders</p>
    </div>
  );
};

const UploadDropBox = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles) => {
    let imageFiles = [];
    acceptedFiles.forEach(entry => {
      if (entry.type.startsWith('image/')) {
        imageFiles.push(entry);
      }
    });
    setImages(imageFiles);
  };

  const uploadFolder = async () => {
    setUploading(true); // Show loader
    const formData = new FormData();
    images.forEach((file) => {
      formData.append(`files`, file);
    });

    try {
      const response = await axios.post(`http://${backendURL}:8080/uploadBulk`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        console.log('Upload successful:', response);
        setOpen(true);
        setCollectionId(response.data.collectionName)
        fetchFriendsList();
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false); // Hide loader
    }
  };

  const fetchFriendsList = async () => {
    try {
      const response = await axios.get(`http://${backendURL}:8080/friends-list/`);
      setFriendsList(response.data);
    } catch (error) {
      console.error('Error fetching friends list:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleShare = async () => {
    try {
      const response = await axios.post(`http://${backendURL}:8080/friends-list/publishMessage`, {
        collectionId,
        snsTopicName: selectedList
      });
      console.log('Share successful:', response);
      setOpen(false);
    } catch (error) {
      console.error('Error sharing images:', error);
    }
  };

  return (
    <div>
      <h1>Add your album</h1>
      <DropBox onDrop={onDrop} />
      <div className="image-list">
        {images.length > 0 && <h4> Preview Images </h4>}
        <ul className="file-list">
          {images.map((value, index) => (
            <li key={index} className="file-item">
              <ImageGallery image={{
                url: URL.createObjectURL(value),
                name: "val" + index
              }} />
            </li>
          ))}
        </ul>
      </div>
      <Button onClick={uploadFolder} variant="contained" startIcon={<CloudUploadIcon />}>
        {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload Folder'}
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Share with Friends</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a friend list to share these images:
          </DialogContentText>
          <select value={selectedList} onChange={(e) => setSelectedList(e.target.value)}>
            <option value="">Select a list</option>
            {friendsList.map((list, index) => (
              <option key={index} value={list}>{list}</option>
            ))}
          </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleShare} disabled={!selectedList}>Share</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UploadDropBox;
