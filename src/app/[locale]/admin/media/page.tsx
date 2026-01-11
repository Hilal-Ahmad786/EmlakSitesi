'use client';

import { use, useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { MediaLibrary } from '@/components/admin/media/MediaComponents';
import { adminApi } from '@/lib/admin/api';
import type { MediaFile, MediaFolder } from '@/types/admin';

interface MediaPageProps {
    params: Promise<{ locale: string }>;
}

export default function MediaPage(props: MediaPageProps) {
    const params = use(props.params);
    const { locale } = params;

    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [folders, setFolders] = useState<MediaFolder[]>([]);
    const [currentFolder, setCurrentFolder] = useState<string | undefined>(undefined);

    useEffect(() => {
        fetchMedia();
        fetchFolders();
    }, [currentFolder]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await adminApi.media.getAll({ folder: currentFolder });
            setFiles(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFolders = async () => {
        try {
            const res = await adminApi.media.getFolders();
            // Mock conversion assuming res is string[]
            setFolders(res.map((f: any) => ({ id: f, name: f, path: f, createdAt: '' })));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminLayout locale={locale}>
            <MediaLibrary
                files={files}
                folders={folders}
                currentFolder={currentFolder}
                loading={loading}
                onNavigate={(folderId) => setCurrentFolder(folderId)}
                onUpload={async (files) => {
                    const formData = new FormData();
                    files.forEach(f => formData.append('files', f));
                    await adminApi.media.uploadMultiple(formData);
                    fetchMedia();
                }}
                onDelete={async (ids) => {
                    await adminApi.media.bulkDelete(ids);
                    fetchMedia();
                }}
                onCreateFolder={async (name) => {
                    await adminApi.media.createFolder(name);
                    fetchFolders();
                }}
            />
        </AdminLayout>
    );
}
