import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';

// GET /api/users?page=1&limit=10
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT * FROM users ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/users
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstname, lastname, email, password, role = 'user' } = body;

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: 'All fields (firstname, lastname, email, password) are required.' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO users (firstname, lastname, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstname, lastname, email, password, role]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    console.error('Error creating user:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
