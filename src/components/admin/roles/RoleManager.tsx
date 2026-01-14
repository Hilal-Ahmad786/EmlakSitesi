'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Check, X, Users, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Permission {
  entity: string;
  actions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  isSystem: boolean;
  permissions: Permission[];
  userCount: number;
}

const entities = [
  { id: 'properties', label: 'Properties' },
  { id: 'leads', label: 'Leads' },
  { id: 'users', label: 'Users' },
  { id: 'blog', label: 'Blog Posts' },
  { id: 'neighborhoods', label: 'Neighborhoods' },
  { id: 'media', label: 'Media Library' },
  { id: 'settings', label: 'Settings' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'seo', label: 'SEO' },
];

const defaultRoles: Role[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full access to all features and settings',
    color: 'bg-red-500',
    isSystem: true,
    userCount: 1,
    permissions: entities.map((e) => ({
      entity: e.id,
      actions: { create: true, read: true, update: true, delete: true },
    })),
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Access to most features except user management',
    color: 'bg-blue-500',
    isSystem: true,
    userCount: 3,
    permissions: entities.map((e) => ({
      entity: e.id,
      actions: {
        create: e.id !== 'users',
        read: true,
        update: e.id !== 'users',
        delete: e.id !== 'users' && e.id !== 'settings',
      },
    })),
  },
  {
    id: 'agent',
    name: 'Agent',
    description: 'Can manage assigned properties and leads',
    color: 'bg-green-500',
    isSystem: true,
    userCount: 8,
    permissions: entities.map((e) => ({
      entity: e.id,
      actions: {
        create: ['properties', 'leads'].includes(e.id),
        read: ['properties', 'leads', 'neighborhoods', 'analytics'].includes(e.id),
        update: ['properties', 'leads'].includes(e.id),
        delete: false,
      },
    })),
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to view data',
    color: 'bg-gray-500',
    isSystem: true,
    userCount: 2,
    permissions: entities.map((e) => ({
      entity: e.id,
      actions: { create: false, read: true, update: false, delete: false },
    })),
  },
];

interface PermissionMatrixProps {
  permissions: Permission[];
  onChange: (permissions: Permission[]) => void;
  readOnly?: boolean;
}

function PermissionMatrix({ permissions, onChange, readOnly = false }: PermissionMatrixProps) {
  const togglePermission = (entityId: string, action: keyof Permission['actions']) => {
    if (readOnly) return;

    onChange(
      permissions.map((p) =>
        p.entity === entityId
          ? { ...p, actions: { ...p.actions, [action]: !p.actions[action] } }
          : p
      )
    );
  };

  const toggleAll = (action: keyof Permission['actions']) => {
    if (readOnly) return;

    const allEnabled = permissions.every((p) => p.actions[action]);
    onChange(
      permissions.map((p) => ({
        ...p,
        actions: { ...p.actions, [action]: !allEnabled },
      }))
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">Entity</th>
            {['create', 'read', 'update', 'delete'].map((action) => (
              <th key={action} className="text-center py-3 px-4">
                <button
                  onClick={() => toggleAll(action as keyof Permission['actions'])}
                  disabled={readOnly}
                  className={cn(
                    'font-medium capitalize',
                    readOnly ? 'text-gray-600 cursor-default' : 'text-gray-600 hover:text-primary'
                  )}
                >
                  {action}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entities.map((entity) => {
            const permission = permissions.find((p) => p.entity === entity.id);
            if (!permission) return null;

            return (
              <tr key={entity.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">{entity.label}</td>
                {(['create', 'read', 'update', 'delete'] as const).map((action) => (
                  <td key={action} className="text-center py-3 px-4">
                    <button
                      onClick={() => togglePermission(entity.id, action)}
                      disabled={readOnly}
                      className={cn(
                        'w-6 h-6 rounded flex items-center justify-center transition-colors',
                        permission.actions[action]
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400',
                        !readOnly && 'hover:opacity-80 cursor-pointer'
                      )}
                    >
                      {permission.actions[action] ? <Check size={14} /> : <X size={14} />}
                    </button>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function RoleManager() {
  const [roles, setRoles] = useState(defaultRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Role>>({});

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setEditForm(role);
    setIsEditing(true);
  };

  const handleCreateRole = () => {
    const newRole: Role = {
      id: `custom_${Date.now()}`,
      name: '',
      description: '',
      color: 'bg-indigo-500',
      isSystem: false,
      userCount: 0,
      permissions: entities.map((e) => ({
        entity: e.id,
        actions: { create: false, read: false, update: false, delete: false },
      })),
    };
    setSelectedRole(null);
    setEditForm(newRole);
    setIsEditing(true);
  };

  const handleSaveRole = () => {
    if (!editForm.name) return;

    if (selectedRole) {
      // Update existing role
      setRoles((prev) =>
        prev.map((r) => (r.id === selectedRole.id ? { ...r, ...editForm } as Role : r))
      );
    } else {
      // Create new role
      setRoles((prev) => [...prev, editForm as Role]);
    }
    setIsEditing(false);
    setSelectedRole(null);
    setEditForm({});
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
  };

  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
    'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Role Management</h2>
          <p className="text-sm text-gray-500">Define roles and permissions for admin users</p>
        </div>
        <button
          onClick={handleCreateRole}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Create Role
        </button>
      </div>

      {/* Roles Grid */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-full', role.color)} />
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                </div>
                {!role.isSystem && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditRole(role)}
                      className="p-1 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">{role.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users size={14} />
                  {role.userCount} users
                </div>
                <button
                  onClick={() => handleEditRole(role)}
                  className="text-sm text-primary hover:underline"
                >
                  View permissions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Form */}
      {isEditing && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', editForm.color || 'bg-gray-200')}>
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedRole ? 'Edit Role' : 'Create New Role'}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedRole?.isSystem
                    ? 'System roles cannot be modified'
                    : 'Configure role name and permissions'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedRole(null);
                setEditForm({});
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                disabled={selectedRole?.isSystem}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                placeholder="e.g., Content Manager"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                disabled={selectedRole?.isSystem}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                placeholder="Brief description of the role"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => !selectedRole?.isSystem && setEditForm({ ...editForm, color })}
                    disabled={selectedRole?.isSystem}
                    className={cn(
                      'w-8 h-8 rounded-lg transition-transform',
                      color,
                      editForm.color === color && 'ring-2 ring-offset-2 ring-gray-400 scale-110',
                      selectedRole?.isSystem && 'cursor-not-allowed opacity-50'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Permissions</h4>
            <PermissionMatrix
              permissions={editForm.permissions || []}
              onChange={(permissions) => setEditForm({ ...editForm, permissions })}
              readOnly={selectedRole?.isSystem}
            />
          </div>

          {!selectedRole?.isSystem && (
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedRole(null);
                  setEditForm({});
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                disabled={!editForm.name}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                Save Role
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
