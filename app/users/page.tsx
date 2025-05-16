'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import { defineAbilitiesFor } from '../../casl/ability'; // Adjust if needed

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [tabIndex, setTabIndex] = useState(0);

  // Simulated current user
  const currentUser = { role: 'admin' };
  const ability = useMemo(() => defineAbilitiesFor(currentUser.role), [currentUser.role]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await fetch('/api/roles');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch roles');
        setRoles(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

const filteredUsers = users.filter((user) =>
  tabIndex === 0
    ? user.role.toLowerCase() === 'standard'
    : user.role.toLowerCase() === 'admin'
);

  async function handleDelete(user: User): Promise<void> {
    const { id, firstname, lastname } = user;
    if (!confirm(`Are you sure you want to delete user #${id} - ${firstname} ${lastname}?`)) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function saveUser(id: number) {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user');
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
      setEditingUserId(null);
      setEditedUser({});
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Users" />
        <Tab label="Admins" />
      </Tabs>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <TextField
                        value={editedUser.firstname || user.firstname}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, firstname: e.target.value })
                        }
                        size="small"
                      />
                    ) : (
                      user.firstname
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <TextField
                        value={editedUser.lastname || user.lastname}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, lastname: e.target.value })
                        }
                        size="small"
                      />
                    ) : (
                      user.lastname
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <TextField
                        value={editedUser.email || user.email}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, email: e.target.value })
                        }
                        size="small"
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <Select
                        value={
                          roles.includes(editedUser.role || user.role)
                            ? editedUser.role || user.role
                            : ''
                        }
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, role: e.target.value })
                        }
                        size="small"
                      >
                        {roles.map((role) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      user.role
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <>
                        <Button
                          color="primary"
                          onClick={() => saveUser(user.id)}
                          size="small"
                        >
                          Save
                        </Button>
                        <Button onClick={() => setEditingUserId(null)} size="small">
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setEditingUserId(user.id);
                            setEditedUser(user);
                          }}
                          size="small"
                        >
                          Edit
                        </Button>
                        {ability.can('delete', 'User') && (
                          <Button
                            color="error"
                            onClick={() => handleDelete(user)}
                            size="small"
                          >
                            Delete
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
