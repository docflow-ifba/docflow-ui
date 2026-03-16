import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { NoticeStatusIcons } from '@/constants/NoticeStatusIcons';
import { CreateNoticeDTO } from '@/dtos/create-notice.dto';
import { NoticeResponseDTO } from '@/dtos/notice-response.dto';
import { NoticeStatus } from '@/enums/notice-status';
import { useDebounce } from '@/hooks/useDebounce';
import { createNotice, deleteNotice, embedNotice, findNotices, updateNotice } from '@/services/notice.service';
import { formatDate } from '@/utils/date';
import { Edit, Plus, RotateCcw, Search, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ConfirmNoticeDelete } from './ConfirmNoticeDelete';
import { NoticeFormDialog } from './NoticeFormDialog';
import Tooltip from 'rc-tooltip';

export default function NoticesPage() {
  const [notices, setNotices] = useState<NoticeResponseDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticesData = await findNotices({ title: debouncedSearch });
        setNotices(noticesData);
      } catch (error) {
        console.error('Erro ao buscar editais:', error);
      }
    };

    fetchNotices();
    const intervalId = setInterval(fetchNotices, 5000);
    return () => clearInterval(intervalId);
  }, [debouncedSearch]);

  const handleSaveNotice = async (noticeData: CreateNoticeDTO) => {
    if (editingNoticeId) {
      await updateNotice(editingNoticeId, noticeData);
    } else {
      await createNotice(noticeData);
    }
    const updated = await findNotices({ title: searchTerm });
    setNotices(updated);
  };

  const handleEmbedding = async (notice: NoticeResponseDTO) => {
    setEditingNoticeId(notice.noticeId);
    await embedNotice(notice.noticeId);
    const updated = await findNotices({ title: searchTerm });
    setNotices(updated);
  };

  const handleEditNotice = (notice: NoticeResponseDTO) => {
    setEditingNoticeId(notice.noticeId);
    setIsDialogOpen(true);
  };

  const handleDeleteNotice = async (noticeId: string) => {
    try {
      await deleteNotice(noticeId);
      const updated = await findNotices({ title: searchTerm });
      setNotices(updated);
    } catch (err) {
      console.error('Erro ao excluir edital:', err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Editais</h2>
        <Button
          onClick={() => {
            setEditingNoticeId(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Edital
        </Button>
      </div>

      <NoticeFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSaveNotice}
        noticeId={editingNoticeId}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar editais..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Data Final de Inscrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Instituição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum edital encontrado.
                </TableCell>
              </TableRow>
            ) : (
              notices.map((notice) => (
                <TableRow key={notice.noticeId}>
                  <TableCell>{notice.title || 'Não informado'}</TableCell>
                  <TableCell>{notice.deadline ? formatDate(notice.deadline) : 'Não informado'}</TableCell>
                  <TableCell>{NoticeStatusIcons[notice.status] || 'Não informado'}</TableCell>
                  <TableCell>{notice.organization?.name || 'Não informado'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {notice.status === NoticeStatus.PROCESSED && (
                        <Tooltip placement="top" overlay={<p>Reprocessar</p>}>
                          <Button onClick={() => handleEmbedding(notice)}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      )}
                      {notice.status !== NoticeStatus.PROCESSED && notice.status !== NoticeStatus.PROCESSING && (
                        <Tooltip placement="top" overlay={<p>Enviar para processamento</p>}>
                          <Button onClick={() => handleEmbedding(notice)}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      )}
                      <Tooltip placement="top" overlay={<p>Editar</p>}>
                        <Button onClick={() => handleEditNotice(notice)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip placement="top" overlay={<p>Apagar</p>}>
                        <ConfirmNoticeDelete onConfirm={() => handleDeleteNotice(notice.noticeId)} />
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
