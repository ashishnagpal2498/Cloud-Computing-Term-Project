import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FriendsListDetail = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newEmails, setNewEmails] = useState(['']);

  const { listName } = useParams();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/friends-list/get-friends/${listName}Topic`);
        setFriends(response.data);
      } catch (error) {
        setError('Error fetching friends list');
      }
    };

    fetchFriends();
  }, []);

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
      await axios.post('http://localhost:8080/friends-list/add-friends', {
        snsTopicName: `${listName}Topic`,
        emailAddresses: newEmails.filter(email => email.trim() !== '')
      });
      // Assuming successful addition, you may want to fetch the updated list of friends here
      // or update the local state accordingly
      setNewEmails(['']);
      setShowForm(false);
    } catch (error) {
      setError('Error adding email');
    }
  };

  return (
    <div>
      <h2>Friends in {listName}</h2>

      {error && <p>{error}</p>}

      <ul>
        {friends.map((friend, index) => (
          <li key={index}>
            <p>Email Address: {friend.emailAddress}</p>
            <p>Subscribed: {friend.subscribed ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>

      {showForm && (
        <div>
          {newEmails.map((email, index) => (
            <div key={index}>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
              {index > 0 && (
                <button type="button" onClick={() => handleRemoveEmailField(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddEmailField}>
            Add More
          </button>
          <button onClick={handleAddEmails}>Add Emails</button>
        </div>
      )}

      {!showForm && (
        <button onClick={() => setShowForm(true)}>Add More Email Addresses</button>
      )}
    </div>
  );
};

export default FriendsListDetail;
