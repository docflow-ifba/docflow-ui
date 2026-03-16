import { useState, useEffect, useCallback } from 'react';
import { Organization } from '@/dtos/organization';
import { findOrganizations } from '@/services/organization.service';
import { toast } from 'sonner';

export function useOrganizations(searchTerm: string = '') {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await findOrganizations(searchTerm || undefined);
      setOrganizations(data);
    } catch (err) {
      console.error('Erro ao buscar instituições:', err);
      setError('Não foi possível carregar as instituições.');
      toast.error('Erro ao carregar instituições.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return { organizations, loading, error, refetch: fetchOrganizations };
}
