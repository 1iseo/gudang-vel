import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, RiwayatBarang } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RiwayatProps {
    riwayat: {
        data: RiwayatBarang[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Riwayat',
        href: '/riwayat',
    },
];

export default function Riwayat({ riwayat }: RiwayatProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Stok" />
            <main className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Riwayat Stok</CardTitle>
                        <CardDescription>Track perubahan stok barang.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Barang</TableHead>
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
                                                <div className="font-medium">{item.barang.nama}</div>
                                                <div className="text-xs text-muted-foreground">{item.barang.kode}</div>
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