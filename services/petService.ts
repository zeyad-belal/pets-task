import { createClient } from '@supabase/supabase-js';
import { Pet, WeightLog, BodyConditionLog, VetVisitLog } from '../types';
import 'react-native-url-polyfill/auto';

// Using environment variables for Supabase credentials
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

export const petService = {
  // Pets
  async getPets(userId: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', userId);

    if (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }

    return data || [];
  },

  async getPetById(id: string): Promise<Pet | null> {
    // Fetch pet data
    const { data: pet, error: petError } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (petError) {
      console.error('Error fetching pet:', petError);
      throw petError;
    }

    if (!pet) return null;

    // Fetch weight logs
    const { data: weightLogs, error: weightError } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('pet_id', id)
      .order('date', { ascending: false });

    if (weightError) {
      console.error('Error fetching weight logs:', weightError);
      throw weightError;
    }

    // Fetch body condition logs
    const { data: bodyConditionLogs, error: bodyConditionError } = await supabase
      .from('body_condition_logs')
      .select('*')
      .eq('pet_id', id)
      .order('date', { ascending: false });

    if (bodyConditionError) {
      console.error('Error fetching body condition logs:', bodyConditionError);
      throw bodyConditionError;
    }

    // Fetch vet visit logs
    const { data: vetVisitLogs, error: vetVisitError } = await supabase
      .from('vet_visit_logs')
      .select('*')
      .eq('pet_id', id)
      .order('date', { ascending: false });

    if (vetVisitError) {
      console.error('Error fetching vet visit logs:', vetVisitError);
      throw vetVisitError;
    }

    // Combine all data
    return {
      ...pet,
      logs_weight: weightLogs || [],
      logs_bodycondition: bodyConditionLogs || [],
      logs_vet_visits: vetVisitLogs || []
    };
  },

  async createPet(pet: Omit<Pet, 'id' | 'created_at' | 'logs_weight' | 'logs_bodycondition' | 'logs_vet_visits'>): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .insert(pet)
      .select()
      .single();

    if (error) {
      console.error('Error creating pet:', error);
      throw error;
    }

    return {
      ...data,
      logs_weight: [],
      logs_bodycondition: [],
      logs_vet_visits: []
    };
  },

  async updatePet(id: string, updates: Partial<Omit<Pet, 'logs_weight' | 'logs_bodycondition' | 'logs_vet_visits'>>): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating pet:', error);
      throw error;
    }

    // Fetch the updated pet with all logs
    return this.getPetById(id) as Promise<Pet>;
  },

  async deletePet(id: string): Promise<void> {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting pet:', error);
      throw error;
    }
  },

  // Weight Logs
  async addWeightLog(weightLog: Omit<WeightLog, 'id'>): Promise<WeightLog> {
    const { data, error } = await supabase
      .from('weight_logs')
      .insert(weightLog)
      .select()
      .single();

    if (error) {
      console.error('Error adding weight log:', error);
      throw error;
    }

    return data;
  },

  async updateWeightLog(id: string, updates: Partial<Omit<WeightLog, 'id'>>): Promise<WeightLog> {
    const { data, error } = await supabase
      .from('weight_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating weight log:', error);
      throw error;
    }

    return data;
  },

  async deleteWeightLog(id: string): Promise<void> {
    const { error } = await supabase
      .from('weight_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting weight log:', error);
      throw error;
    }
  },

  // Body Condition Logs
  async addBodyConditionLog(bodyConditionLog: Omit<BodyConditionLog, 'id'>): Promise<BodyConditionLog> {
    const { data, error } = await supabase
      .from('body_condition_logs')
      .insert(bodyConditionLog)
      .select()
      .single();

    if (error) {
      console.error('Error adding body condition log:', error);
      throw error;
    }

    return data;
  },

  async updateBodyConditionLog(id: string, updates: Partial<Omit<BodyConditionLog, 'id'>>): Promise<BodyConditionLog> {
    const { data, error } = await supabase
      .from('body_condition_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating body condition log:', error);
      throw error;
    }

    return data;
  },

  async deleteBodyConditionLog(id: string): Promise<void> {
    const { error } = await supabase
      .from('body_condition_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting body condition log:', error);
      throw error;
    }
  },

  // Vet Visit Logs
  async addVetVisitLog(vetVisitLog: Omit<VetVisitLog, 'id'>): Promise<VetVisitLog> {
    const { data, error } = await supabase
      .from('vet_visit_logs')
      .insert(vetVisitLog)
      .select()
      .single();

    if (error) {
      console.error('Error adding vet visit log:', error);
      throw error;
    }

    return data;
  },

  async updateVetVisitLog(id: string, updates: Partial<Omit<VetVisitLog, 'id'>>): Promise<VetVisitLog> {
    const { data, error } = await supabase
      .from('vet_visit_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating vet visit log:', error);
      throw error;
    }

    return data;
  },

  async deleteVetVisitLog(id: string): Promise<void> {
    const { error } = await supabase
      .from('vet_visit_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting vet visit log:', error);
      throw error;
    }
  }
};
