// File: resources/js/Pages/Barang/TambahBarangSheet.tsx

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useForm } from '@inertiajs/react';
import { Kategori, Lokasi } from '@/types';

interface TambahBarangSheetProps {
    isOpen: boolean;
    onClose: () => void;
    kategoriOptions: Kategori[];
    lokasiOptions: Lokasi[];
}

export function TambahBarangSheet({ isOpen, onClose, kategoriOptions, lokasiOptions }: TambahBarangSheetProps) {

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        lokasi_id: null as number | null,
        kategori_id: 1, // Default to Uncategorized
        stok: 0,
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('barang.store'), {
            forceFormData: true,
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) onClose();
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetContent side='right' className="sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Tambah Barang Baru</SheetTitle>
                    <SheetDescription>
                        Isi detail barang. Klik simpan untuk menyimpan.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-6">
                        {/* Nama */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama" className="text-right">
                                Nama
                            </Label>
                            <Input
                                id="nama"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="col-span-3"
                                placeholder="Nama barang"
                            />
                            {errors.nama && (
                                <p className="col-span-4 text-sm text-red-600 text-right">{errors.nama}</p>
                            )}
                        </div>

                        {/* Lokasi */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lokasi" className="text-right">
                                Lokasi
                            </Label>
                            <div className="col-span-3">
                                <SearchableSelect
                                    options={lokasiOptions.map(lok => ({ value: lok.id.toString(), label: lok.nama }))}
                                    value={data.lokasi_id?.toString() ?? ''}
                                    onChange={(value) => setData('lokasi_id', parseInt(value))}
                                    placeholder="Pilih lokasi"
                                    searchPlaceholder="Cari lokasi..."
                                    emptyText="Lokasi tidak ditemukan."
                                />
                            </div>
                            {errors.lokasi_id && (
                                <p className="col-span-4 text-sm text-red-600 text-right">{errors.lokasi_id}</p>
                            )}
                        </div>

                        {/* Stok */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stok" className="text-right">
                                Stok
                            </Label>
                            <Input
                                id="stok"
                                type="number"
                                min={0}
                                value={data.stok}
                                onChange={(e) => setData('stok', parseInt(e.target.value) || 0)}
                                className="col-span-3"
                            />
                            {errors.stok && (
                                <p className="col-span-4 text-sm text-red-600 text-right">{errors.stok}</p>
                            )}
                        </div>

                        {/* Kategori */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kategori_id" className="text-right">
                                Kategori
                            </Label>
                            <div className="col-span-3">
                                <SearchableSelect
                                    options={kategoriOptions.map(kat => ({ value: kat.id.toString(), label: kat.nama }))}
                                    value={data.kategori_id.toString()}
                                    onChange={(value) => setData('kategori_id', parseInt(value))}
                                    placeholder="Pilih kategori"
                                    searchPlaceholder="Cari kategori..."
                                    emptyText="Kategori tidak ditemukan."
                                />
                            </div>
                            {errors.kategori_id && (
                                <p className="col-span-4 text-sm text-red-600 text-right">{errors.kategori_id}</p>
                            )}
                        </div>

                        {/* Gambar */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image" className="text-right">
                                Foto
                            </Label>
                            <div className="col-span-2">
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    className="file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                    onChange={(e) =>
                                        setData('image', e.target.files ? e.target.files[0] : null)
                                    }
                                />
                                {errors.image && (
                                    <p className="text-sm text-red-600 mt-1">{errors.image}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </SheetClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Barang'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
