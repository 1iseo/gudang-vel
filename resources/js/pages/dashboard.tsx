import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Barang } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Package, Boxes, Archive, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

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
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            Barang Perlu  Restock
                        </CardTitle>
                        {barangHampirHabis.length === 0 && (
                            <Badge variant="outline" className="text-muted-foreground">Semua stok aman</Badge>
                        )}
                    </CardHeader>
                    <CardContent>
                        <TooltipProvider>
                            <div className="rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead>Nama Barang</TableHead>
                                            <TableHead>Kode</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Lokasi</TableHead>
                                            <TableHead className="text-right">Stok</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {barangHampirHabis.filter(barang => barang.stok < 10).map((barang, index) => (
                                            <TableRow
                                                key={barang.id}
                                                className={clsx(
                                                    index % 2 === 0 ? 'bg-background' : 'bg-muted/30',
                                                    'hover:bg-muted transition-colors'
                                                )}
                                            >
                                                <TableCell>{barang.nama}</TableCell>
                                                <TableCell>{barang.kode}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">{barang.kategori.nama}</Badge>
                                                </TableCell>
                                                <TableCell>{barang.lokasi.nama}</TableCell>
                                                <TableCell className="text-right">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span
                                                                className={clsx(
                                                                    'font-medium',
                                                                    barang.stok < 5 ? 'text-red-500' : 'text-yellow-600'
                                                                )}
                                                            >
                                                                {barang.stok}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Stok tinggal {barang.stok} unit
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TooltipProvider>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
