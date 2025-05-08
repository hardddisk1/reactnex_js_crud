import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';

// PUT /api/users/:id - Update user
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = parseInt(params.id);
      const { firstname, lastname, role } = await req.json();
  
      if (!firstname || !lastname) {
        return NextResponse.json(
          { error: 'Firstname and lastname are required.' },
          { status: 400 }
        );
      }
  
      const result = await pool.query(
        'UPDATE users SET firstname = $1, lastname = $2, role = COALESCE($3, role) WHERE id = $4 RETURNING *',
        [firstname, lastname, role, userId]
      );
  
      if (result.rowCount === 0) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }
  
      return NextResponse.json(result.rows[0]);
    } catch (error: any) {
      console.error('Update user error:', error.message);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  

// DELETE /api/users/:id - Delete user
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id);

    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: `User ${userId} deleted.` });
  } catch (error: any) {
    console.error('Delete user error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
