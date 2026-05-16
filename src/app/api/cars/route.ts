// app/api/cars/route.ts
import { NextResponse } from 'next/server';
import carsData from '@/data/carsMock.json';

export async function GET() {
  return NextResponse.json(carsData);
}
