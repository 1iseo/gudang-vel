import AppLayout from '@/layouts/app-layout';
import { Barang, RiwayatBarang } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RiwayatProps {
    barang: Barang;
    riwayat: {
        data: RiwayatBarang[];
    };
}

export default function RiwayatSatu({ barang, riwayat }: RiwayatProps) {
    return (
        <AppLayout>
            <Head title={`Riwayat Stok - ${barang.nama}`} />
            <main className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>Detail Barang</CardTitle>
                        <CardDescription>Informasi lengkap mengenai barang ini.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage
                                    src={barang.image_path ? `/${barang.image_path}` : 'https://placehold.co/80x80?text=NA'}
                                    alt={`Foto ${barang.nama}`}
                                />
                                <AvatarFallback>{barang.nama.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold">{barang.nama}</h2>
                                <p className="text-muted-foreground">Kode: {barang.kode}</p>
                                <p className="text-muted-foreground">Kategori: <Badge variant="outline">{barang.kategori.nama}</Badge></p>
                                <p className="text-muted-foreground">Lokasi: {barang.lokasi.nama}</p>
                                <p className="text-muted-foreground">Stok saat ini: <span className="font-semibold">{barang.stok}</span> unit</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Stok</CardTitle>
                        <CardDescription>Perubahan stok barang: <span className="font-semibold">{barang.nama}</span>.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead className="text-right">Jumlah</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Keterangan</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {riwayat.data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {new Date(item.created_at).toLocaleString('id-ID', {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'capitalize',
                                                        item.tipe === 'in'
                                                            ? 'border-green-500 text-green-500'
                                                            : 'border-red-500 text-red-500'
                                                    )}
                                                >
                                                    {item.tipe === 'in' ? (
                                                        <ArrowUp className="mr-1 h-3 w-3" />
                                                    ) : (
                                                        <ArrowDown className="mr-1 h-3 w-3" />
                                                    )}
                                                    {item.tipe}
                                                </Badge>
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'text-right font-semibold',
                                                    item.tipe === 'in' ? 'text-green-600' : 'text-red-600'
                                                )}
                                            >
                                                {item.tipe === 'in' ? '+' : '-'}
                                                {item.jumlah}
                                            </TableCell>
                                            <TableCell>{item.user.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{item.keterangan || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </AppLayout>
    );
}