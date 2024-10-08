// src/app/api/upload/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Read the JSON body
    const { title, imgUrl, description, label, addy, amount1, amount2, amount3 } = body;

    // Validate amounts to be non-negative
    if ([amount1, amount2, amount3].some((amount) => amount < 0)) {
      return NextResponse.json({ error: 'Amounts cannot be negative' }, { status: 400 });
    }

    // Create a new entry in the database
    const formEntry = await prisma.donationEntry.create({
      data: {
        title,
        imgUrl,
        description,
        label,
        addy,
        amount1: parseFloat(amount1),
        amount2: parseFloat(amount2),
        amount3: parseFloat(amount3),
      },
    });

    return NextResponse.json({ id:formEntry.id }, { status: 200 });
  } catch (error) {
    console.error('Failed to save form data:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to save form data' }, { status: 500 });
  }
}
