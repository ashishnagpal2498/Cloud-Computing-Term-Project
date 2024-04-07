import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { backendURL } from '../../config';
import { Link } from 'react-router-dom';

const Collections = () => {
  const [collectionList, setCollectionList] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [errorCollections, setErrorCollections] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [errorFriends, setErrorFriends] = useState(null);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [selectedList, setSelectedList] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState('');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`http://${backendURL}:8080/collections`);
        setCollectionList(response.data);
        console.log(response.data)
        setLoadingCollections(false);
      } catch (error) {
        setErrorCollections('Error fetching collections');
        setLoadingCollections(false);
      }
    };

    const fetchFriendsList = async () => {
      try {
        const response = await axios.get(`http://${backendURL}:8080/friends-list/`);
        setFriendsList(response.data);
        setLoadingFriends(false);
      } catch (error) {
        setErrorFriends('Error fetching friends list');
        setLoadingFriends(false);
      }
    };

    fetchCollections();
    fetchFriendsList();
  }, []);

  const handleShareDialogOpen = (collectionId) => {
    setSelectedCollection(collectionId);
    setOpenShareDialog(true);
  };

  const handleShareDialogClose = () => {
    setOpenShareDialog(false);
  };

  const handleShare = async () => {
    try {
      setUploading(true); // Show loader
      await axios.post(`http://${backendURL}:8080/friends-list/publishMessage`, {
        collectionId: selectedCollection,
        snsTopicName: selectedList
      });
      setUploading(false); // Hide loader
      setOpenShareDialog(false); // Close share dialog
    } catch (error) {
      console.error('Error sharing collection:', error);
      setUploading(false); // Hide loader
    }
  };

  if (loadingCollections || loadingFriends) {
    return <CircularProgress />;
  }

  if (errorCollections || errorFriends) {
    return <p>{errorCollections || errorFriends}</p>;
  }

  return (
    <div>
      <h1>Collections</h1>
      <List>
        {collectionList.map((collection, index) => (
          <ListItem key={index}>
            <ListItemText primary={collection} />
            <Button variant='outlined' style={{marginRight: "7px"}}><Link to={"/view/" + collection} >View Collection</Link> </Button>
            <Button onClick={() => handleShareDialogOpen(collection)} startIcon={<ShareIcon />} variant="outlined">Share</Button>
          </ListItem>
        ))}
      </List>

      <Dialog open={openShareDialog} onClose={handleShareDialogClose}>
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
          <Button onClick={handleShareDialogClose}>Cancel</Button>
          <Button onClick={handleShare} disabled={!selectedList}>Share</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Collections;
