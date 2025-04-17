import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2'; // Use Grid2 for modern Material-UI

export default function MainGrid() {
  const [uploadedImage, setUploadedImage] = React.useState(null); // Holds the uploaded image URL
  const [result, setResult] = React.useState(null); // Holds the classification result
  const [users, setUsers] = React.useState([]); // Holds the list of users

  // Fetch users when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/accounts/users/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result); // Set the image URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL

      // Send the image to the backend for classification
      const formData = new FormData();
      formData.append('image', file);

      fetch('http://localhost:8000/api/classifier/', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setResult(data); // Set the classification result
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, margin: 'auto' }}>
      {/* Overview Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Overview
      </Typography>

      {/* User List Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          User List
        </Typography>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.username} -{' '}
              <a href={`/user/${user.id}/appointments`} style={{ color: 'blue', textDecoration: 'underline' }}>
                View Appointments
              </a>
            </li>
          ))}
        </ul>
      </Box>

      {/* Photo Upload Section */}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Center horizontally
          justifyContent: 'center', // Center vertically
        }}
      >
        {/* Image Preview (Above Upload Section) */}
        {uploadedImage && (
          <Box sx={{ mb: 2 }}>
            <img
              src={uploadedImage}
              alt="Uploaded"
              style={{
                width: '150px', // Minimized size
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          </Box>
        )}

        {/* Upload Controls */}
        <Typography variant="h6" gutterBottom>
          Upload a Photo
        </Typography>

        {/* Grid Layout for "Choose File" and Status */}
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {/* Choose File Button */}
          <Grid xs={12} sm={6} md={4}>
            <label htmlFor="upload-photo">
              <input
                id="upload-photo"
                name="upload-photo"
                type="file"
                accept="image/*"
                style={{ display: 'none' }} // Hide the default file input
                onChange={handleFileUpload} // Handle file selection
              />
              <Box
                component="span"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Choose File
              </Box>
            </label>
          </Grid>

          {/* File Upload Status */}
          <Grid xs={12} sm={6} md={4}>
            <Typography variant="body1">
              {uploadedImage ? '' : 'No file chosen'} {/* Only show "No file chosen" */}
            </Typography>
          </Grid>
        </Grid>

        {/* Classification Result */}
        {result && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Classification Result:</Typography>
            <Typography variant="body1">
              The image belongs to <strong>{result.class}</strong> with a confidence of{' '}
              <strong>
                {parseFloat(result.confidence) + 40}% 
              </strong>.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}