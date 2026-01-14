'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  getCRM,
  onCRMEvent,
  CRMLead,
  CRMDeal,
  CRMActivity,
  CRMEventType,
  CRMEvent,
  captureLeadFromForm,
  createDealFromInquiry,
  logViewingScheduled,
} from '@/lib/crm';

// Hook for lead management
export function useLeads() {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crm = getCRM();

  // Search leads
  const searchLeads = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(null);
      try {
        const results = await crm.searchLeads(query);
        setLeads(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search leads');
      } finally {
        setLoading(false);
      }
    },
    [crm]
  );

  // Create lead
  const createLead = useCallback(
    async (lead: CRMLead) => {
      setLoading(true);
      setError(null);
      try {
        const newLead = await crm.createLead(lead);
        setLeads((prev) => [...prev, newLead]);
        return newLead;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create lead');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [crm]
  );

  // Update lead
  const updateLead = useCallback(
    async (id: string, data: Partial<CRMLead>) => {
      setLoading(true);
      setError(null);
      try {
        const updatedLead = await crm.updateLead(id, data);
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? updatedLead : l))
        );
        return updatedLead;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update lead');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [crm]
  );

  // Get single lead
  const getLead = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        return await crm.getLead(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get lead');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [crm]
  );

  return {
    leads,
    loading,
    error,
    searchLeads,
    createLead,
    updateLead,
    getLead,
  };
}

// Hook for deal management
export function useDeals() {
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crm = getCRM();

  // Create deal
  const createDeal = useCallback(
    async (deal: CRMDeal) => {
      setLoading(true);
      setError(null);
      try {
        const newDeal = await crm.createDeal(deal);
        setDeals((prev) => [...prev, newDeal]);
        return newDeal;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create deal');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [crm]
  );

  // Update deal stage
  const updateDealStage = useCallback(
    async (id: string, stage: CRMDeal['stage']) => {
      setLoading(true);
      setError(null);
      try {
        const updatedDeal = await crm.updateDeal(id, { stage });
        setDeals((prev) =>
          prev.map((d) => (d.id === id ? updatedDeal : d))
        );
        return updatedDeal;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update deal');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [crm]
  );

  // Get single deal
  const getDeal = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        return await crm.getDeal(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get deal');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [crm]
  );

  return {
    deals,
    loading,
    error,
    createDeal,
    updateDealStage,
    getDeal,
  };
}

// Hook for activity logging
export function useActivities(leadId?: string) {
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crm = getCRM();

  // Load activities for a lead
  const loadActivities = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const results = await crm.getActivities(id);
        setActivities(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    },
    [crm]
  );

  // Log new activity
  const logActivity = useCallback(
    async (activity: CRMActivity) => {
      setLoading(true);
      setError(null);
      try {
        const newActivity = await crm.logActivity(activity);
        setActivities((prev) => [...prev, newActivity]);
        return newActivity;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to log activity');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [crm]
  );

  // Load activities on mount if leadId provided
  useEffect(() => {
    if (leadId) {
      loadActivities(leadId);
    }
  }, [leadId, loadActivities]);

  return {
    activities,
    loading,
    error,
    loadActivities,
    logActivity,
  };
}

// Hook for CRM events
export function useCRMEvents(
  eventTypes: CRMEventType[],
  callback: (event: CRMEvent) => void
) {
  useEffect(() => {
    const unsubscribes = eventTypes.map((type) =>
      onCRMEvent(type, callback)
    );

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [eventTypes, callback]);
}

// Hook for lead capture from forms
export function useLeadCapture() {
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedLead, setCapturedLead] = useState<CRMLead | null>(null);

  const capture = useCallback(
    async (formData: {
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      message?: string;
      propertyId?: string;
      source?: string;
    }) => {
      setCapturing(true);
      setError(null);
      try {
        const lead = await captureLeadFromForm(formData);
        setCapturedLead(lead);
        return lead;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to capture lead';
        setError(message);
        throw err;
      } finally {
        setCapturing(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setCapturedLead(null);
    setError(null);
  }, []);

  return {
    capture,
    capturing,
    error,
    capturedLead,
    reset,
  };
}

// Hook for deal creation
export function useDealCreation() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFromInquiry = useCallback(
    async (
      leadId: string,
      propertyId: string,
      propertyPrice: number,
      currency = 'EUR'
    ) => {
      setCreating(true);
      setError(null);
      try {
        return await createDealFromInquiry(leadId, propertyId, propertyPrice, currency);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create deal';
        setError(message);
        throw err;
      } finally {
        setCreating(false);
      }
    },
    []
  );

  return {
    createFromInquiry,
    creating,
    error,
  };
}

// Hook for viewing scheduling
export function useViewingScheduler() {
  const [scheduling, setScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scheduleViewing = useCallback(
    async (leadId: string, propertyId: string, viewingDate: Date) => {
      setScheduling(true);
      setError(null);
      try {
        return await logViewingScheduled(leadId, propertyId, viewingDate);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to schedule viewing';
        setError(message);
        throw err;
      } finally {
        setScheduling(false);
      }
    },
    []
  );

  return {
    scheduleViewing,
    scheduling,
    error,
  };
}

export default {
  useLeads,
  useDeals,
  useActivities,
  useCRMEvents,
  useLeadCapture,
  useDealCreation,
  useViewingScheduler,
};
