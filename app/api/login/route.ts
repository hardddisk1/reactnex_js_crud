// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Check if user exists with provided credentials
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Insert login record into user_logins
    await pool.query('INSERT INTO user_logins (user_id) VALUES ($1)', [user.id]);

    // Remove password before returning user
    const { password: _, ...userWithoutPassword } = user;

    // Return user data (without password)
    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error('Login error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
