import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UserForm from './user-form';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { router } from '@inertiajs/react';

type Props = {
    users: User[];
};

export default function UserIndex({ users }: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    const { auth } = usePage().props as any;

    const openForm = (user?: User) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    const openDeleteAlert = (user: User) => {
        setSelectedUser(user);
        setIsDeleteAlertOpen(true);
    };

    const handleDelete = () => {
        if (selectedUser) {
            router.delete(route('users.destroy', selectedUser.id), {
                onSuccess: () => setIsDeleteAlertOpen(false),
            });
        }
    };

    const canManageUser = (targetUser: User) => {
        if (auth.user.role === 'super_admin') {
            return true;
        }
        if (auth.user.role === 'admin' && targetUser.role === 'pegawai') {
            return true;
        }
        return false;
    };

    return (
        <AppLayout>
            <Head title="Manajemen User" />
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Manajemen User</h1>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            Daftar semua pengguna di aplikasi Anda.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Button onClick={() => openForm()}>
                            Tambah User
                        </Button>
                    </div>
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0">
                                            Name
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            Email
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            Role
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {users.map((user) => (
                                        <tr key={user.email}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-0">
                                                {user.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{user.role}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                {canManageUser(user) && (
                                                    <div className="flex items-center justify-end gap-x-4">
                                                        <Button variant="ghost" size="sm" onClick={() => openForm(user)}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-500" onClick={() => openDeleteAlert(user)}>
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <UserForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} user={selectedUser} />

            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus pengguna secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
