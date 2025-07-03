// File: resources/js/Pages/Barang/TambahBarangSheet.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface TambahBarangSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TambahBarangSheet({ isOpen, onClose }: TambahBarangSheetProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kode: '',
        nama: '',
        lokasi: '',
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

                        {/* Kode */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kode" className="text-right">
                                Kode
                            </Label>
                            <Input
                                id="kode"
                                value={data.kode}
                                onChange={(e) => setData('kode', e.target.value)}
                                className="col-span-3"
                                placeholder="Kode barang"
                            />
                            {errors.kode && (
                                <p className="col-span-4 text-sm text-red-600 text-right">{errors.kode}</p>
                            )}
                        </div>

                        {/* Lokasi */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lokasi" className="text-right">
                                Lokasi
                            </Label>
                            <Input
                                id="lokasi"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                                className="col-span-3"
                                placeholder="Lokasi barang"
                            />
                            {errors.kode && (
                                <p className="col-span-4 text-sm text-red-600 text-right">{errors.kode}</p>
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
