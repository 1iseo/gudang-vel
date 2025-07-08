import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Head, router, useForm, usePage, Link } from '@inertiajs/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; // Using shadcn Avatar for consistency
import { DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Search, PlusCircle, MoreHorizontal, Pencil, Trash2, X, Check, ChevronsUpDown, ArrowRightLeft, History, ArrowUp, ArrowDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { TambahBarangSheet } from '@/components/barang/tambah-barang-sheet';
import { cn } from '@/lib/utils';
import { EditBarangSheet } from '@/components/barang/edit-barang-sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { StokActionSheet } from '@/components/barang/stok-action-sheet';
import { Barang as BarangType, Kategori as KategoriType, Lokasi as LokasiType } from '@/types';

interface ItemDetailModalProps {
    item: BarangType | null;
    onClose: () => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
    const [isShowing, setIsShowing] = React.useState(false);

    React.useEffect(() => {
        if (item) {
            const timer = setTimeout(() => setIsShowing(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsShowing(false);
        }
    }, [item]);

    const handleClose = () => {
        setIsShowing(false);
        setTimeout(onClose, 200);
    };

    if (!item) return null;

    return (
        <div
            onClick={handleClose}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-200 ${isShowing ? 'bg-opacity-60 backdrop-blur-sm' : 'bg-opacity-0'}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-3xl m-4 bg-card rounded-2xl shadow-xl transform transition-all duration-200 ${isShowing ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
                <Card className="border-0">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 p-6 flex items-center justify-center">
                            <img
                                src={item.image_path ? `${item.image_path}` : 'https://placehold.co/400x400?text=NA'}
                                alt={`Foto ${item.nama}`}
                                className="rounded-lg object-cover"
                            />
                        </div>
                        <div className="md:w-1/2 p-6 flex flex-col">
                            <CardHeader className="p-0">
                                <CardTitle className="text-3xl">{item.nama}</CardTitle>
                                <CardDescription className="pt-1">{item.kode}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 pt-4 flex-grow">
                                <div className="space-y-3 text-base">
                                    <div><strong>Kategori:</strong> <Badge variant="outline">{item.kategori.nama}</Badge></div>
                                    <div><strong>Lokasi:</strong> {item.lokasi.nama}</div>
                                    <div><strong>Stok Saat Ini:</strong> <span>{item.stok}</span> unit</div>
                                </div>
                            </CardContent>
                        </div>
                    </div>
                </Card>
                <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                    <X className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

interface PaginatedBarang {
    data: BarangType[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}



type PageProps = {
    list_barang: PaginatedBarang;
    filters: { search: string; kategori: string; lokasi: string };
    kategoriOptions: KategoriType[];
    lokasiOptions: LokasiType[];
};

export default function Barang() {
    const { list_barang, filters, kategoriOptions, lokasiOptions } = usePage<PageProps>().props;

    const [selectedItem, setSelectedItem] = useState<BarangType | null>(null);
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
    const [isFilterOpen, setFilterOpen] = useState(false);

    const [editingBarang, setEditingBarang] = useState<BarangType | null>(null);
    const [deletingBarang, setDeletingBarang] = useState<BarangType | null>(null);

    const [stokAction, setStokAction] = useState<{ barang: BarangType | null; type: 'in' | 'out' }>({ barang: null, type: 'in' });

    const { data, setData, get } = useForm({
        search: filters.search || '',
        kategori: filters.kategori || '',
        lokasi: filters.lokasi || '',
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            get(route('barang.index'), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [data.search, data.kategori, data.lokasi]);

    const handleOpenModal = (item: BarangType) => setSelectedItem(item);
    const handleCloseModal = () => setSelectedItem(null);

    const handleDelete = () => {
        if (!deletingBarang) return;
        router.delete(route('barang.destroy', deletingBarang.id), {
            onSuccess: () => setDeletingBarang(null),
            preserveScroll: true,
        });
    };

    const openStokSheet = (barang: BarangType, type: 'in' | 'out') => {
        setStokAction({ barang, type });
    };

    const closeStokSheet = () => {
        setStokAction({ barang: null, type: 'in' });
    };

    return (
        <AppLayout>
            <Head title="Daftar Barang" />
            <ItemDetailModal item={selectedItem} onClose={handleCloseModal} />
            <TambahBarangSheet
                isOpen={isAddSheetOpen}
                onClose={() => setIsAddSheetOpen(false)}
                kategoriOptions={kategoriOptions}
                lokasiOptions={lokasiOptions}
            />
            <EditBarangSheet
                isOpen={!!editingBarang}
                onClose={() => setEditingBarang(null)}
                barang={editingBarang}
                kategoriOptions={kategoriOptions}
                lokasiOptions={lokasiOptions}
            />
            <StokActionSheet
                isOpen={!!stokAction.barang}
                onClose={closeStokSheet}
                barang={stokAction.barang}
                actionType={stokAction.type}
            />

            <main className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Barang</CardTitle>
                        <CardDescription>Kelola semua barang yang tersimpan di gudang. Klik baris untuk melihat detail.</CardDescription>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari barang berdasarkan nama atau kode..."
                                    className="w-full rounded-lg bg-background pl-8 md:w-[320px]"
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                />
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <Popover open={isFilterOpen} onOpenChange={setFilterOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={isFilterOpen}
                                            className="w-[200px] justify-between h-8"
                                        >
                                            {data.kategori
                                                ? kategoriOptions.find((kat) => kat.nama.toLowerCase() === data.kategori.toLowerCase())?.nama
                                                : "Filter Kategori"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari kategori..." />
                                            <CommandList>
                                                <CommandEmpty>Kategori tidak ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    <CommandItem
                                                        key="all-kategori"
                                                        value=""
                                                        onSelect={() => {
                                                            setData('kategori', '');
                                                            setFilterOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                data.kategori === '' ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        Semua Kategori
                                                    </CommandItem>
                                                    {kategoriOptions.map((kat) => (
                                                        <CommandItem
                                                            key={kat.id}
                                                            value={kat.nama}
                                                            onSelect={(currentValue) => {
                                                                setData('kategori', currentValue === data.kategori ? '' : currentValue);
                                                                setFilterOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    data.kategori.toLowerCase() === kat.nama.toLowerCase() ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {kat.nama}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-[200px] justify-between h-8"
                                        >
                                            {data.lokasi
                                                ? lokasiOptions.find((lok) => lok.nama.toLowerCase() === data.lokasi.toLowerCase())?.nama
                                                : "Filter Lokasi"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari lokasi..." />
                                            <CommandList>
                                                <CommandEmpty>Lokasi tidak ditemukan.</CommandEmpty>
                                                <CommandGroup>
                                                    <CommandItem
                                                        key="all-lokasi"
                                                        value=""
                                                        onSelect={() => {
                                                            setData('lokasi', '');
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                data.lokasi === '' ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        Semua Lokasi
                                                    </CommandItem>
                                                    {lokasiOptions.map((lok) => (
                                                        <CommandItem
                                                            key={lok.id}
                                                            value={lok.nama}
                                                            onSelect={(currentValue) => {
                                                                setData('lokasi', currentValue === data.lokasi ? '' : currentValue);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    data.lokasi.toLowerCase() === lok.nama.toLowerCase() ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {lok.nama}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {data.kategori && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setData('kategori', '')}
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Clear Kategori Filter</span>
                                    </Button>
                                )}
                                <Button size="sm" className="h-8 gap-1" onClick={() => setIsAddSheetOpen(true)}>
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tambah Barang</span>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hidden w-[100px] sm:table-cell"><span className="sr-only">Foto</span></TableHead>
                                        <TableHead>Kode Barang</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Lokasi</TableHead>
                                        <TableHead className="text-right">Stok</TableHead>
                                        <TableHead><span className="sr-only">Aksi</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {list_barang.data.map((item) => (
                                        <TableRow key={item.id} onClick={() => handleOpenModal(item)} className="cursor-pointer">
                                            <TableCell className="hidden sm:table-cell">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage
                                                        src={item.image_path ? `${item.image_path}` : 'https://placehold.co/40x40?text=NA'}
                                                        alt={`Foto ${item.nama}`}
                                                    />
                                                    <AvatarFallback>{item.nama.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell className="font-medium">{item.kode}</TableCell>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell><Badge variant="outline">{item.kategori.nama}</Badge></TableCell>
                                            <TableCell>{item.lokasi.nama}</TableCell>
                                            <TableCell className="text-right">{item.stok}</TableCell>
                                            <TableCell onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Aksi Cepat</DropdownMenuLabel>
                                                        <DropdownMenuItem onSelect={() => setTimeout(() => openStokSheet(item, 'in'), 50)}>
                                                            <ArrowUp className="mr-2 h-4 w-4" />
                                                            <span>Stock In</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onSelect={() => setTimeout(() => openStokSheet(item, 'in'), 50)}>
                                                            <ArrowDown className="mr-2 h-4 w-4" />
                                                            <span>Stock Out</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuLabel>Lainnya</DropdownMenuLabel>
                                                        <DropdownMenuItem onSelect={() => setTimeout(() => setEditingBarang(item), 50)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('barang.history', item.id)}>
                                                                <History className="mr-2 h-4 w-4" />
                                                                <span>Riwayat Stok</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-100"
                                                            onSelect={() => setTimeout(() => setDeletingBarang(item), 50)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Hapus</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                            Menampilkan <strong>{list_barang.from}-{list_barang.to}</strong> dari <strong>{list_barang.total}</strong> produk
                        </div>
                        <Pagination className="ml-auto">
                            <PaginationContent>
                                {list_barang.links.map((link, index) => (
                                    <PaginationItem key={index} >
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
            <AlertDialog open={!!deletingBarang} onOpenChange={() => setDeletingBarang(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus barang
                            <span className="font-semibold"> "{deletingBarang?.nama}"</span> secara permanen.
                            Data yang sudah dihapus tidak dapat dikembalikan.
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
