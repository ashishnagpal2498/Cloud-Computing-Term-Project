import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ImageGallery from '../Layouts/Image-Gallery/ImageGallery';
import { useParams } from 'react-router-dom';
import { Button, CircularProgress, Typography, Snackbar, Grid, List, ListItem, ListItemText } from '@mui/material';
import { Alert } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { backendURL } from '../../config';

const DropBox = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted: onDrop,
    maxFiles: 1,
    accept: 'image/*',
  });

  return (
    <div {...getRootProps()} className="drop-box" style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', margin: '20px 0' }}>
      <input {...getInputProps()} />
      <Typography variant="body1">Drop your image here, or click to select a file</Typography>
    </div>
  );
};

const ViewImages = () => {
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const params = useParams();
  const { collectionName } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("useEffect")
        const response = await axios.get(`http://${backendURL}:8080/collections/${collectionName}`);
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
    setImage(acceptedFiles[0]);
    setImages([]);
  };

  const searchFace = async () => {
    const formData = new FormData();
    formData.append(`file`, image);

    try {
      setLoading(true);
      const response = await axios.post(`http://${backendURL}:8080/searchImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Response -->", response.data)
      if (response.status === 200) {
        
        setImages(response.data.images);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
    finally{
      setLoading(false)
    }
  };

  const handleDownloadAll = () => {
    images.forEach(image => window.open(image, '_blank'));
    setSnackbarOpen(true); // Show a snackbar indicating download has started
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <div>
        <Typography variant="body1">{error}</Typography>
        <Button variant="contained" onClick={() => alert("Navigate to homepage")}>Go to Homepage</Button>
      </div>
    );
  }

  return (
    <div style={{padding: "20px"}}>
      <Typography variant="h4" gutterBottom>View your Images</Typography>

      { error && <Alert severity= 'error' > {error} </Alert> }
      { images?.length > 0 && <Button variant="contained" startIcon={<CloudDownloadIcon />} onClick={handleDownloadAll}>Download All</Button> }
      <DropBox onDrop={onDrop} />
      
      {image && (
        <>
          <Typography variant="h6" gutterBottom>Selected Image</Typography>
          <List>
            <ListItem>
              <ListItemText primary={<ImageGallery image={{ url: URL.createObjectURL(image), name: 'selectedImage' }} />} />
            </ListItem>
          </List>
        </>
      )}
      {images?.length > 0 && (
        <div className="image-grid">
          <Typography variant="h6" gutterBottom>Images</Typography>
          <Grid container spacing={3}>
            {images.map((value, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <ImageGallery image={{ url: value, name: `val${index}` }} />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
      <Button variant="contained" onClick={searchFace}>Search Pictures</Button>
      {images === null && <h3> No Images present in Album</h3>}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="info" onClose={() => setSnackbarOpen(false)}>Download of all images has started</Alert>
      </Snackbar>
    </div>
  );
};

export default ViewImages;
