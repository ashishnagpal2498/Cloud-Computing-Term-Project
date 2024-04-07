import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, List, ListItem, ListItemText, IconButton, Snackbar, Typography, Grid, Divider } from '@mui/material';
import { Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { green, red } from '@mui/material/colors';
import { backendURL } from '../../config';

const FriendsList = () => {
  const [listTitles, setListTitles] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [emailAddresses, setEmailAddresses] = useState(['']);
  const [successMessage, setSuccessMessage] = useState('');
  const fetchListTitles = async () => {
    try {
      console.log("Calling fetchListTiles =====> ")
      const response = await axios.get(`http://${backendURL}:8080/friends-list/`);
      console.log(response);
      setListTitles(response.data);
    } catch (error) {
      console.log(error);
      setError('Error fetching list titles');
    }
  };
  useEffect(() => {

    console.log("Use-Effect-FriendsList");

    fetchListTitles();
  }, []);

  const handleInputChange = (index, value) => {
    const updatedEmailAddresses = [...emailAddresses];
    updatedEmailAddresses[index] = value;
    setEmailAddresses(updatedEmailAddresses);
  };

  const handleAddEmailField = () => {
    setEmailAddresses([...emailAddresses, '']);
  };

  const handleRemoveEmailField = (index) => {
    const updatedEmailAddresses = [...emailAddresses];
    updatedEmailAddresses.splice(index, 1);
    setEmailAddresses(updatedEmailAddresses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://${backendURL}:8080/friends-list/create`, {
        snsTopicName: newListTitle,
        emailAddresses: emailAddresses.filter(email => email.trim() !== '')
      });

      setSuccessMessage('New list created successfully');
      setShowForm(false);
      setNewListTitle('');
      setEmailAddresses(['']);
      fetchListTitles();
    } catch (error) {
      setError('Error creating new friends list');
    }
  };
  const handleDeleteList = async (title) => {
    try {
      await axios.delete(`http://${backendURL}:8080/friends-list/${title}`);
      setListTitles(listTitles.filter(item => item !== title));
    } catch (error) {
      setError('Error deleting list');
    }
  };
  const handleSnackbarClose = () => {
    setError(null);
    setSuccessMessage('');
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Friends Lists</Typography>

      <List>
        {listTitles.map((title, index) => (
          <div key={index}>
            <ListItem>
              <ListItemText primary={<Link to={`/friends/${title}`} style={{ textDecoration: 'none' }}>{title}</Link>} />
              <IconButton style={{ color: red[500] }} edge="end" aria-label="delete" onClick={() => handleDeleteList(title)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowForm(!showForm)}>{showForm ? "Close form" : "Create New List"}</Button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="List Title"
            variant="outlined"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
          />

          {emailAddresses.map((email, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  type="email"
                  label="Enter Email Address"
                  value={email}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                {index > 0 && (
                  <IconButton aria-label="remove" onClick={() => handleRemoveEmailField(index)}>
                    <DeleteIcon style={{ color: red[500] }} />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddEmailField} style={{ backgroundColor: green[500], margin: "10px 20px" }}>Add Email</Button>
          <Button type="submit" variant="contained">Create List</Button>
        </form>
      )}

      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity="error" onClose={handleSnackbarClose}>{error}</Alert>
      </Snackbar>

      <Snackbar open={Boolean(successMessage)} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert severity="success" onClose={handleSnackbarClose}>{successMessage}</Alert>
      </Snackbar>
    </div>
  );
};

export default FriendsList;
