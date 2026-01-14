import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { rateLimit, getClientIdentifier, createRateLimitResponse } from '@/lib/rateLimit';

// GET /api/admin/properties/[id] - Get a single property
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        // Apply rate limiting
        const identifier = getClientIdentifier(request);
        const rateLimitResult = rateLimit(identifier, '/api/admin');
        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const property = await prisma.property.findUnique({
            where: { id: params.id },
            include: {
                images: { orderBy: { order: 'asc' } },
                neighborhoodRef: true,
                seo: true,
            },
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json(property);
    } catch (error) {
        console.error('Failed to fetch property:', error);
        return NextResponse.json(
            { error: 'Failed to fetch property' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/properties/[id] - Update a property
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        // Apply rate limiting
        const identifier = getClientIdentifier(request);
        const rateLimitResult = rateLimit(identifier, '/api/admin');
        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Handle nested updates/upserts if necessary. For now, basic fields.
        const property = await prisma.property.update({
            where: { id: params.id },
            data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                propertyType: data.propertyType,
                listingType: data.listingType,
                status: data.status,
                price: data.price,
                currency: data.currency,
                pricePerSqm: data.pricePerSqm,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                size: data.size,
                landSize: data.landSize || data.lotSize, // Mapped
                yearBuilt: data.yearBuilt,
                floor: data.floor,
                floors: data.floors || data.totalFloors, // Mapped
                features: data.features,
                latitude: data.latitude,
                longitude: data.longitude,
                neighborhoodId: data.neighborhoodId,
                isFeatured: data.isFeatured,
                isNew: data.isNew,
                videoUrl: data.videoUrl,
                virtualTourUrl: data.virtualTourUrl,
                // Images handling is complex (usually separate endpoint or nested create/delete)
                // Ignoring images array update here for simplicity unless provided
                seo: data.seo ? {
                    upsert: {
                        create: {
                            metaTitle: data.seo.metaTitle,
                            metaDescription: data.seo.metaDescription,
                            keywords: data.seo.keywords,
                            ogImage: data.seo.ogImage,
                            canonicalUrl: data.seo.canonicalUrl,
                            noIndex: data.seo.noIndex || false,
                            noFollow: data.seo.noFollow || false,
                            schemaMarkup: data.seo.schema,
                        },
                        update: {
                            metaTitle: data.seo.metaTitle,
                            metaDescription: data.seo.metaDescription,
                            keywords: data.seo.keywords,
                            ogImage: data.seo.ogImage,
                            canonicalUrl: data.seo.canonicalUrl,
                            noIndex: data.seo.noIndex || false,
                            noFollow: data.seo.noFollow || false,
                            schemaMarkup: data.seo.schema,
                        }
                    }
                } : undefined,
            },
            include: {
                images: true,
                neighborhoodRef: true,
                seo: true,
            },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: 'UPDATE',
                entityType: 'PROPERTY',
                entityId: property.id,
                userId: session?.user?.id || 'unknown',
                details: { title: data.title },
            },
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error('Failed to update property:', error);
        return NextResponse.json(
            { error: 'Failed to update property' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/properties/[id] - Delete a property
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        // Apply rate limiting
        const identifier = getClientIdentifier(request);
        const rateLimitResult = rateLimit(identifier, '/api/admin');
        if (!rateLimitResult.success) {
            return createRateLimitResponse(rateLimitResult);
        }

        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.property.delete({
            where: { id: params.id },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: 'DELETE',
                entityType: 'PROPERTY',
                entityId: params.id,
                userId: session?.user?.id || 'unknown',
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete property:', error);
        return NextResponse.json(
            { error: 'Failed to delete property' },
            { status: 500 }
        );
    }
}
