'use client';

import { useState } from 'react';
import {
  Card, CardHeader, CardTitle, CardDescription,
  Button, Input, Badge, Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell, Modal, LoadingSpinner,
  EmptyState, Select, Textarea, Switch, Tabs
} from '@/components/admin/common';
import { cn, formatDate } from '@/lib/admin/utils';
import {
  Users, Plus, Search, Edit, Trash2, Shield, Mail,
  Phone, Lock, UserCheck, UserX, Key, Save, Globe,
  Building2, MapPin, Facebook, Instagram, Linkedin, Twitter
} from 'lucide-react';
import type { User, UserRole, Settings as SettingsType } from '@/types/admin';

// Role Badge Component
export function RoleBadge({ role }: { role: UserRole }) {
  const colors = {
    SUPER_ADMIN: 'bg-red-100 text-red-800',
    ADMIN: 'bg-purple-100 text-purple-800',
    MANAGER: 'bg-blue-100 text-blue-800',
    AGENT: 'bg-green-100 text-green-800',
    EDITOR: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <Badge className={colors[role] || 'bg-gray-100 text-gray-800'}>
      {role.replace('_', ' ')}
    </Badge>
  );
}

// User List Component
interface UserListProps {
  users: User[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onResetPassword: (id: string) => void;
  loading?: boolean;
  currentUserId: string;
}

export function UserList({
  users,
  onEdit,
  onDelete,
  onToggleActive,
  onResetPassword,
  loading,
  currentUserId
}: UserListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
          Add User
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                      {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name || 'No name'}</p>
                      {user.phone && (
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{user.email}</span>
                </TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell>
                  {user.isActive ? (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(user.id)}>
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResetPassword(user.id)}
                      title="Reset Password"
                    >
                      <Key size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleActive(user.id)}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {user.isActive ? (
                        <UserX size={16} className="text-orange-500" />
                      ) : (
                        <UserCheck size={16} className="text-green-500" />
                      )}
                    </Button>
                    {user.id !== currentUserId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(user.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// User Form Component
interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: Partial<User>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, loading }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || 'AGENT',
    isActive: initialData?.isActive ?? true,
    password: '',
    confirmPassword: '',
  });

  const roleOptions: { value: UserRole; label: string }[] = [
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'AGENT', label: 'Agent' },
    { value: 'EDITOR', label: 'Editor' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData?.id && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
          options={roleOptions}
        />
      </div>

      {!initialData?.id && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!initialData?.id}
          />
          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required={!initialData?.id}
          />
        </div>
      )}

      <Switch
        label="Active"
        checked={formData.isActive}
        onChange={(checked) => setFormData({ ...formData, isActive: checked })}
      />

      <div className="flex items-center justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialData?.id ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}

// Settings Component
interface SettingsPageProps {
  settings: SettingsType;
  onSave: (group: string, data: Record<string, any>) => Promise<void>;
  loading?: boolean;
}

export function SettingsPage({ settings, onSave, loading }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('company');
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'company', label: 'Company Info' },
    { id: 'contact', label: 'Contact Details' },
    { id: 'social', label: 'Social Media' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'email', label: 'Email Settings' },
  ];

  const handleSave = async (group: string) => {
    setSaving(true);
    try {
      await onSave(group, formData[group as keyof SettingsType] || {});
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (group: string, key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [group]: {
        ...prev[group as keyof SettingsType],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your website settings and configuration</p>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Company Info */}
      {activeTab === 'company' && (
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Basic information about your company</CardDescription>
          </CardHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name (English)"
                value={formData.company?.name?.en || ''}
                onChange={(e) => updateSetting('company', 'name', { ...formData.company?.name, en: e.target.value })}
              />
              <Input
                label="Company Name (Turkish)"
                value={formData.company?.name?.tr || ''}
                onChange={(e) => updateSetting('company', 'name', { ...formData.company?.name, tr: e.target.value })}
              />
            </div>
            <Textarea
              label="About (English)"
              value={formData.company?.about?.en || ''}
              onChange={(e) => updateSetting('company', 'about', { ...formData.company?.about, en: e.target.value })}
              rows={4}
            />
            <Textarea
              label="About (Turkish)"
              value={formData.company?.about?.tr || ''}
              onChange={(e) => updateSetting('company', 'about', { ...formData.company?.about, tr: e.target.value })}
              rows={4}
            />
            <Input
              label="Logo URL"
              value={formData.company?.logo || ''}
              onChange={(e) => updateSetting('company', 'logo', e.target.value)}
              placeholder="https://..."
            />
            <div className="flex justify-end">
              <Button onClick={() => handleSave('company')} loading={saving}>
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Contact Details */}
      {activeTab === 'contact' && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
            <CardDescription>Contact information displayed on your website</CardDescription>
          </CardHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Primary Phone"
                value={formData.contact?.phone1 || ''}
                onChange={(e) => updateSetting('contact', 'phone1', e.target.value)}
                placeholder="+90 532 XXX XX XX"
              />
              <Input
                label="Secondary Phone"
                value={formData.contact?.phone2 || ''}
                onChange={(e) => updateSetting('contact', 'phone2', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={formData.contact?.email || ''}
                onChange={(e) => updateSetting('contact', 'email', e.target.value)}
              />
              <Input
                label="WhatsApp"
                value={formData.contact?.whatsapp || ''}
                onChange={(e) => updateSetting('contact', 'whatsapp', e.target.value)}
              />
            </div>
            <Textarea
              label="Address (English)"
              value={formData.contact?.address?.en || ''}
              onChange={(e) => updateSetting('contact', 'address', { ...formData.contact?.address, en: e.target.value })}
              rows={2}
            />
            <Textarea
              label="Address (Turkish)"
              value={formData.contact?.address?.tr || ''}
              onChange={(e) => updateSetting('contact', 'address', { ...formData.contact?.address, tr: e.target.value })}
              rows={2}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Google Maps Embed URL"
                value={formData.contact?.mapUrl || ''}
                onChange={(e) => updateSetting('contact', 'mapUrl', e.target.value)}
              />
              <Input
                label="Working Hours"
                value={formData.contact?.workingHours || ''}
                onChange={(e) => updateSetting('contact', 'workingHours', e.target.value)}
                placeholder="Mon-Fri 9:00-18:00"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => handleSave('contact')} loading={saving}>
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Social Media */}
      {activeTab === 'social' && (
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Links to your social media profiles</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <Input
              label="Facebook"
              value={formData.social?.facebook || ''}
              onChange={(e) => updateSetting('social', 'facebook', e.target.value)}
              placeholder="https://facebook.com/..."
              icon={<Facebook size={18} />}
            />
            <Input
              label="Instagram"
              value={formData.social?.instagram || ''}
              onChange={(e) => updateSetting('social', 'instagram', e.target.value)}
              placeholder="https://instagram.com/..."
              icon={<Instagram size={18} />}
            />
            <Input
              label="LinkedIn"
              value={formData.social?.linkedin || ''}
              onChange={(e) => updateSetting('social', 'linkedin', e.target.value)}
              placeholder="https://linkedin.com/..."
              icon={<Linkedin size={18} />}
            />
            <Input
              label="Twitter / X"
              value={formData.social?.twitter || ''}
              onChange={(e) => updateSetting('social', 'twitter', e.target.value)}
              placeholder="https://twitter.com/..."
              icon={<Twitter size={18} />}
            />
            <Input
              label="YouTube"
              value={formData.social?.youtube || ''}
              onChange={(e) => updateSetting('social', 'youtube', e.target.value)}
              placeholder="https://youtube.com/..."
            />
            <div className="flex justify-end">
              <Button onClick={() => handleSave('social')} loading={saving}>
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && (
        <Card>
          <CardHeader>
            <CardTitle>Analytics & Tracking</CardTitle>
            <CardDescription>Configure analytics and tracking codes</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <Input
              label="Google Analytics 4 Measurement ID"
              value={formData.analytics?.ga4Id || ''}
              onChange={(e) => updateSetting('analytics', 'ga4Id', e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
            <Input
              label="Google Tag Manager ID"
              value={formData.analytics?.gtmId || ''}
              onChange={(e) => updateSetting('analytics', 'gtmId', e.target.value)}
              placeholder="GTM-XXXXXXX"
            />
            <Input
              label="Facebook Pixel ID"
              value={formData.analytics?.fbPixelId || ''}
              onChange={(e) => updateSetting('analytics', 'fbPixelId', e.target.value)}
              placeholder="XXXXXXXXXXXXXXXXX"
            />
            <Input
              label="Google Search Console Verification"
              value={formData.analytics?.searchConsoleId || ''}
              onChange={(e) => updateSetting('analytics', 'searchConsoleId', e.target.value)}
            />
            <Textarea
              label="Custom Head Scripts"
              value={formData.analytics?.customHeadScripts || ''}
              onChange={(e) => updateSetting('analytics', 'customHeadScripts', e.target.value)}
              rows={4}
              placeholder="<!-- Add custom scripts here -->"
            />
            <div className="flex justify-end">
              <Button onClick={() => handleSave('analytics')} loading={saving}>
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>Configure email notifications and SMTP</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <Input
              label="SMTP Host"
              value={formData.email?.smtpHost || ''}
              onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
              placeholder="smtp.example.com"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="SMTP Port"
                type="number"
                value={formData.email?.smtpPort || 587}
                onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
              />
              <Select
                label="Encryption"
                value={formData.email?.smtpSecure || 'tls'}
                onChange={(e) => updateSetting('email', 'smtpSecure', e.target.value)}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'tls', label: 'TLS' },
                  { value: 'ssl', label: 'SSL' },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="SMTP Username"
                value={formData.email?.smtpUser || ''}
                onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
              />
              <Input
                label="SMTP Password"
                type="password"
                value={formData.email?.smtpPass || ''}
                onChange={(e) => updateSetting('email', 'smtpPass', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="From Email"
                value={formData.email?.fromEmail || ''}
                onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
              />
              <Input
                label="From Name"
                value={formData.email?.fromName || ''}
                onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">
                Send Test Email
              </Button>
              <Button onClick={() => handleSave('email')} loading={saving}>
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
