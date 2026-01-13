'use client';
// Force Rebuild


import { use, useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { LeadList, LeadDetail } from '@/components/admin/leads/LeadComponents';
import { adminApi } from '@/lib/admin/api';
import type { Lead } from '@/types/admin';

interface LeadsPageProps {
    params: Promise<{ locale: string }>;
}

export default function LeadsPage(props: LeadsPageProps) {
    const params = use(props.params);
    const { locale } = params;

    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        onPageChange: (p: number) => fetchLeads(p)
    });

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async (page = 1) => {
        setLoading(true);
        try {
            const res = await adminApi.leads.getAll({ page });
            // Ensure res.data is an array in case mock returns something else
            setLeads(Array.isArray(res.data) ? res.data : []);
            if (res.pagination) {
                setPagination(prev => ({
                    ...prev,
                    page,
                    totalPages: res.pagination.totalPages
                }));
            }
        } catch (err) {
            console.error(err);
            setLeads([]); // Fallback
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: any) => {
        await adminApi.leads.update(id, { status });
        fetchLeads(pagination.page);
        if (selectedLead?.id === id) {
            setSelectedLead(prev => prev ? ({ ...prev, status }) : null);
        }
    };

    return (
        <AdminLayout locale={locale}>
            {selectedLead ? (
                <div className="space-y-4">
                    <button
                        onClick={() => setSelectedLead(null)}
                        className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2"
                    >
                        ← Back to List
                    </button>
                    <LeadDetail
                        lead={selectedLead}
                        locale={locale}
                        onStatusChange={(s) => handleStatusChange(selectedLead.id, s)}
                        onAddNote={async (note) => {
                            await adminApi.leads.addNote(selectedLead.id, note);
                        }}
                        onAssign={async (uid) => {
                            await adminApi.leads.assign(selectedLead.id, uid);
                        }}
                    />
                </div>
            ) : (
                <LeadList
                    locale={locale}
                    leads={leads}
                    loading={loading}
                    pagination={pagination}
                    onView={(id) => {
                        const lead = leads.find(l => l.id === id);
                        if (lead) setSelectedLead(lead);
                    }}
                    onStatusChange={handleStatusChange}
                    onAssign={async (id, uid) => { await adminApi.leads.assign(id, uid); }}
                    onDelete={async (id) => {
                        try {
                            await adminApi.leads.delete(id);
                            fetchLeads(pagination.page);
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                />
            )}
        </AdminLayout>
    );
}
