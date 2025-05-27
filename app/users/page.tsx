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
  Box,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
import { defineAbilitiesFor } from '../../casl/ability';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

interface LoginStat {
  userId: number;
  name: string;
  loginCount: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [tabIndex, setTabIndex] = useState(0);
  const [loginStats, setLoginStats] = useState<LoginStat[]>([]);

  const currentUser = { role: 'admin' };
  const ability = useMemo(() => defineAbilitiesFor(currentUser.role), [currentUser.role]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes, loginStatsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/roles'),
          fetch('/api/login-stats'),
        ]);

        const [usersData, rolesData, loginStatsData] = await Promise.all([
          usersRes.json(),
          rolesRes.json(),
          loginStatsRes.json(),
        ]);

        if (!usersRes.ok) throw new Error(usersData.error || 'Failed to fetch users');
        if (!rolesRes.ok) throw new Error(rolesData.error || 'Failed to fetch roles');
        if (!loginStatsRes.ok) throw new Error(loginStatsData.error || 'Failed to fetch login stats');

        setUsers(usersData);
        setRoles(rolesData);
        setLoginStats(loginStatsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const filteredUsers = users.filter((user) =>
    tabIndex === 0
      ? user.role.toLowerCase() === 'standard'
      : user.role.toLowerCase() === 'admin'
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6496'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Users" />
        <Tab label="Admins" />
        <Tab label="Login Chart" />
      </Tabs>

      {/* Loading State */}
      {loading && <CircularProgress />}

      {/* Error State */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Only render content after loading is complete */}
      {!loading && !error && (
        <>
          {tabIndex < 2 ? (
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
                            <Button color="primary" onClick={() => saveUser(user.id)} size="small">
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
                                setEditedUser(user);
                                setEditingUserId(user.id);
                              }}
                              size="small"
                            >
                              Edit
                            </Button>
                            {ability.can('delete', 'User') && (
                              <Button color="error" onClick={() => handleDelete(user)} size="small">
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
          ) : (
            <Box sx={{ width: '100%', height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Total Logins Per User
              </Typography>
              {loginStats.length > 0 ? (
                <ResponsiveContainer width="100%" aspect={2}>
                  <BarChart data={loginStats}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="loginCount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography>No login data available</Typography>
              )}

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Login Distribution
              </Typography>
              {loginStats.some(stat => stat.loginCount > 0) ? (
                <ResponsiveContainer width="100%" aspect={2}>
                  <PieChart>
                    <Pie
                      data={loginStats.filter(stat => stat.loginCount > 0)}
                      dataKey="loginCount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {loginStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography>No login data to show</Typography>
              )}
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
