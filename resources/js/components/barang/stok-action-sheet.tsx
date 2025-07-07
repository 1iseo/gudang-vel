import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Barang } from '@/types';
import InputError from '../input-error';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

// FIXME: FOCUS TRAP BUG

interface StokActionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    barang: Barang | null;
    actionType: 'in' | 'out';
}

export function StokActionSheet({ isOpen, onClose, barang, actionType }: StokActionSheetProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        jumlah: 1,
        keterangan: '',
    });

    const title = actionType === 'in' ? 'Stock In' : 'Stock Out';
    const description = `Masukkan jumlah stok yang akan ${actionType === 'in' ? 'ditambahkan' : 'dikeluarkan'} untuk barang ${barang?.nama}.`;

    useEffect(() => {
        if (isOpen) {
            reset();
            clearErrors();
        }
    }, [isOpen]);

    const handleClose = () => {
        setTimeout(() => {
            onClose();
        }, 150);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!barang) return;

        const url = actionType === 'in' ? route('barang.stock-in', barang.id) : route('barang.stock-out', barang.id);
        post(url, {
            onSuccess: () => handleClose(),
            preserveScroll: true,
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <Label htmlFor="jumlah">Jumlah</Label>
                        <Input
                            id="jumlah"
                            type="number"
                            value={data.jumlah}
                            onChange={(e) => setData('jumlah', parseInt(e.target.value, 10) || 1)}
                            className="mt-1 block w-full"
                            min="1"
                        />
                        <InputError message={errors.jumlah} className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                        <Textarea
                            id="keterangan"
                            value={data.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.keterangan} className="mt-2" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
