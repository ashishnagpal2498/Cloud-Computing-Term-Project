import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Grid, Snackbar, Alert, CircularProgress, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { green, red, yellow } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { backendURL } from '../../config';

const FriendsListDetail = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newEmails, setNewEmails] = useState(['']);
  const { listName } = useParams();
  const navigate = useNavigate();
  const [success,setSuccess] = useState('');

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://${backendURL}:8080/friends-list/get-friends/${listName}`);
      setFriends(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching friends list');
      setTimeout(() => setError(''), 3000);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [listName]);

  const handleAddEmailField = () => {
    setNewEmails([...newEmails, '']);
  };

  const handleRemoveEmailField = (index) => {
    const updatedEmails = [...newEmails];
    updatedEmails.splice(index, 1);
    setNewEmails(updatedEmails);
  };

  const handleInputChange = (index, value) => {
    const updatedEmails = [...newEmails];
    updatedEmails[index] = value;
    setNewEmails(updatedEmails);
  };

  const handleAddEmails = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`http://${backendURL}:8080/friends-list/add-friends`, {
        snsTopicName: `${listName}`,
        emailAddresses: newEmails.filter(email => email.trim() !== '')
      });
      if (response.status === 200) {
        fetchFriends();
        setNewEmails(['']);
        setShowForm(false);
        setSuccess('Emails added successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Error adding email');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmail = async (subscriptionArn) => {
    try {
      setLoading(true);
      await axios.delete(`http://${backendURL}:8080/friends-list/friend`, {
        data: {
          subscriptionArn: subscriptionArn
        }
      });
      fetchFriends();
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error deleting email');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async (email) => {
    try {
      setLoading(true);
      await axios.post(`http://${backendURL}:8080/friends-list/resendConfirmation`, {
        emailAddresses: [email],
        snsTopicName: listName
      });
      setSuccess('Confirmation sent successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error resending confirmation email');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setError('');
  };

  const handleBack = () => {
    navigate('/friends'); // Navigate to the FriendsList component
  };

  if(loading){
    <CircularProgress />
  }

  return (
    <Box m={2} p={3}>

      <Button variant="contained" onClick={handleBack}>Back</Button>

      <h2>Friends List - {listName}</h2>
      { (error || success) && <Alert severity= {error ? 'error' : 'success'} > {error || success} </Alert> }
      <List>
        {friends.map((friend, index) => (
          <ListItem key={index}>
            <ListItemText primary={`Email : ${friend.emailAddress}`} secondary={`Subscribed: ${friend.subscribed ? 'Yes' : 'No'}`} />
            <ListItemSecondaryAction>
              {friend.subscribed ? (
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteEmail(friend.subscriptionArn)}>
                  <DeleteIcon style={{ color: red[500] }} />
                </IconButton>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={() => handleResendConfirmation(friend.emailAddress)}
                  style={{ backgroundColor: yellow[300], color: "black"}}
                >
                  Resend Confirmation
                </Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {
        <Button style={{margin: "15px"}} variant="contained" onClick={() => setShowForm(!showForm)}>{ showForm ? "Close Form" : "Add More Email Addresses"}</Button>
      }
      {showForm && (
        <div>
          {newEmails.map((email, index) => (
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
          <Button variant="contained" onClick={handleAddEmailField} style={{ backgroundColor: green[500], margin: "10px 20px" }}>Add More</Button>
          <Button variant="contained" onClick={handleAddEmails}>Add Emails</Button>
        </div>
      )}



      <Snackbar open={Boolean(error)} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <div>{error}</div>
      </Snackbar>
    </Box>
  );
};

export default FriendsListDetail;
