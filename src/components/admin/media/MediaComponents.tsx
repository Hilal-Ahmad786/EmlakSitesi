'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import {
  Card, CardHeader, CardTitle, CardDescription,
  Button, Input, Badge, Modal, LoadingSpinner, Select
} from '@/components/admin/common';
import { cn, formatDate, formatFileSize } from '@/lib/admin/utils';
import {
  Upload, Search, FolderPlus, Grid, List, Check, X,
  Trash2, Download, Copy, Image as ImageIcon, File,
  Folder, ChevronRight, MoreVertical, Eye, Edit
} from 'lucide-react';
import type { MediaFile, MediaFolder } from '@/types/admin';

// Media Item Component
interface MediaItemProps {
  file: MediaFile;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onEdit: () => void;
  viewMode: 'grid' | 'list';
}

function MediaItem({ file, selected, onSelect, onDelete, onEdit, viewMode }: MediaItemProps) {
  const [showActions, setShowActions] = useState(false);

  const isImage = file.type.startsWith('image/');

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'flex items-center gap-4 p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors',
          selected && 'bg-primary/5 border-primary/20'
        )}
        onClick={onSelect}
      >
        <div className={cn(
          'w-5 h-5 rounded border flex items-center justify-center',
          selected ? 'bg-primary border-primary' : 'border-gray-300'
        )}>
          {selected && <Check size={14} className="text-white" />}
        </div>
        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
          {isImage ? (
            <Image src={file.url} alt={file.name} width={48} height={48} className="object-cover" />
          ) : (
            <File size={24} className="text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        </div>
        <div className="text-xs text-gray-500">{file.type}</div>
        <div className="text-xs text-gray-500">{formatDate(file.createdAt)}</div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Edit size={14} />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 size={14} className="text-red-500" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative group rounded-lg overflow-hidden border cursor-pointer transition-all',
        selected ? 'ring-2 ring-primary border-primary' : 'border-gray-200 hover:border-gray-300'
      )}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {isImage ? (
          <Image src={file.url} alt={file.name} fill className="object-cover" />
        ) : (
          <File size={48} className="text-gray-400" />
        )}
      </div>

      {/* Selection indicator */}
      <div className={cn(
        'absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center transition-opacity',
        selected ? 'bg-primary' : 'bg-white/80 border border-gray-300',
        !selected && !showActions && 'opacity-0 group-hover:opacity-100'
      )}>
        {selected && <Check size={14} className="text-white" />}
      </div>

      {/* Actions */}
      <div className={cn(
        'absolute top-2 right-2 flex items-center gap-1 transition-opacity',
        showActions ? 'opacity-100' : 'opacity-0'
      )}>
        <button
          className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm"
          onClick={(e) => { e.stopPropagation(); window.open(file.url, '_blank'); }}
        >
          <Eye size={14} />
        </button>
        <button
          className="p-1.5 bg-white/90 rounded-full hover:bg-white shadow-sm"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <Trash2 size={14} className="text-red-500" />
        </button>
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
        <p className="text-white text-sm truncate">{file.name}</p>
        <p className="text-white/70 text-xs">{formatFileSize(file.size)}</p>
      </div>
    </div>
  );
}

// Folder Item Component
interface FolderItemProps {
  folder: MediaFolder;
  onClick: () => void;
}

function FolderItem({ folder, onClick }: FolderItemProps) {
  return (
    <div
      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <Folder size={24} className="text-yellow-500" />
      <div className="flex-1">
        <p className="font-medium">{folder.name}</p>
        <p className="text-xs text-gray-500">{folder.itemCount} items</p>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  );
}

// Upload Zone Component
interface UploadZoneProps {
  onUpload: (files: File[]) => Promise<void>;
  uploading: boolean;
}

function UploadZone({ onUpload, uploading }: UploadZoneProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    await onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'video/*': ['.mp4', '.webm']
    },
    disabled: uploading
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary',
        uploading && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <LoadingSpinner size="md" />
      ) : (
        <>
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive ? 'Drop files here...' : 'Drag & drop files, or click to select'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supports images, PDFs, and videos
          </p>
        </>
      )}
    </div>
  );
}

// Main Media Library Component
interface MediaLibraryProps {
  files: MediaFile[];
  folders: MediaFolder[];
  currentFolder?: string;
  onNavigate: (folderId?: string) => void;
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (ids: string[]) => Promise<void>;
  onCreateFolder: (name: string) => Promise<void>;
  onSelect?: (file: MediaFile) => void;
  selectionMode?: 'single' | 'multiple' | 'none';
  loading?: boolean;
}

export function MediaLibrary({
  files,
  folders,
  currentFolder,
  onNavigate,
  onUpload,
  onDelete,
  onCreateFolder,
  onSelect,
  selectionMode = 'none',
  loading
}: MediaLibraryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpload = async (uploadFiles: File[]) => {
    setUploading(true);
    try {
      await onUpload(uploadFiles);
    } finally {
      setUploading(false);
    }
  };

  const handleSelect = (file: MediaFile) => {
    if (selectionMode === 'none') return;

    if (selectionMode === 'single') {
      setSelectedIds([file.id]);
      onSelect?.(file);
    } else {
      setSelectedIds(prev =>
        prev.includes(file.id)
          ? prev.filter(id => id !== file.id)
          : [...prev, file.id]
      );
    }
  };

  const handleDelete = async () => {
    await onDelete(selectedIds);
    setSelectedIds([]);
    setShowDeleteModal(false);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    await onCreateFolder(newFolderName);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(
                files.find(f => selectedIds[0] === f.id)?.url || ''
              )}>
                <Copy size={16} className="mr-1" /> Copy URL
              </Button>
              <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                <Trash2 size={16} className="mr-1" /> Delete ({selectedIds.length})
              </Button>
            </>
          )}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-100'
              )}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-100'
              )}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
          <Button variant="outline" onClick={() => setShowNewFolderModal(true)}>
            <FolderPlus size={18} />
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      {currentFolder && (
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => onNavigate(undefined)}
            className="text-primary hover:underline"
          >
            All Files
          </button>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="text-gray-600">{currentFolder}</span>
        </div>
      )}

      {/* Upload Zone */}
      <UploadZone onUpload={handleUpload} uploading={uploading} />

      {/* Folders */}
      {folders.length > 0 && !currentFolder && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Folders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {folders.map(folder => (
              <FolderItem
                key={folder.id}
                folder={folder}
                onClick={() => onNavigate(folder.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">
          Files ({filteredFiles.length})
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <ImageIcon size={48} className="mx-auto text-gray-300" />
            <p className="mt-2 text-gray-500">No files found</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map(file => (
              <MediaItem
                key={file.id}
                file={file}
                selected={selectedIds.includes(file.id)}
                onSelect={() => handleSelect(file)}
                onDelete={() => {
                  setSelectedIds([file.id]);
                  setShowDeleteModal(true);
                }}
                onEdit={() => {}}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <Card>
            {filteredFiles.map(file => (
              <MediaItem
                key={file.id}
                file={file}
                selected={selectedIds.includes(file.id)}
                onSelect={() => handleSelect(file)}
                onDelete={() => {
                  setSelectedIds([file.id]);
                  setShowDeleteModal(true);
                }}
                onEdit={() => {}}
                viewMode="list"
              />
            ))}
          </Card>
        )}
      </div>

      {/* New Folder Modal */}
      <Modal
        isOpen={showNewFolderModal}
        onClose={() => setShowNewFolderModal(false)}
        title="Create New Folder"
      >
        <div className="space-y-4">
          <Input
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Enter folder name"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNewFolderModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create Folder
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Files"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete {selectedIds.length} file(s)? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Media Picker Modal Component (for selecting media from forms)
interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: MediaFile) => void;
  multiple?: boolean;
}

export function MediaPicker({ isOpen, onClose, onSelect, multiple = false }: MediaPickerProps) {
  // This would fetch files from API in production
  const [files] = useState<MediaFile[]>([]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Media"
      size="xl"
    >
      <MediaLibrary
        files={files}
        folders={[]}
        onNavigate={() => {}}
        onUpload={async () => {}}
        onDelete={async () => {}}
        onCreateFolder={async () => {}}
        onSelect={onSelect}
        selectionMode={multiple ? 'multiple' : 'single'}
      />
    </Modal>
  );
}
