import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  propertyId: z.string().optional(),
  source: z.string().default('website'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        name: `${validated.firstName} ${validated.lastName}`.trim(),
        email: validated.email,
        phone: validated.phone || null,
        subject: validated.subject,
        message: validated.message,
        source: 'WEBSITE',
        propertyId: validated.propertyId || null,
        status: 'NEW',
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'LEAD_CREATED',
        entityType: 'Lead',
        entityId: lead.id,
        details: `New contact form submission from ${validated.email}`,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Thank you for your message. We will contact you shortly.' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}
