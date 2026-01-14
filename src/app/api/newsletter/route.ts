import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = newsletterSchema.parse(body);

    // Check if email already exists
    const existingSubscriber = await prisma.setting.findFirst({
      where: {
        key: 'newsletter_subscribers',
      },
    });

    let subscribers: string[] = [];
    if (existingSubscriber?.value) {
      subscribers = Array.isArray(existingSubscriber.value)
        ? existingSubscriber.value as string[]
        : [];
    }

    if (subscribers.includes(email)) {
      return NextResponse.json(
        { success: false, message: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Add email to subscribers
    subscribers.push(email);

    // Update or create the setting
    await prisma.setting.upsert({
      where: { key: 'newsletter_subscribers' },
      update: { value: subscribers },
      create: {
        key: 'newsletter_subscribers',
        value: subscribers,
      },
    });

    // Also create a lead for the newsletter subscriber
    await prisma.lead.create({
      data: {
        name: 'Newsletter Subscriber',
        email: email,
        source: 'WEBSITE',
        status: 'NEW',
        message: 'Subscribed to newsletter',
      },
    });

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to newsletter!' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }

    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
