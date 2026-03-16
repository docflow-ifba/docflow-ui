import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit, Plus, Trash2, Search } from 'lucide-react';
import { createOrganization, updateOrganization, deleteOrganization } from '@/services/organization.service';
import { Organization } from '@/dtos/organization';
import Tooltip from 'rc-tooltip';
import { toast } from 'sonner';
import { useOrganizations } from '@/hooks/useOrganizations';
import { organizationSchema, type OrganizationFormData } from '@/schemas/organization.schema';

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);

  const { organizations, refetch } = useOrganizations(searchTerm);

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: '' },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingOrgId(null);
    reset();
  };

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      if (editingOrgId) {
        await updateOrganization(editingOrgId, data);
        toast.success('Instituição atualizada com sucesso!');
      } else {
        await createOrganization(data);
        toast.success('Instituição criada com sucesso!');
      }
      closeDialog();
      refetch();
    } catch (err) {
      console.error('Erro ao salvar instituição:', err);
      toast.error('Erro ao salvar instituição.');
    }
  };

  const handleEditOrganization = (org: Organization) => {
    reset({ name: org.name });
    setEditingOrgId(org.organizationId ?? null);
    setIsDialogOpen(true);
  };

  const handleDeleteOrganization = async (organizationId: string) => {
    try {
      await deleteOrganization(organizationId);
      toast.success('Instituição excluída com sucesso!');
      refetch();
    } catch (err) {
      console.error('Erro ao excluir instituição:', err);
      toast.error('Erro ao excluir instituição.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Instituições</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) closeDialog();
            else setIsDialogOpen(true);
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                reset();
                setEditingOrgId(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Instituição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingOrgId ? 'Editar Instituição' : 'Nova Instituição'}</DialogTitle>
              <DialogDescription>
                {editingOrgId ? 'Atualize o nome da instituição.' : 'Adicione uma nova instituição ao sistema.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome da Instituição</Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome da instituição"
                    aria-invalid={!!errors.name}
                    {...register('name')}
                  />
                  {errors.name && <p className="text-xs text-destructive -mt-1">{errors.name.message}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {editingOrgId ? 'Salvar Alterações' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar instituições..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Nenhuma instituição encontrada.
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org) => (
                <TableRow key={org.organizationId}>
                  <TableCell>{org.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Tooltip placement="top" overlay={<span>Editar</span>}>
                        <Button onClick={() => handleEditOrganization(org)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip placement="top" overlay={<span>Cancelar</span>}>
                        <Button onClick={() => handleDeleteOrganization(org.organizationId!)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
