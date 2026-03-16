import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { updateUser } from '@/services/user.service';
import { toast } from 'sonner';
import { profileSchema, type ProfileFormData } from '@/schemas/settings.schema';

export default function SettingsPage() {
  const { user: loggedUser, setUser: setLoggedUser } = useAuth();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: loggedUser?.name ?? '',
      email: loggedUser?.email ?? '',
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!loggedUser?.userId) return;
    try {
      await updateUser(loggedUser.userId, data);
      setLoggedUser({ ...loggedUser, name: data.name, email: data.email });
      toast.success('Perfil atualizado com sucesso!');
    } catch {
      toast.error('Erro ao atualizar perfil.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>

      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
        </TabsList>

        {/* PERFIL */}
        <TabsContent value="perfil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Verifique seu nome e e-mail</CardDescription>
            </CardHeader>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    disabled
                    id="nome"
                    placeholder="Seu nome completo"
                    aria-invalid={!!profileForm.formState.errors.name}
                    {...profileForm.register('name')}
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    disabled
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    aria-invalid={!!profileForm.formState.errors.email}
                    {...profileForm.register('email')}
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.email.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
