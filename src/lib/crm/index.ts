// CRM Integration Layer
// Provides hooks and utilities for integrating with various CRM systems

export type CRMProvider = 'salesforce' | 'hubspot' | 'zoho' | 'pipedrive' | 'custom';

export interface CRMConfig {
  provider: CRMProvider;
  apiKey?: string;
  apiUrl?: string;
  enabled: boolean;
}

export interface CRMLead {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  propertyInterest?: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  notes?: string;
  customFields?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CRMDeal {
  id?: string;
  leadId: string;
  propertyId: string;
  amount: number;
  currency: string;
  stage: 'initial' | 'viewing' | 'negotiation' | 'contract' | 'closed_won' | 'closed_lost';
  probability?: number;
  expectedCloseDate?: string;
  assignedTo?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CRMActivity {
  id?: string;
  type: 'call' | 'email' | 'meeting' | 'viewing' | 'note' | 'task';
  leadId?: string;
  dealId?: string;
  subject: string;
  description?: string;
  dueDate?: string;
  completedAt?: string;
  assignedTo?: string;
  createdAt?: string;
}

// Base CRM interface that all providers implement
export interface CRMInterface {
  // Leads
  createLead(lead: CRMLead): Promise<CRMLead>;
  updateLead(id: string, data: Partial<CRMLead>): Promise<CRMLead>;
  getLead(id: string): Promise<CRMLead | null>;
  searchLeads(query: string): Promise<CRMLead[]>;

  // Deals
  createDeal(deal: CRMDeal): Promise<CRMDeal>;
  updateDeal(id: string, data: Partial<CRMDeal>): Promise<CRMDeal>;
  getDeal(id: string): Promise<CRMDeal | null>;

  // Activities
  logActivity(activity: CRMActivity): Promise<CRMActivity>;
  getActivities(leadId: string): Promise<CRMActivity[]>;
}

// CRM Event types for webhooks
export type CRMEventType =
  | 'lead.created'
  | 'lead.updated'
  | 'lead.converted'
  | 'deal.created'
  | 'deal.stage_changed'
  | 'deal.closed'
  | 'activity.logged';

export interface CRMEvent {
  type: CRMEventType;
  data: CRMLead | CRMDeal | CRMActivity;
  timestamp: string;
  source: string;
}

// Event listeners for CRM events
type CRMEventListener = (event: CRMEvent) => void | Promise<void>;
const eventListeners: Map<CRMEventType, CRMEventListener[]> = new Map();

export function onCRMEvent(type: CRMEventType, listener: CRMEventListener): () => void {
  const listeners = eventListeners.get(type) || [];
  listeners.push(listener);
  eventListeners.set(type, listeners);

  // Return unsubscribe function
  return () => {
    const current = eventListeners.get(type) || [];
    const index = current.indexOf(listener);
    if (index > -1) {
      current.splice(index, 1);
    }
  };
}

export async function emitCRMEvent(event: CRMEvent): Promise<void> {
  const listeners = eventListeners.get(event.type) || [];
  await Promise.all(listeners.map((listener) => listener(event)));
}

// Local storage CRM adapter (for demo/development)
export class LocalStorageCRM implements CRMInterface {
  private storageKey = 'crm_data';

  private getData(): {
    leads: Record<string, CRMLead>;
    deals: Record<string, CRMDeal>;
    activities: CRMActivity[];
  } {
    if (typeof window === 'undefined') {
      return { leads: {}, deals: {}, activities: [] };
    }
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : { leads: {}, deals: {}, activities: [] };
  }

  private saveData(data: ReturnType<typeof this.getData>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async createLead(lead: CRMLead): Promise<CRMLead> {
    const data = this.getData();
    const id = this.generateId();
    const newLead: CRMLead = {
      ...lead,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.leads[id] = newLead;
    this.saveData(data);

    await emitCRMEvent({
      type: 'lead.created',
      data: newLead,
      timestamp: new Date().toISOString(),
      source: 'local',
    });

    return newLead;
  }

  async updateLead(id: string, updates: Partial<CRMLead>): Promise<CRMLead> {
    const data = this.getData();
    if (!data.leads[id]) {
      throw new Error('Lead not found');
    }
    const updatedLead: CRMLead = {
      ...data.leads[id],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    data.leads[id] = updatedLead;
    this.saveData(data);

    await emitCRMEvent({
      type: 'lead.updated',
      data: updatedLead,
      timestamp: new Date().toISOString(),
      source: 'local',
    });

    return updatedLead;
  }

  async getLead(id: string): Promise<CRMLead | null> {
    const data = this.getData();
    return data.leads[id] || null;
  }

  async searchLeads(query: string): Promise<CRMLead[]> {
    const data = this.getData();
    const lowercaseQuery = query.toLowerCase();
    return Object.values(data.leads).filter(
      (lead) =>
        lead.email.toLowerCase().includes(lowercaseQuery) ||
        lead.firstName.toLowerCase().includes(lowercaseQuery) ||
        lead.lastName.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createDeal(deal: CRMDeal): Promise<CRMDeal> {
    const data = this.getData();
    const id = this.generateId();
    const newDeal: CRMDeal = {
      ...deal,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.deals[id] = newDeal;
    this.saveData(data);

    await emitCRMEvent({
      type: 'deal.created',
      data: newDeal,
      timestamp: new Date().toISOString(),
      source: 'local',
    });

    return newDeal;
  }

  async updateDeal(id: string, updates: Partial<CRMDeal>): Promise<CRMDeal> {
    const data = this.getData();
    if (!data.deals[id]) {
      throw new Error('Deal not found');
    }
    const previousStage = data.deals[id].stage;
    const updatedDeal: CRMDeal = {
      ...data.deals[id],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    data.deals[id] = updatedDeal;
    this.saveData(data);

    // Emit stage change event if applicable
    if (updates.stage && updates.stage !== previousStage) {
      await emitCRMEvent({
        type: 'deal.stage_changed',
        data: updatedDeal,
        timestamp: new Date().toISOString(),
        source: 'local',
      });
    }

    return updatedDeal;
  }

  async getDeal(id: string): Promise<CRMDeal | null> {
    const data = this.getData();
    return data.deals[id] || null;
  }

  async logActivity(activity: CRMActivity): Promise<CRMActivity> {
    const data = this.getData();
    const newActivity: CRMActivity = {
      ...activity,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };
    data.activities.push(newActivity);
    this.saveData(data);

    await emitCRMEvent({
      type: 'activity.logged',
      data: newActivity,
      timestamp: new Date().toISOString(),
      source: 'local',
    });

    return newActivity;
  }

  async getActivities(leadId: string): Promise<CRMActivity[]> {
    const data = this.getData();
    return data.activities.filter((a) => a.leadId === leadId);
  }
}

// CRM Factory
let crmInstance: CRMInterface | null = null;

export function initializeCRM(config: CRMConfig): CRMInterface {
  if (crmInstance) return crmInstance;

  switch (config.provider) {
    case 'salesforce':
      // Would return SalesforceCRM instance
      console.log('Salesforce CRM initialized');
      crmInstance = new LocalStorageCRM();
      break;
    case 'hubspot':
      // Would return HubSpotCRM instance
      console.log('HubSpot CRM initialized');
      crmInstance = new LocalStorageCRM();
      break;
    case 'zoho':
      // Would return ZohoCRM instance
      console.log('Zoho CRM initialized');
      crmInstance = new LocalStorageCRM();
      break;
    case 'pipedrive':
      // Would return PipedriveCRM instance
      console.log('Pipedrive CRM initialized');
      crmInstance = new LocalStorageCRM();
      break;
    default:
      crmInstance = new LocalStorageCRM();
  }

  return crmInstance;
}

export function getCRM(): CRMInterface {
  if (!crmInstance) {
    crmInstance = new LocalStorageCRM();
  }
  return crmInstance;
}

// Helper functions for common CRM operations
export async function captureLeadFromForm(formData: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  message?: string;
  propertyId?: string;
  source?: string;
}): Promise<CRMLead> {
  const crm = getCRM();

  const lead: CRMLead = {
    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phone: formData.phone,
    source: formData.source || 'website',
    status: 'new',
    propertyInterest: formData.propertyId ? [formData.propertyId] : [],
    notes: formData.message,
  };

  return crm.createLead(lead);
}

export async function createDealFromInquiry(
  leadId: string,
  propertyId: string,
  propertyPrice: number,
  currency = 'EUR'
): Promise<CRMDeal> {
  const crm = getCRM();

  const deal: CRMDeal = {
    leadId,
    propertyId,
    amount: propertyPrice,
    currency,
    stage: 'initial',
    probability: 10,
  };

  return crm.createDeal(deal);
}

export async function logViewingScheduled(
  leadId: string,
  propertyId: string,
  viewingDate: Date
): Promise<CRMActivity> {
  const crm = getCRM();

  return crm.logActivity({
    type: 'viewing',
    leadId,
    subject: `Property viewing scheduled`,
    description: `Viewing for property ${propertyId}`,
    dueDate: viewingDate.toISOString(),
  });
}

export default {
  initializeCRM,
  getCRM,
  onCRMEvent,
  captureLeadFromForm,
  createDealFromInquiry,
  logViewingScheduled,
};
