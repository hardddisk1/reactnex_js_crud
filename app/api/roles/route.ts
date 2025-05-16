import { NextResponse } from 'next/server';

export async function GET() {
  const roles = ['admin', 'standard'];
  return NextResponse.json(roles);
}