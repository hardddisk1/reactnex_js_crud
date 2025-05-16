import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  console.log('[TEST] Received ID:', context.params.id);
  return NextResponse.json({ received: context.params.id });
}