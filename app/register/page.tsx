'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Alert,
} from '@mui/material';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Submitting form data:', formData);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('API response status:', res.status);

      const data = await res.json();
      console.log('API response body:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      console.log('✅ Registration successful, redirecting to /login...');
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'user',
      });

      router.push('/login');
    } catch (err: any) {
      console.error('❌ Registration error:', err.message);
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="First Name"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Register
        </Button>
      </Box>
    </Container>
  );
}
