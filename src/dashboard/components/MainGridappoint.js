import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

// UserAppointments Component
const UserAppointments = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [appointments, setAppointments] = useState([]); // State to store appointments
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Session expired. Please log in again.');
                    navigate('/SignIn');
                    return;
                }

                // Retrieve the user object from localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    alert('User data not found. Please log in again.');
                    navigate('/SignIn');
                    return;
                }

                const userId = user.id; // Extract the user ID

                // Fetch appointments for the specific user
                const response = await axios.get(`http://localhost:8000/api/accounts/users/${userId}/appointments/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setAppointments(response.data); // Set appointments state with the fetched data
                setLoading(false); // Mark loading as complete
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError('Failed to load appointments. Please try again later.');
                setLoading(false); // Mark loading as complete
            }
        };

        fetchAppointments();
    }, [navigate]);

    // Function to update the status of an appointment
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `http://localhost:8000/api/accounts/appointments/${appointmentId}/update-status/`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update the local state to reflect the new status
            setAppointments((prevAppointments) =>
                prevAppointments.map((appointment) =>
                    appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
                )
            );
        } catch (err) {
            console.error('Error updating appointment status:', err);
            alert('Failed to update appointment status. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading appointments...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Appointments</h2>
            {appointments.length > 0 ? (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment.id} style={{ marginBottom: '20px' }}>
                            <strong>{appointment.title}</strong> -{' '}
                            {new Date(appointment.date_time).toLocaleString()}
                            <p>{appointment.description}</p>
                            <p>Name: {appointment.name || 'No Name'}</p>
                            <p>Family Name: {appointment.family_name || 'No Family Name'}</p>
                            <p>Status: {appointment.status}</p>
                            {appointment.status === 'PENDING' && (
                                <div>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => updateAppointmentStatus(appointment.id, 'ACCEPTED')}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => updateAppointmentStatus(appointment.id, 'REFUSED')}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Refuse
                                    </Button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <div>
                    <p>No appointments found.</p>
                    <button onClick={() => navigate('/create-appointment')}>Create Appointment</button>
                </div>
            )}
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
        </Box>
    );
}