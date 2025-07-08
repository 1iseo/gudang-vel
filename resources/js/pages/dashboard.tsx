import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Barang } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Package, Boxes, Archive } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type PageProps = {
    totalJenisBarang: number;
    totalStok: number;
    totalKategori: number;
    barangHampirHabis: Barang[];
};

export default function Dashboard() {
    const { totalJenisBarang, totalStok, totalKategori, barangHampirHabis } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Jenis Barang</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalJenisBarang}</div>
                            <p className="text-xs text-muted-foreground">item unik</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Stok Keseluruhan</CardTitle>
                            <Boxes className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalStok}</div>
                            <p className="text-xs text-muted-foreground">unit di gudang</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Kategori</CardTitle>
                            <Archive className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalKategori}</div>
                            <p className="text-xs text-muted-foreground">kategori terdaftar</p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Barang Perlu Segera Di-restock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Barang</TableHead>
                                    <TableHead>Kode</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Lokasi</TableHead>
                                    <TableHead className="text-right">Stok</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {barangHampirHabis.map((barang) => (
                                    <TableRow key={barang.id}>
                                        <TableCell>{barang.nama}</TableCell>
                                        <TableCell>{barang.kode}</TableCell>
                                        <TableCell>{barang.kategori.nama}</TableCell>
                                        <TableCell>{barang.lokasi.nama}</TableCell>
                                        <TableCell className="text-right">{barang.stok}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
