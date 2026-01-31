'use client';

import { use, useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { UserList, UserForm } from '@/components/admin/users/UserComponents';
import { adminApi } from '@/lib/admin/api';
import type { User } from '@/types/admin';

interface UsersPageProps {
    params: Promise<{ locale: string }>;
}

export default function UsersPage(props: UsersPageProps) {
    const params = use(props.params);
    const { locale } = params;

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string>('');

    useEffect(() => {
        fetchUsers();
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const user = await adminApi.auth.getCurrentUser();
            if (user?.id) {
                setCurrentUserId(user.id);
            }
        } catch {
            // Session might not be accessible via this endpoint
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await adminApi.users.getAll();
            setUsers(Array.isArray(res) ? res : []);
        } catch (err) {
            console.error(err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: string) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setSelectedUser(user);
            setIsEditing(true);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            await adminApi.users.delete(id);
            fetchUsers();
        }
    };

    return (
        <AdminLayout locale={locale}>
            {isEditing ? (
                <UserForm
                    initialData={selectedUser || {}}
                    loading={loading}
                    onSubmit={async (data) => {
                        try {
                            if (selectedUser) {
                                await adminApi.users.update(selectedUser.id, data as any);
                            } else {
                                await adminApi.users.create(data as any);
                            }
                            setIsEditing(false);
                            setSelectedUser(null);
                            fetchUsers();
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                    onCancel={() => {
                        setIsEditing(false);
                        setSelectedUser(null);
                    }}
                />
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Add User
                        </button>
                    </div>
                    <UserList
                        users={users}
                        loading={loading}
                        currentUserId={currentUserId}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleActive={async (id) => {
                            const user = users.find(u => u.id === id);
                            if (user) {
                                await adminApi.users.update(id, { status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } as any);
                                fetchUsers();
                            }
                        }}
                        onResetPassword={async (id) => {
                            await adminApi.users.resetPassword(id);
                            alert('Password reset link has been sent.');
                        }}
                    />
                </div>
            )}
        </AdminLayout>
    );
}
