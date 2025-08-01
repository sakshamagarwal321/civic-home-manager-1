
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MaintenancePayment {
  id: string;
  flat_number: string;
  resident_id?: string;
  payment_month: string;
  base_amount: number;
  penalty_amount: number;
  total_amount: number;
  payment_date: string;
  payment_method: 'cash' | 'cheque' | 'upi_imps' | 'bank_transfer';
  status: 'pending' | 'paid' | 'overdue' | 'verified';
  receipt_number: string;
  cheque_number?: string;
  cheque_date?: string;
  bank_name?: string;
  transaction_reference?: string;
  received_by?: string;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Flat {
  id: string;
  flat_number: string;
  flat_type: string;
  block?: string;
  resident_id?: string;
  resident_name?: string;
  is_active: boolean;
}

export interface MaintenanceSettings {
  id: string;
  society_name: string;
  society_address: string;
  base_maintenance_fee: number;
  late_payment_penalty: number;
  penalty_due_date: number;
  receipt_prefix: string;
  current_receipt_sequence: number;
  email_template?: string;
}

// Define the shape of data needed to create a payment
export interface CreatePaymentData {
  flat_number: string;
  resident_id?: string;
  payment_month: string;
  base_amount: number;
  payment_date: string;
  payment_method: 'cash' | 'cheque' | 'upi_imps' | 'bank_transfer';
  status?: 'pending' | 'paid' | 'overdue' | 'verified';
  cheque_number?: string;
  cheque_date?: string;
  bank_name?: string;
  transaction_reference?: string;
  received_by?: string;
}

export const useMaintenancePayments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all flats
  const { data: flats = [], isLoading: flatsLoading } = useQuery({
    queryKey: ['flats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flats')
        .select('*')
        .eq('is_active', true)
        .order('flat_number');
      
      if (error) throw error;
      return data as Flat[];
    }
  });

  // Get maintenance settings
  const { data: settings } = useQuery({
    queryKey: ['maintenance_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as MaintenanceSettings;
    }
  });

  // Get payments for a specific flat and month
  const checkExistingPayment = async (flatNumber: string, paymentMonth: string) => {
    const { data, error } = await supabase
      .from('maintenance_payments')
      .select('*')
      .eq('flat_number', flatNumber)
      .eq('payment_month', paymentMonth)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as MaintenancePayment | null;
  };

  // Get all payments with pagination
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['maintenance_payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MaintenancePayment[];
    }
  });

  // Calculate penalty for a given date and month
  const calculatePenalty = (paymentDate: string, paymentMonth: string, penaltyDueDate: number = 10, penaltyAmount: number = 200) => {
    const paymentDateObj = new Date(paymentDate);
    const monthObj = new Date(paymentMonth);
    const dueDate = new Date(monthObj.getFullYear(), monthObj.getMonth(), penaltyDueDate);
    
    if (paymentDateObj > dueDate) {
      const daysLate = Math.floor((paymentDateObj.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return { penalty: penaltyAmount, daysLate };
    }
    
    return { penalty: 0, daysLate: 0 };
  };

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: CreatePaymentData) => {
      const { data, error } = await supabase
        .from('maintenance_payments')
        .insert(paymentData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_payments'] });
      toast({
        title: "Payment Created Successfully",
        description: `Receipt ${data.receipt_number} generated`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive"
      });
    }
  });

  // Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MaintenancePayment> }) => {
      const { data, error } = await supabase
        .from('maintenance_payments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance_payments'] });
      toast({
        title: "Payment Updated",
        description: "Payment details updated successfully",
      });
    }
  });

  return {
    flats,
    flatsLoading,
    payments,
    paymentsLoading,
    settings,
    checkExistingPayment,
    calculatePenalty,
    createPayment: createPaymentMutation.mutateAsync,
    updatePayment: updatePaymentMutation.mutateAsync,
    isCreatingPayment: createPaymentMutation.isPending,
    isUpdatingPayment: updatePaymentMutation.isPending,
  };
};
