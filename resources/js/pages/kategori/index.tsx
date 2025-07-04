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

interface KategoriWithCount {
    id: number;
    nama: string;
    barang_count: number;
}

interface PaginatedKategori {
    data: KategoriWithCount[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

type PageProps = {
    kategoriList: PaginatedKategori;
    errors: { nama?: string };
};

export default function KategoriIndex() {
    const { kategoriList, errors } = usePage<PageProps>().props;

    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [editingKategori, setEditingKategori] = useState<KategoriWithCount | null>(null);
    const [deletingKategori, setDeletingKategori] = useState<KategoriWithCount | null>(null);

    const { data, setData, post, put, processing, errors: formErrors, reset } = useForm({
        id: undefined as number | undefined,
        nama: '',
    });

    // Effect to open edit dialog and set form data
    useEffect(() => {
        if (editingKategori) {
            setData({ id: editingKategori.id, nama: editingKategori.nama });
        } else {
            reset(); // Reset form when closing dialog
        }
    }, [editingKategori]);

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kategori.store'), {
            onSuccess: () => {
                setAddDialogOpen(false);
                reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("CALLLLLEEDDDD")
        if (!editingKategori) return;
        put(route('kategori.update', editingKategori.id), {
            onSuccess: () => {
                setEditingKategori(null);
                reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingKategori) return;
        router.delete(route('kategori.destroy', deletingKategori.id), {
            onSuccess: () => setDeletingKategori(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Daftar Kategori" />

            <main className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Kategori</CardTitle>
                        <CardDescription>Kelola kategori untuk semua barang di gudang.</CardDescription>
                        <CardAction>
                            <Button size="sm" className="gap-1" onClick={() => setAddDialogOpen(true)}>
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tambah Kategori</span>
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Kategori</TableHead>
                                    <TableHead className="text-center">Jumlah Barang</TableHead>
                                    <TableHead><span className="sr-only">Aksi</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {kategoriList.data.length > 0 ? (
                                    kategoriList.data.map((kategori) => (
                                        <TableRow key={kategori.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={route('barang.index', { kategori: kategori.nama })}
                                                    className="hover:underline"
                                                >
                                                    {kategori.nama}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">{kategori.barang_count} Barang</Badge>
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
                                                            <Link href={route('barang.index', { kategori: kategori.nama })}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                <span>Lihat Barang</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {/* TODO: ACTUALLY FIX THISSSSS */}
                                                        {/* NOTE: Tanpa setTimeout akan terjadi bug focus trap dan nanti UI tidak bisa diklik */}
                                                        <DropdownMenuItem onClick={() => setTimeout(() => setEditingKategori(kategori), 50)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            <span>Ubah Nama</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-100"
                                                            onClick={() => setTimeout(() => setDeletingKategori(kategori), 50)}
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
                                            Belum ada kategori.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                            Menampilkan <strong>{kategoriList.from}-{kategoriList.to}</strong> dari <strong>{kategoriList.total}</strong> kategori
                        </div>
                        <Pagination className="ml-auto">
                            <PaginationContent>
                                {kategoriList.links.map((link, index) => (
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
                            <DialogTitle>Tambah Kategori Baru</DialogTitle>
                            <DialogDescription>Masukkan nama untuk kategori baru.</DialogDescription>
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
            <Dialog open={!!editingKategori} onOpenChange={() => setEditingKategori(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <form id='edit-kategori-form' onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle>Ubah Nama Kategori</DialogTitle>
                            <DialogDescription>Perbarui nama untuk kategori yang dipilih.</DialogDescription>
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
                            <Button type="button" variant="outline" onClick={() => setEditingKategori(null)}>Batal</Button>
                            <Button type="submit" form='edit-kategori-form' disabled={processing}>Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={!!deletingKategori} onOpenChange={() => setDeletingKategori(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus kategori
                            <span className="font-semibold"> "{deletingKategori?.nama}"</span>.
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