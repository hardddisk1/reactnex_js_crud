// app/api/login-stats/route.ts
import { NextResponse } from 'next/server';
import pool from '../../lib/db';

export async function GET() {
  try {
    // Query to count logins per user
    const result = await pool.query(
      `SELECT u.id, u.firstname, u.lastname, COUNT(l.id) AS login_count
       FROM users u
       LEFT JOIN user_logins l ON u.id = l.user_id
       GROUP BY u.id, u.firstname, u.lastname
       ORDER BY login_count DESC`
    );

    const loginStats = result.rows.map(row => ({
      userId: row.id,
      name: `${row.firstname} ${row.lastname}`,
      loginCount: Number(row.login_count),
    }));

    return NextResponse.json(loginStats);
  } catch (error: any) {
    console.error('Error fetching login stats:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
