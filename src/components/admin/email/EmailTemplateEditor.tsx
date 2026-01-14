'use client';

import { useState } from 'react';
import { Save, Eye, Copy, Trash2, Plus, Variable } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'inquiry_response' | 'viewing_confirmation' | 'price_alert' | 'custom';
  isActive: boolean;
}

const templateTypes = [
  { value: 'welcome', label: 'Welcome Email' },
  { value: 'inquiry_response', label: 'Inquiry Response' },
  { value: 'viewing_confirmation', label: 'Viewing Confirmation' },
  { value: 'price_alert', label: 'Price Alert' },
  { value: 'custom', label: 'Custom Template' },
];

const variables = [
  { key: '{{name}}', description: 'Recipient name' },
  { key: '{{email}}', description: 'Recipient email' },
  { key: '{{property_title}}', description: 'Property title' },
  { key: '{{property_price}}', description: 'Property price' },
  { key: '{{property_url}}', description: 'Property link' },
  { key: '{{agent_name}}', description: 'Agent name' },
  { key: '{{agent_phone}}', description: 'Agent phone' },
  { key: '{{viewing_date}}', description: 'Viewing date' },
  { key: '{{viewing_time}}', description: 'Viewing time' },
  { key: '{{company_name}}', description: 'Company name' },
];

const defaultTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    type: 'welcome',
    subject: 'Welcome to Maison d\'Orient - Your Luxury Property Journey Begins',
    body: `Dear {{name}},

Welcome to Maison d'Orient! We're delighted to have you join our exclusive community of luxury property seekers.

Our team of expert agents is here to help you find the perfect property in Istanbul's most prestigious neighborhoods.

To get started, simply browse our curated collection of properties or contact us directly for personalized assistance.

Best regards,
{{agent_name}}
Maison d'Orient`,
    isActive: true,
  },
  {
    id: '2',
    name: 'Inquiry Response',
    type: 'inquiry_response',
    subject: 'Re: Your Inquiry About {{property_title}}',
    body: `Dear {{name}},

Thank you for your interest in {{property_title}}.

I would be happy to provide you with more information about this exceptional property. It offers:
- Prime location in one of Istanbul's finest neighborhoods
- Stunning views and premium finishes
- Listed at {{property_price}}

Would you like to schedule a private viewing? I'm available to accommodate your schedule.

You can view more details here: {{property_url}}

Looking forward to hearing from you.

Best regards,
{{agent_name}}
{{agent_phone}}`,
    isActive: true,
  },
];

interface EmailTemplateEditorProps {
  template?: EmailTemplate;
  onSave?: (template: EmailTemplate) => void;
  onDelete?: (id: string) => void;
}

export function EmailTemplateEditor({ template, onSave, onDelete }: EmailTemplateEditorProps) {
  const [formData, setFormData] = useState<Partial<EmailTemplate>>(
    template || {
      name: '',
      type: 'custom',
      subject: '',
      body: '',
      isActive: true,
    }
  );
  const [showPreview, setShowPreview] = useState(false);
  const [showVariables, setShowVariables] = useState(false);

  const handleInsertVariable = (variable: string) => {
    const textarea = document.getElementById('template-body') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newBody = formData.body?.slice(0, start) + variable + formData.body?.slice(end);
      setFormData({ ...formData, body: newBody });
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const getPreviewContent = (content: string) => {
    const sampleData: Record<string, string> = {
      '{{name}}': 'John Smith',
      '{{email}}': 'john.smith@example.com',
      '{{property_title}}': 'Luxury Bosphorus Villa',
      '{{property_price}}': '€2,500,000',
      '{{property_url}}': 'https://maisondorient.com/property/123',
      '{{agent_name}}': 'Sarah Johnson',
      '{{agent_phone}}': '+90 532 123 4567',
      '{{viewing_date}}': 'January 25, 2024',
      '{{viewing_time}}': '2:00 PM',
      '{{company_name}}': "Maison d'Orient",
    };

    let result = content;
    Object.entries(sampleData).forEach(([key, value]) => {
      result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    });
    return result;
  };

  const handleSave = () => {
    if (onSave && formData.name && formData.subject && formData.body) {
      onSave({
        id: template?.id || Date.now().toString(),
        name: formData.name,
        type: formData.type as EmailTemplate['type'],
        subject: formData.subject,
        body: formData.body,
        isActive: formData.isActive ?? true,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">
          {template ? 'Edit Template' : 'Create Template'}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVariables(!showVariables)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors',
              showVariables ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Variable size={16} />
            Variables
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors',
              showPreview ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Eye size={16} />
            Preview
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Welcome Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EmailTemplate['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {templateTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Welcome to Maison d'Orient"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Body
              </label>
              <textarea
                id="template-body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                placeholder="Write your email content here..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Template is active
              </label>
            </div>
          </div>

          {/* Preview / Variables Panel */}
          <div>
            {showVariables && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Available Variables</h4>
                <div className="space-y-2">
                  {variables.map((variable) => (
                    <button
                      key={variable.key}
                      onClick={() => handleInsertVariable(variable.key)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white rounded border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <code className="text-primary">{variable.key}</code>
                      <span className="text-gray-500">{variable.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showPreview && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                  <p className="text-sm text-gray-600">Preview</p>
                </div>
                <div className="p-4">
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Subject:</p>
                    <p className="font-medium text-gray-900">
                      {getPreviewContent(formData.subject || '')}
                    </p>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-gray-700">
                    {getPreviewContent(formData.body || '')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div>
            {template && onDelete && (
              <button
                onClick={() => onDelete(template.id)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
                Delete Template
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Copy size={18} />
              Duplicate
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Save size={18} />
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmailTemplateList() {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  if (selectedTemplate) {
    return (
      <div>
        <button
          onClick={() => setSelectedTemplate(null)}
          className="mb-4 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to templates
        </button>
        <EmailTemplateEditor
          template={selectedTemplate}
          onSave={(updated) => {
            setTemplates((prev) =>
              prev.map((t) => (t.id === updated.id ? updated : t))
            );
            setSelectedTemplate(null);
          }}
          onDelete={(id) => {
            setTemplates((prev) => prev.filter((t) => t.id !== id));
            setSelectedTemplate(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Email Templates</h2>
          <p className="text-sm text-gray-500">Manage your automated email templates</p>
        </div>
        <button
          onClick={() => setSelectedTemplate({ id: '', name: '', type: 'custom', subject: '', body: '', isActive: true })}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={18} />
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-gray-900">{template.name}</h3>
              <span
                className={cn(
                  'px-2 py-0.5 text-xs font-medium rounded-full',
                  template.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                )}
              >
                {template.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
            <p className="text-xs text-gray-400">
              {templateTypes.find((t) => t.value === template.type)?.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
