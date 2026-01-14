'use client';

import { useState } from 'react';
import { X, Trash2, Eye, EyeOff, Star, DollarSign, UserPlus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkPublish: () => Promise<void>;
  onBulkUnpublish: () => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onBulkFeature: () => Promise<void>;
  onBulkPriceUpdate: (type: 'percentage' | 'fixed', value: number) => Promise<void>;
  onBulkAssign: (agentId: string) => Promise<void>;
}

const agents = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Sarah Smith' },
  { id: '3', name: 'Mike Johnson' },
];

type ModalType = 'delete' | 'price' | 'assign' | null;

export function BulkActions({
  selectedCount,
  onClearSelection,
  onBulkPublish,
  onBulkUnpublish,
  onBulkDelete,
  onBulkFeature,
  onBulkPriceUpdate,
  onBulkAssign,
}: BulkActionsProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [priceType, setPriceType] = useState<'percentage' | 'fixed'>('percentage');
  const [priceValue, setPriceValue] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleAction = async (action: () => Promise<void>, successMessage: string) => {
    setIsLoading(true);
    setResult(null);
    try {
      await action();
      setResult({ success: true, message: successMessage });
      setTimeout(() => {
        setActiveModal(null);
        setResult(null);
        onClearSelection();
      }, 1500);
    } catch (error) {
      setResult({ success: false, message: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedCount === 0) return null;

  return (
    <>
      {/* Bulk Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-gray-900 text-white rounded-xl shadow-2xl px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-gray-700">
            <span className="bg-primary px-3 py-1 rounded-full text-sm font-medium">
              {selectedCount} selected
            </span>
            <button
              onClick={onClearSelection}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction(onBulkPublish, 'Properties published successfully')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Publish"
            >
              <Eye size={18} />
              <span className="text-sm">Publish</span>
            </button>

            <button
              onClick={() => handleAction(onBulkUnpublish, 'Properties unpublished successfully')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Unpublish"
            >
              <EyeOff size={18} />
              <span className="text-sm">Unpublish</span>
            </button>

            <button
              onClick={() => handleAction(onBulkFeature, 'Properties featured successfully')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Feature"
            >
              <Star size={18} />
              <span className="text-sm">Feature</span>
            </button>

            <button
              onClick={() => setActiveModal('price')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Update Price"
            >
              <DollarSign size={18} />
              <span className="text-sm">Price</span>
            </button>

            <button
              onClick={() => setActiveModal('assign')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors"
              title="Assign Agent"
            >
              <UserPlus size={18} />
              <span className="text-sm">Assign</span>
            </button>

            <div className="w-px h-6 bg-gray-700 mx-2" />

            <button
              onClick={() => setActiveModal('delete')}
              className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={18} />
              <span className="text-sm">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            {/* Delete Confirmation */}
            {activeModal === 'delete' && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Trash2 size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Delete Properties</h3>
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete {selectedCount} properties?
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  This action cannot be undone. All associated data including images, leads, and analytics will be permanently removed.
                </p>
                {result && (
                  <div
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg mb-4',
                      result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}
                  >
                    {result.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {result.message}
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setActiveModal(null)}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAction(onBulkDelete, 'Properties deleted successfully')}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                    Delete {selectedCount} Properties
                  </button>
                </div>
              </div>
            )}

            {/* Price Update */}
            {activeModal === 'price' && (
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Update Price</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Update prices for {selectedCount} selected properties
                </p>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPriceType('percentage')}
                      className={cn(
                        'flex-1 px-4 py-2 rounded-lg border-2 transition-colors',
                        priceType === 'percentage'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      )}
                    >
                      Percentage
                    </button>
                    <button
                      onClick={() => setPriceType('fixed')}
                      className={cn(
                        'flex-1 px-4 py-2 rounded-lg border-2 transition-colors',
                        priceType === 'fixed'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      )}
                    >
                      Fixed Amount
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      value={priceValue}
                      onChange={(e) => setPriceValue(e.target.value)}
                      placeholder={priceType === 'percentage' ? 'Enter percentage (e.g., -10 or 5)' : 'Enter amount'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      {priceType === 'percentage' ? '%' : '€'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    {priceType === 'percentage'
                      ? 'Use negative values to decrease prices (e.g., -10 for 10% off)'
                      : 'Use negative values to decrease prices'}
                  </p>
                </div>

                {result && (
                  <div
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg mt-4',
                      result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}
                  >
                    {result.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {result.message}
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setActiveModal(null)}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAction(
                      () => onBulkPriceUpdate(priceType, parseFloat(priceValue) || 0),
                      'Prices updated successfully'
                    )}
                    disabled={isLoading || !priceValue}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                    Update Prices
                  </button>
                </div>
              </div>
            )}

            {/* Assign Agent */}
            {activeModal === 'assign' && (
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Assign Agent</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Assign {selectedCount} properties to an agent
                </p>

                <div className="space-y-2">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-colors',
                        selectedAgent === agent.id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                        {agent.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{agent.name}</span>
                    </button>
                  ))}
                </div>

                {result && (
                  <div
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg mt-4',
                      result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}
                  >
                    {result.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {result.message}
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setActiveModal(null)}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAction(
                      () => onBulkAssign(selectedAgent),
                      'Agent assigned successfully'
                    )}
                    disabled={isLoading || !selectedAgent}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                    Assign Agent
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
