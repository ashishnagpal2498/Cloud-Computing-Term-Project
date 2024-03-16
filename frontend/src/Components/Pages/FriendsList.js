import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FriendsList = () => {
  const [listTitles, setListTitles] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [emailAddresses, setEmailAddresses] = useState(['']);

  useEffect(() => {
    const fetchListTitles = async () => {
      try {
        // const response = await axios.get('http://localhost:8080/friends-list/titles');
        // setListTitles(response.data);
        setListTitles(["ashishnagpal-random", "shreyakapoor-trip"])
      } catch (error) {
        setError('Error fetching list titles');
      }
    };

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
      // Send a POST request to create a new friends list
      const response = await axios.post('http://localhost:8080/friends-list/create', {
        snsTopicName: newListTitle,
        emailAddresses: emailAddresses.filter(email => email.trim() !== '') // Remove empty email addresses
      });
      
      // Handle success, for example, show a success message or redirect to the newly created list
      console.log('New list created:', response.data);

      // Clear form fields
      setNewListTitle('');
      setEmailAddresses(['']);
    } catch (error) {
      setError('Error creating new friends list');
    }
  };

  return (
    <div>
      <h2>Friends Lists</h2>

      {error && <p>{error}</p>}

      <ul>
        {listTitles.map((title, index) => (
          <li key={index}>
            <Link to={`/friends/${title}`}>{title}</Link>
          </li>
        ))}
      </ul>

      <button onClick={() => setShowForm(true)}>Add New List</button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Enter List Title" 
            value={newListTitle} 
            onChange={(e) => setNewListTitle(e.target.value)} 
          />

          {emailAddresses.map((email, index) => (
            <div key={index}>
              <input 
                type="email" 
                placeholder="Enter Email Address" 
                value={email} 
                onChange={(e) => handleInputChange(index, e.target.value)} 
              />
              {index > 0 && <button type="button" onClick={() => handleRemoveEmailField(index)}>Remove</button>}
            </div>
          ))}

          <button type="button" onClick={handleAddEmailField}>Add More</button>
          <button type="submit">Create List</button>
        </form>
      )}
    </div>
  );
};

export default FriendsList;
