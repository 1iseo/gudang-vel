import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

type UserFormProps = {
    isOpen: boolean;
    onClose: () => void;
    user?: User;
};

export default function UserForm({ isOpen, onClose, user }: UserFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'pegawai',
        password: '',
        password_confirmation: '',
    });

    const { auth } = usePage().props as any;

    const isUpdating = !!user;

    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                email: user.email,
                role: user.role,
                password: '',
                password_confirmation: '',
            });
        }
    }, [user]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isUpdating) {
            put(route('users.update', user.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isUpdating ? 'Edit User' : 'Tambah User'}</DialogTitle>
                    <DialogDescription>
                        {isUpdating ? 'Ubah detail pengguna di bawah ini.' : 'Masukkan detail untuk pengguna baru.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <div className="col-span-3">
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <div className="col-span-3">
                                <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <div className="col-span-3">
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {auth.user.role === 'super_admin' && <SelectItem value="admin">Admin</SelectItem>}
                                        <SelectItem value="pegawai">Pegawai</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
