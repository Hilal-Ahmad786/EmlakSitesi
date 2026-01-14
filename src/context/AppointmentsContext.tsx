'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Appointment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyLocation: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  deleteAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
  getPropertyAppointments: (propertyId: string) => Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

const STORAGE_KEY = 'appointments';

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAppointments(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load appointments:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when appointments change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
      } catch (error) {
        console.warn('Failed to save appointments:', error);
      }
    }
  }, [appointments, isLoaded]);

  const addAppointment = useCallback(
    (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
      const newAppointment: Appointment = {
        ...appointment,
        id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setAppointments((prev) => [newAppointment, ...prev]);
    },
    []
  );

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? { ...apt, ...updates, updatedAt: new Date().toISOString() }
          : apt
      )
    );
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    updateAppointment(id, { status: 'cancelled' });
  }, [updateAppointment]);

  const deleteAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
  }, []);

  const getAppointment = useCallback(
    (id: string) => appointments.find((apt) => apt.id === id),
    [appointments]
  );

  const getPropertyAppointments = useCallback(
    (propertyId: string) =>
      appointments.filter((apt) => apt.propertyId === propertyId),
    [appointments]
  );

  const now = new Date();

  const upcomingAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);
      return aptDate >= now && apt.status !== 'cancelled';
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

  const pastAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);
      return aptDate < now || apt.status === 'cancelled';
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        deleteAppointment,
        getAppointment,
        getPropertyAppointments,
        upcomingAppointments,
        pastAppointments,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
}
