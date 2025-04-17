import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

// UserAppointments Component
const UserAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user || !token) {
                    alert('Session expired. Please log in again.');
                    navigate('/SignIn');
                    return;
                }

                const userId = user.id;

                // Fetch appointments for the specific user
                const response = await axios.get(`http://localhost:8000/api/accounts/users/${userId}/appointments/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, [navigate]);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Your Appointments
            </Typography>
            {appointments.length > 0 ? (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment.id}>
                            <strong>{appointment.title}</strong> -{' '}
                            {new Date(appointment.date_time).toLocaleString()}
                            <p>Name: {appointment.name || 'No Name'}</p>
                            <p>Family Name: {appointment.family_name || 'No Family Name'}</p>
                            <p>Description: {appointment.description}</p>
                            <p>Status: {appointment.status || 'Pending'}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No appointments found.</p>
            )}
        </Box>
    );
};

// CreateAppointment Component
const CreateAppointment = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date_time: '',
        name: '', // New field for name
        family_name: '', // New field for family name
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user) {
                alert('Session expired. Please log in again.');
                navigate('/SignIn');
                return;
            }

            const userId = user.id;

            // Send the appointment data to the backend
            const response = await axios.post(
                `http://localhost:8000/api/accounts/users/${userId}/appointments/create/`,
                formData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );

            alert('Appointment created successfully!');
            console.log(response.data);

            // Optionally redirect to the appointments page
            // navigate('/appointments');
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('Failed to create appointment. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Family Name:</label>
                    <input
                        type="text"
                        name="family_name"
                        value={formData.family_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Date and Time:</label>
                    <input
                        type="datetime-local"
                        name="date_time"
                        value={formData.date_time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Create Appointment</button>
            </form>
        </div>
    );
};

// MainGrid Component
export default function MainGrid() {
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' }, margin: 'auto' }}>
            {/* Overview Section */}
            <Typography component="h2" variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                Overview
            </Typography>

            {/* User Appointments Section */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Your Appointments
                </Typography>
                <UserAppointments />
            </Box>

            {/* Create Appointment Section */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Create Appointment
                </Typography>
                <CreateAppointment />
            </Box>
        </Box>
    );
}