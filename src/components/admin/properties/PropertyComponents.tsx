'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import {
  Card, CardHeader, CardTitle, CardDescription,
  Button, Input, Badge, Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell, Modal, LoadingSpinner,
  EmptyState, Tabs, Pagination, Select, Textarea, Checkbox, Switch
} from '@/components/admin/common';
// import { SeoForm } from '@/components/admin/seo/SeoComponents';
import { cn, formatCurrency, formatDate, statusColors } from '@/lib/admin/utils';
import {
  Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye,
  EyeOff, Star, StarOff, Upload, X, GripVertical, MapPin,
  Bed, Bath, Ruler, Calendar, Building2, Home, ImageIcon
} from 'lucide-react';
import type { Property, PropertyFormData, PropertyStatus, PropertyType, ListingType } from '@/types/admin';

// Property Status Badge
export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  const colors = statusColors[status] || statusColors.DRAFT;
  return (
    <Badge className={cn(colors.bg, colors.text)}>
      {status.replace('_', ' ')}
    </Badge>
  );
}

// Property List Component
interface PropertyListProps {
  properties: Property[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onTogglePublish: (id: string) => void;
  loading?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  locale: string;
}

export function PropertyList({
  properties,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePublish,
  loading,
  pagination,
  locale
}: PropertyListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? properties.map(p => p.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(i => i !== id)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!properties.length) {
    return (
      <EmptyState
        icon={<Building2 size={48} />}
        title="No properties found"
        description="Get started by creating your first property listing."
        action={
          <Link href={`/${locale}/admin/properties/new`}>
            <Button icon={<Plus size={18} />}>Add Property</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setFilterOpen(true)}>
            <Filter size={18} />
            Filters
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <>
              <Button variant="outline" size="sm">
                Bulk Edit ({selectedIds.length})
              </Button>
              <Button variant="danger" size="sm">
                Delete Selected
              </Button>
            </>
          )}
          <Link href={`/${locale}/admin/properties/new`}>
            <Button icon={<Plus size={18} />}>Add Property</Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === properties.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(property.id)}
                    onChange={(e) => handleSelectOne(property.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden">
                    {property.images?.[0] ? (
                      <Image
                        src={property.images[0].url}
                        alt={property.title.en || property.title.tr}
                        width={64}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <Link
                      href={`/${locale}/admin/properties/${property.id}`}
                      className="font-medium text-gray-900 hover:text-primary"
                    >
                      {property.title.en || property.title.tr}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Bed size={12} /> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath size={12} /> {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ruler size={12} /> {property.size}m²
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    {property.neighborhoodRef?.name?.en || property.address}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-accent-gold">
                    {formatCurrency(property.price, property.currency)}
                  </span>
                </TableCell>
                <TableCell>
                  <PropertyStatusBadge status={property.status} />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {property.viewCount || 0}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleFeatured(property.id)}
                      title={property.isFeatured ? 'Remove from featured' : 'Add to featured'}
                    >
                      {property.isFeatured ? (
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff size={16} className="text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTogglePublish(property.id)}
                      title={property.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    >
                      {property.status === 'PUBLISHED' ? (
                        <Eye size={16} className="text-green-500" />
                      ) : (
                        <EyeOff size={16} className="text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(property.id)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(property.id)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}

// Image Upload Component
interface ImageUploadProps {
  images: { id?: string; url: string; alt?: string }[];
  onChange: (images: { id?: string; url: string; alt?: string }[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 20 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      // In production, upload to Cloudinary or your storage
      const newImages = acceptedFiles.map(file => ({
        url: URL.createObjectURL(file),
        alt: file.name
      }));
      onChange([...images, ...newImages].slice(0, maxImages));
    } finally {
      setUploading(false);
    }
  }, [images, onChange, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: maxImages - images.length,
    disabled: images.length >= maxImages
  });

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary',
          images.length >= maxImages && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <LoadingSpinner size="md" />
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? 'Drop images here...'
                : 'Drag & drop images, or click to select'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {images.length} / {maxImages} images
            </p>
          </>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <Image
                src={image.url}
                alt={image.alt || ''}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  Main
                </span>
              )}
              <div className="absolute top-2 right-2 cursor-grab">
                <GripVertical size={16} className="text-white drop-shadow" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Property Form Component
interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  locale: string;
}

export function PropertyForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
  locale
}: PropertyFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<PropertyFormData>>({
    title: { en: '', tr: '' },
    description: { en: '', tr: '' },
    slug: '',
    propertyType: 'APARTMENT',
    listingType: 'SALE',
    status: 'DRAFT',
    price: 0,
    currency: 'EUR',
    bedrooms: 0,
    bathrooms: 0,
    size: 0,
    yearBuilt: new Date().getFullYear(),
    features: [],
    images: [],
    isFeatured: false,
    isNew: true,
    seo: {
      metaTitle: { en: '', tr: '' },
      metaDescription: { en: '', tr: '' },
      keywords: { en: [], tr: [] },
      noIndex: false,
      noFollow: false
    },
    ...initialData
  });

  const updateField = <K extends keyof PropertyFormData>(
    field: K,
    value: PropertyFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateLocalizedField = (
    field: 'title' | 'description',
    locale: 'en' | 'tr',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [locale]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as PropertyFormData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Details' },
    { id: 'features', label: 'Features' },
    { id: 'media', label: 'Media' },
    { id: 'location', label: 'Location' },
    // { id: 'seo', label: 'SEO' },
  ];

  const propertyTypes: { value: PropertyType; label: string }[] = [
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'PENTHOUSE', label: 'Penthouse' },
    { value: 'YALI', label: 'Yalı' },
    // { value: 'MANSION', label: 'Mansion' }, // Removed as not in type
    { value: 'LAND', label: 'Land' },
    // { value: 'COMMERCIAL', label: 'Commercial' }, // Removed as not in type
    { value: 'OFFICE', label: 'Office' },
    { value: 'RETAIL', label: 'Retail' },
  ];

  const listingTypes: { value: ListingType; label: string }[] = [
    { value: 'SALE', label: 'For Sale' },
    { value: 'RENT', label: 'For Rent' },
    // { value: 'DAILY_RENT', label: 'Daily Rent' }, // Removed as not in type
  ];

  const statusOptions: { value: PropertyStatus; label: string }[] = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'ARCHIVED', label: 'Archived' },
    { value: 'SOLD', label: 'Sold' },
    { value: 'RENTED', label: 'Rented' },
  ];

  const featureOptions = [
    'Direct Bosphorus Access', 'Private Dock', 'Historic Architecture',
    'Smart Home System', 'Private Garden', 'Staff Quarters',
    'Security System', 'Underfloor Heating', 'Central Air Conditioning',
    'Parking', 'Pool', 'Gym', 'Terrace', 'Balcony', 'Sea View',
    'City View', 'Fireplace', 'Wine Cellar', 'Home Cinema', 'Elevator'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the main details of the property</CardDescription>
          </CardHeader>
          <div className="space-y-6">
            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Title (English)"
                value={formData.title?.en || ''}
                onChange={(e) => updateLocalizedField('title', 'en', e.target.value)}
                required
              />
              <Input
                label="Title (Turkish)"
                value={formData.title?.tr || ''}
                onChange={(e) => updateLocalizedField('title', 'tr', e.target.value)}
                required
              />
            </div>

            {/* Slug */}
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="URL Slug (Auto-generated if empty)"
                value={formData.slug || ''}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="historic-yali-mansion"
              />
            </div>

            {/* Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Property Type"
                value={formData.propertyType}
                onChange={(e) => updateField('propertyType', e.target.value as PropertyType)}
                options={propertyTypes}
              />
              <Select
                label="Listing Type"
                value={formData.listingType}
                onChange={(e) => updateField('listingType', e.target.value as ListingType)}
                options={listingTypes}
              />
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value as PropertyStatus)}
                options={statusOptions}
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Description (English)"
                value={formData.description?.en || ''}
                onChange={(e) => updateLocalizedField('description', 'en', e.target.value)}
                rows={6}
              />
              <Textarea
                label="Description (Turkish)"
                value={formData.description?.tr || ''}
                onChange={(e) => updateLocalizedField('description', 'tr', e.target.value)}
                rows={6}
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <Switch
                label="Featured Property"
                checked={formData.isFeatured || false}
                onChange={(e: any) => updateField('isFeatured', e.target.checked)}
              />
              <Switch
                label="Mark as New"
                checked={formData.isNew || false}
                onChange={(e: any) => updateField('isNew', e.target.checked)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>Specifications and pricing</CardDescription>
          </CardHeader>
          <div className="space-y-6">
            {/* Price */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Price"
                type="number"
                value={formData.price || 0}
                onChange={(e) => updateField('price', parseInt(e.target.value))}
                required
              />
              <Select
                label="Currency"
                value={formData.currency}
                onChange={(e) => updateField('currency', e.target.value as 'EUR' | 'USD' | 'TRY')}
                options={[
                  { value: 'EUR', label: '€ EUR' },
                  { value: 'USD', label: '$ USD' },
                  { value: 'TRY', label: '₺ TRY' },
                ]}
              />
              <Input
                label="Price Per m²"
                type="number"
                value={formData.pricePerSqm || 0}
                onChange={(e) => updateField('pricePerSqm', parseInt(e.target.value))}
              />
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Bedrooms"
                type="number"
                value={formData.bedrooms || 0}
                onChange={(e) => updateField('bedrooms', parseInt(e.target.value))}
                min={0}
              />
              <Input
                label="Bathrooms"
                type="number"
                value={formData.bathrooms || 0}
                onChange={(e) => updateField('bathrooms', parseInt(e.target.value))}
                min={0}
              />
              <Input
                label="Size (m²)"
                type="number"
                value={formData.size || 0}
                onChange={(e) => updateField('size', parseInt(e.target.value))}
                min={0}
              />
              <Input
                label="Year Built"
                type="number"
                value={formData.yearBuilt || new Date().getFullYear()}
                onChange={(e) => updateField('yearBuilt', parseInt(e.target.value))}
              />
            </div>

            {/* Additional */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Floor"
                type="number"
                value={formData.floor || 0}
                onChange={(e) => updateField('floor', parseInt(e.target.value))}
              />
              <Input
                label="Total Floors"
                type="number"
                value={formData.floors || 0}
                onChange={(e) => updateField('floors', parseInt(e.target.value))}
              />
              {/* Parking removed
              <Input
                label="Parking Spaces"
                type="number"
                value={formData.parkingSpaces || 0}
                onChange={(e) => updateField('parkingSpaces', parseInt(e.target.value))}
              /> */}
              <Input
                label="Land Size (m²)"
                type="number"
                value={formData.landSize || 0}
                onChange={(e) => updateField('landSize', parseInt(e.target.value))}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <Card>
          <CardHeader>
            <CardTitle>Features & Amenities</CardTitle>
            <CardDescription>Select the features available in this property</CardDescription>
          </CardHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featureOptions.map((feature) => (
              <Checkbox
                key={feature}
                label={feature}
                checked={(formData.features || []).includes(feature)}
                onChange={(e) => {
                  const features = formData.features || [];
                  updateField(
                    'features',
                    e.target.checked
                      ? [...features, feature]
                      : features.filter(f => f !== feature)
                  );
                }}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <Card>
          <CardHeader>
            <CardTitle>Images & Media</CardTitle>
            <CardDescription>Upload property photos (first image will be the main image)</CardDescription>
          </CardHeader>
          <ImageUpload
            images={(formData.images || []).map(img => ({
              id: img.id,
              url: img.url || '',
              alt: img.alt?.en || ''
            }))}
            onChange={(images) => updateField('images', images.map(img => ({ ...img, alt: { en: img.alt || '', tr: img.alt || '' } })))}
          />
          <div className="mt-6">
            <Input
              label="Video URL (YouTube/Vimeo)"
              value={formData.videoUrl || ''}
              onChange={(e) => updateField('videoUrl', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <div className="mt-4">
            <Input
              label="Virtual Tour URL"
              value={formData.virtualTourUrl || ''}
              onChange={(e) => updateField('virtualTourUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </Card>
      )}

      {/* Location Tab */}
      {activeTab === 'location' && (
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <CardDescription>Property address and coordinates</CardDescription>
          </CardHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Address"
                value={formData.address || ''}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Full address"
              />
              <Select
                label="Neighborhood"
                value={formData.neighborhoodId || ''}
                onChange={(e) => updateField('neighborhoodId', e.target.value)}
                options={[
                  { value: '', label: 'Select neighborhood' },
                  { value: '1', label: 'Bebek' },
                  { value: '2', label: 'Galata' },
                  { value: '3', label: 'Nişantaşı' },
                  { value: '4', label: 'Sarıyer' },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Latitude"
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) => updateField('latitude', parseFloat(e.target.value))}
                placeholder="41.0766"
              />
              <Input
                label="Longitude"
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => updateField('longitude', parseFloat(e.target.value))}
                placeholder="29.0433"
              />
            </div>
            {/* Map placeholder */}
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <MapPin size={48} />
              <span className="ml-2">Map integration (requires Google Maps API)</span>
            </div>
          </div>
        </Card>
      )}

      {/* SEO Tab removed */}
      { /* activeTab === 'seo' && (
        <SeoForm
          data={formData.seo || {}}
          onChange={(seo) => updateField('seo', seo)}
          entityType="property"
          entityTitle={formData.title?.en || ''}
        />
      ) */}

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="secondary">
          Save as Draft
        </Button>
        <Button type="submit" loading={loading}>
          {(initialData as any)?.id ? 'Update Property' : 'Create Property'}
        </Button>
      </div>
    </form>
  );
}
