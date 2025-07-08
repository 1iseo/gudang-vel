import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, CardAction } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { MoreHorizontal, PlusCircle, Pencil, Trash2, Eye } from 'lucide-react';

interface LokasiWithCount {
    id: number;
    nama: string;
    barang_count: number;
}

interface PaginatedLokasi {
    data: LokasiWithCount[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

type PageProps = {
    lokasiList: PaginatedLokasi;
    errors: { nama?: string };
};

export default function LokasiIndex() {
    const { lokasiList, errors } = usePage<PageProps>().props;

    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [editingLokasi, setEditingLokasi] = useState<LokasiWithCount | null>(null);
    const [deletingLokasi, setDeletingLokasi] = useState<LokasiWithCount | null>(null);

    const { data, setData, post, put, processing, errors: formErrors, reset } = useForm({
        id: undefined as number | undefined,
        nama: '',
    });

    // Effect to open edit dialog and set form data
    useEffect(() => {
        if (editingLokasi) {
            setData({ id: editingLokasi.id, nama: editingLokasi.nama });
        } else {
            reset(); // Reset form when closing dialog
        }
    }, [editingLokasi]);

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('lokasi.store'), {
            onSuccess: () => {
                setAddDialogOpen(false);
                reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("CALLLLLEEDDDD")
        if (!editingLokasi) return;
        put(route('lokasi.update', editingLokasi.id), {
            onSuccess: () => {
                setEditingLokasi(null);
                reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingLokasi) return;
        router.delete(route('lokasi.destroy', deletingLokasi.id), {
            onSuccess: () => setDeletingLokasi(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Daftar Lokasi" />

            <main className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Lokasi</CardTitle>
                        <CardDescription>Kelola lokasi untuk semua barang di gudang.</CardDescription>
                        <CardAction>
                            <Button size="sm" className="gap-1" onClick={() => setAddDialogOpen(true)}>
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tambah Lokasi</span>
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Lokasi</TableHead>
                                    <TableHead className="text-center">Jumlah Barang</TableHead>
                                    <TableHead><span className="sr-only">Aksi</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lokasiList.data.length > 0 ? (
                                    lokasiList.data.map((lokasi) => (
                                        <TableRow key={lokasi.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={route('barang.index', { lokasi: lokasi.nama })}
                                                    className="hover:underline"
                                                >
                                                    {lokasi.nama}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary"><span className='font-semibold'>{lokasi.barang_count}</span> Barang</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('barang.index', { lokasi: lokasi.nama })}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                <span>Lihat Barang</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {/* TODO: ACTUALLY FIX THISSSSS */}
                                                        {/* NOTE: Tanpa setTimeout akan terjadi bug focus trap dan nanti UI tidak bisa diklik */}
                                                        <DropdownMenuItem onClick={() => setTimeout(() => setEditingLokasi(lokasi), 50)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            <span>Ubah Nama</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-100"
                                                            onClick={() => setTimeout(() => setDeletingLokasi(lokasi), 50)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Hapus</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            Belum ada lokasi.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                            Menampilkan <strong>{lokasiList.from}-{lokasiList.to}</strong> dari <strong>{lokasiList.total}</strong> lokasi
                        </div>
                        <Pagination className="ml-auto">
                            <PaginationContent>
                                {lokasiList.links.map((link, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href={link.url || '#'}
                                            preserveScroll
                                            preserveState
                                            className={!link.url ? 'pointer-events-none text-muted-foreground' : ''}
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                            </PaginationContent>
                        </Pagination>
                    </CardFooter>
                </Card>
            </main>

            {/* Add Category Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAddSubmit}>
                        <DialogHeader>
                            <DialogTitle>Tambah Lokasi Baru</DialogTitle>
                            <DialogDescription>Masukkan nama untuk lokasi baru.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nama" className="text-right">Nama</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className="col-span-3"
                                    autoFocus
                                />
                                {formErrors.nama && <p className="col-span-4 text-sm text-red-500 text-right">{formErrors.nama}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={!!editingLokasi} onOpenChange={() => setEditingLokasi(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <form id='edit-lokasi-form' onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle>Ubah Nama Lokasi</DialogTitle>
                            <DialogDescription>Perbarui nama untuk lokasi yang dipilih.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-nama" className="text-right">Nama</Label>
                                <Input
                                    id="edit-nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className="col-span-3"
                                    autoFocus
                                />
                                {formErrors.nama && <p className="col-span-4 text-sm text-red-500 text-right">{formErrors.nama}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingLokasi(null)}>Batal</Button>
                            <Button type="submit" form='edit-lokasi-form' disabled={processing}>Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={!!deletingLokasi} onOpenChange={() => setDeletingLokasi(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus lokasi
                            <span className="font-semibold"> "{deletingLokasi?.nama}"</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
