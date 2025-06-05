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
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
  const [loginStats, setLoginStats] = useState<LoginStat[]>([]);

  const currentUser = { role: 'admin' };
  const ability = useMemo(() => defineAbilitiesFor(currentUser.role), [currentUser.role]);

  const fetchLoginStats = async () => {
    try {
      const res = await fetch('/api/login-stats');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch login stats');
      setLoginStats(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/roles')
        ]);

        const [usersData, rolesData] = await Promise.all([
          usersRes.json(),
          rolesRes.json()
        ]);

        if (!usersRes.ok) throw new Error(usersData.error || 'Failed to fetch users');
        if (!rolesRes.ok) throw new Error(rolesData.error || 'Failed to fetch roles');

        setUsers(usersData);
        setRoles(rolesData);

        await fetchLoginStats();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = async (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    if (newValue === 2) {
      await fetchLoginStats();
    }
  };

  const filteredUsers = users.filter((user) =>
    tabIndex === 0
      ? user.role.toLowerCase() === 'standard'
      : user.role.toLowerCase() === 'admin'
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6496'];

  function handleDelete(user: User): void {
    throw new Error('Function not implemented.');
  }

  const maxLogin = Math.max(...loginStats.map(stat => stat.loginCount || 1));

  const combinedChartData = loginStats.map((stat) => ({
    name: stat.name,
    baseline: 50,
    standard: stat.role === 'standard' ? stat.loginCount * 5 : 0,
    admin: stat.role === 'admin' ? (stat.loginCount / maxLogin) * 100 : 0,
  }));

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

      {loading && <CircularProgress />} 
      {error && <Alert severity="error">{error}</Alert>} 

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
                            onChange={(e) => setEditedUser({ ...editedUser, firstname: e.target.value })}
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
                            onChange={(e) => setEditedUser({ ...editedUser, lastname: e.target.value })}
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
                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                            size="small"
                          />
                        ) : (
                          user.email
                        )}
                      </TableCell>
                      <TableCell>
                        {editingUserId === user.id ? (
                          <Select
                            value={roles.includes(editedUser.role || user.role) ? editedUser.role || user.role : ''}
                            onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
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
                            <Button onClick={() => {
                              setEditedUser(user);
                              setEditingUserId(user.id);
                            }} size="small">
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
                Login Counts by User (Bar + Line)
              </Typography>
                <ResponsiveContainer width="100%" aspect={2}>
                  <ComposedChart data={combinedChartData}>
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" domain={[0, 'auto']} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="baseline" barSize={40} fill="#3CB371" />
                    <Line yAxisId="left" type="monotone" dataKey="standard" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} name="Standard Users" />
                    <Line yAxisId="right" type="monotone" dataKey="admin" stroke="#FF0000" strokeWidth={2} dot={{ r: 4 }} name="Admin Users (%)" />
                  </ComposedChart>
                </ResponsiveContainer>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}