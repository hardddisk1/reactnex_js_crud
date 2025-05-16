import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../lib/db';


export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const userId = parseInt(id);
  if (!id || isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const { firstname, lastname, role } = await req.json();

    if (!firstname || !lastname || !role) {
      return NextResponse.json(
        { error: 'Firstname, lastname, and role are required.' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'UPDATE users SET firstname = $1, lastname = $2, role = $3 WHERE id = $4 RETURNING *',
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
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const userId = parseInt(id);

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

