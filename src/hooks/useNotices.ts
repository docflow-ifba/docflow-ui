import { useState, useEffect, useCallback } from 'react';
import { NoticeResponseDTO } from '@/dtos/notice-response.dto';
import { findNotices } from '@/services/notice.service';
import { toast } from 'sonner';

export function useNotices(searchTerm: string = '') {
  const [notices, setNotices] = useState<NoticeResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(
    async (filters?: { title?: string; isEmbeded?: boolean }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await findNotices({ title: searchTerm, ...filters });
        setNotices(data);
      } catch (err) {
        console.error('Erro ao buscar editais:', err);
        setError('Não foi possível carregar os editais.');
        toast.error('Erro ao carregar editais.');
      } finally {
        setLoading(false);
      }
    },
    [searchTerm],
  );

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return { notices, loading, error, refetch: fetchNotices };
}
