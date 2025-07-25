import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
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
import { Barang, Kategori, Lokasi } from '@/types';

interface EditBarangSheetProps {
    isOpen: boolean;
    onClose: () => void;
    barang: Barang | null;
    kategoriOptions: Kategori[];
    lokasiOptions: Lokasi[];
}

export const EditBarangSheet: React.FC<EditBarangSheetProps> = ({ isOpen, onClose, barang, kategoriOptions, lokasiOptions }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PUT',
        nama: '',
        kode: '',
        kategori_id: '',
        lokasi_id: '',
        stok: 0,
        min_stok: 0,
        image: null as File | null,
    });

    // Mengisi form saat data 'barang' berubah
    useEffect(() => {
        if (barang) {
            setData({
                _method: 'PUT',
                nama: barang.nama,
                kode: barang.kode,
                kategori_id: barang.kategori.id.toString(),
                lokasi_id: barang.lokasi.id.toString(),
                stok: barang.stok,
                min_stok: barang.min_stok,
                image: null,
            });
        }
    }, [barang]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!barang) return;

        post(route('barang.update', barang.id), {
            onSuccess: () => {
                onClose();
                reset(); // Reset form setelah sukses
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
                    <SheetTitle>Edit Barang</SheetTitle>
                    <SheetDescription>
                        Perbarui detail untuk barang ini. Klik simpan jika sudah selesai.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-6">
                        {/* Nama */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nama-edit" className="text-right">
                                Nama
                            </Label>
                            <Input
                                id="nama-edit"
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
                            <Label htmlFor="kode-edit" className="text-right">
                                Kode
                            </Label>
                            <Input
                                id="kode-edit"
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
                            <Label htmlFor="lokasi-edit" className="text-right">
                                Lokasi
                            </Label>
                            <div className="col-span-3">
                                <SearchableSelect
                                    options={lokasiOptions.map(lok => ({ value: lok.id.toString(), label: lok.nama }))}
                                    value={data.lokasi_id?.toString() ?? ''}
                                    onChange={(value) => setData('lokasi_id', value)}
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
                            <Label htmlFor="stok-edit" className="text-right">
                                Stok
                            </Label>
                            <Input
                                id="stok-edit"
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

                        {/* Min Stok */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="min_stok" className="text-right flex justify-end gap-1 items-center">
                                Min. Stok
                                <span title="Stok minimum sebelum barang dianggap hampir habis. Jika nilai 0, maka dianggap tidak ada nilai min." className="cursor-pointer text-gray-400 hover:text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </span>
                            </Label>
                            <Input
                                id="min_stok"
                                type="number"
                                min={0}
                                value={data.min_stok}
                                onChange={(e) => setData('min_stok', parseInt(e.target.value) || 0)}
                                className="col-span-3"
                            />
                            {errors.stok && (
                                <p className="col-span-4 text-sm text-red-600 text-right">{errors.min_stok}</p>
                            )}
                        </div>

                        {/* Kategori */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="kategori_id-edit" className="text-right">
                                Kategori
                            </Label>
                            <div className="col-span-3">
                                <SearchableSelect
                                    options={kategoriOptions.map(kat => ({ value: kat.id.toString(), label: kat.nama }))}
                                    value={data.kategori_id.toString()}
                                    onChange={(value) => setData('kategori_id', value)}
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
                            <Label htmlFor="image-edit" className="text-right">
                                Foto
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="image-edit"
                                    type="file"
                                    accept="image/*"
                                    className="file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                    onChange={(e) =>
                                        setData('image', e.target.files ? e.target.files[0] : null)
                                    }
                                />
                                <p className="text-xs text-muted-foreground mt-2">Kosongkan jika tidak ingin mengubah foto.</p>
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
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};