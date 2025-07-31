import React, { useState, useEffect, use } from 'react';
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
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon issue with webpack/vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LokasiWithCount {
    id: number;
    nama: string;
    barang_count: number;
    latitude?: string;
    longitude?: string;
}

interface PaginatedLokasi {
    data: LokasiWithCount[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number;
    to: number;
    total: number;
}

type PageProps = {
    lokasiList: PaginatedLokasi;
    errors: { nama?: string };
};

export default function LokasiIndex() {
    const { lokasiList, errors } = usePage<PageProps>().props;

    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [editingLokasi, setEditingLokasi] = useState<LokasiWithCount | null>(null);
    const [deletingLokasi, setDeletingLokasi] = useState<LokasiWithCount | null>(null);
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const [isConfirmNoMapOpen, setConfirmNoMapOpen] = useState(false);
    const [viewingLokasiMap, setViewingLokasiMap] = useState<LokasiWithCount | null>(null);


    const { data, setData, post, put, processing, errors: formErrors, reset } = useForm({
        id: undefined as number | undefined,
        nama: '',
        latitude: '',
        longitude: ''
    });

    // Effect to open edit dialog and set form data
    useEffect(() => {
        if (editingLokasi) {
            // Muat nama dan juga koordinat yang sudah ada
            setData({
                id: editingLokasi.id,
                nama: editingLokasi.nama,
                latitude: editingLokasi.latitude || '',
                longitude: editingLokasi.longitude || '',
            });
        } else {
            // Reset form saat dialog ditutup
            reset();
        }
    }, [editingLokasi]);

    const proceedWithSubmit = () => {
        post(route('lokasi.store'), {
            onSuccess: () => {
                setConfirmNoMapOpen(false); // Close confirmation if open
                setAddDialogOpen(false);    // Close the main form dialog
                reset();
            },
        });
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Check if coordinates are missing
        if (!data.latitude || !data.longitude) {
            setConfirmNoMapOpen(true); // If so, open the confirmation dialog
        } else {
            proceedWithSubmit();
        }
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("CALLLLLEEDDDD")
        if (!editingLokasi) return;
        put(route('lokasi.update', editingLokasi.id), {
            onSuccess: () => {
                setEditingLokasi(null);
                reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingLokasi) return;
        router.delete(route('lokasi.destroy', deletingLokasi.id), {
            onSuccess: () => setDeletingLokasi(null),
        });
    };

    return (
        <AppLayout>
            <Head title="Daftar Lokasi" />

            <main className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Lokasi</CardTitle>
                        <CardDescription>Kelola lokasi untuk semua barang di gudang.</CardDescription>
                        <CardAction>
                            <Button size="sm" className="gap-1" onClick={() => setAddDialogOpen(true)}>
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tambah Lokasi</span>
                            </Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Lokasi</TableHead>
                                    <TableHead className="text-center">Jumlah Barang</TableHead>
                                    <TableHead className="text-center">Map</TableHead>
                                    <TableHead><span className="sr-only">Aksi</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lokasiList.data.length > 0 ? (
                                    lokasiList.data.map((lokasi) => (
                                        <TableRow key={lokasi.id}>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={route('barang.index', { lokasi: lokasi.nama })}
                                                    className="hover:underline"
                                                >
                                                    {lokasi.nama}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary"><span className='font-semibold'>{lokasi.barang_count}</span> Barang</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {lokasi.latitude && lokasi.longitude ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="gap-1"
                                                        onClick={() => setViewingLokasiMap(lokasi)}
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        <span>Lihat Peta</span>
                                                    </Button>
                                                ) : (
                                                    <Badge variant="secondary">Tidak Ada</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
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
                                                            <Link href={route('barang.index', { lokasi: lokasi.nama })}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                <span>Lihat Barang</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        {/* TODO: ACTUALLY FIX THISSSSS */}
                                                        {/* NOTE: Tanpa setTimeout akan terjadi bug focus trap dan nanti UI tidak bisa diklik */}
                                                        <DropdownMenuItem onClick={() => setTimeout(() => setEditingLokasi(lokasi), 50)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-100"
                                                            onClick={() => setTimeout(() => setDeletingLokasi(lokasi), 50)}
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
                                            Belum ada lokasi.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                            Menampilkan <strong>{lokasiList.from}-{lokasiList.to}</strong> dari <strong>{lokasiList.total}</strong> lokasi
                        </div>
                        <Pagination className="ml-auto">
                            <PaginationContent>
                                {lokasiList.links.map((link, index) => (
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

            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleAddSubmit}>
                        <DialogHeader>
                            <DialogTitle>Tambah Lokasi Baru</DialogTitle>
                            <DialogDescription>Masukkan detail  lokasi baru.</DialogDescription>
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

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="map" className="text-right">
                                    Map
                                </Label>
                                <div className="col-span-3 flex items-center gap-2">
                                    <Input
                                        id="map"
                                        readOnly
                                        value={
                                            data.latitude && data.longitude
                                                ? `${parseFloat(data.latitude).toFixed(5)}, ${parseFloat(data.longitude).toFixed(5)}`
                                                : 'Belum dipilih'
                                        }
                                        className="flex-grow"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setMapModalOpen(true)}
                                    >
                                        Pilih
                                    </Button>
                                </div>
                                {/* You can add an error display for coordinates if needed */}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>Batal</Button>
                            <Button type="submit" disabled={processing}>Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!viewingLokasiMap} onOpenChange={() => setViewingLokasiMap(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Peta Lokasi: {viewingLokasiMap?.nama}</DialogTitle>
                        <DialogDescription>
                            Ini adalah titik koordinat yang tersimpan untuk lokasi ini.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {viewingLokasiMap?.latitude && viewingLokasiMap?.longitude ? (
                            <LocationViewerMap
                                lat={parseFloat(viewingLokasiMap.latitude)}
                                lng={parseFloat(viewingLokasiMap.longitude)}
                            />
                        ) : (
                            <p>Tidak ada data koordinat untuk ditampilkan.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isMapModalOpen} onOpenChange={setMapModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Pilih Lokasi di Peta</DialogTitle>
                        <DialogDescription>
                            Klik pada peta atau geser penanda untuk memilih lokasi yang tepat.
                        </DialogDescription>
                    </DialogHeader>
                    <MapPicker
                        initialPosition={(() => {
                            const lat = parseFloat(data.latitude);
                            const lng = parseFloat(data.longitude);
                            if (!isNaN(lat) && !isNaN(lng)) {
                                return { lat, lng };
                            }
                            return undefined;
                        })()}
                        onClose={() => setMapModalOpen(false)}
                        onLocationSelect={(lat, lng) => {
                            setData('latitude', lat.toString());
                            setData('longitude', lng.toString());
                            // Modal close dihandle oleh tombol confirm MapPicker 
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={!!editingLokasi} onOpenChange={() => setEditingLokasi(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <form id='edit-lokasi-form' onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle>Ubah Detail Lokasi</DialogTitle>
                            <DialogDescription>Perbarui detail untuk lokasi yang dipilih.</DialogDescription>
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
                        <div className="grid mb-4 grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-map" className="text-right">
                                Map
                            </Label>
                            <div className="col-span-3 flex items-center gap-2">
                                <Input
                                    id="edit-map"
                                    readOnly
                                    value={
                                        data.latitude && data.longitude
                                            ? `${parseFloat(data.latitude).toFixed(5)}, ${parseFloat(data.longitude).toFixed(5)}`
                                            : 'Belum dipilih'
                                    }
                                    className="flex-grow"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setMapModalOpen(true)}
                                >
                                    Ubah
                                </Button>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEditingLokasi(null)}>Batal</Button>
                            <Button type="submit" form='edit-lokasi-form' disabled={processing}>Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Alert */}
            <AlertDialog open={!!deletingLokasi} onOpenChange={() => setDeletingLokasi(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus lokasi
                            <span className="font-semibold"> "{deletingLokasi?.nama}"</span>.
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


            <AlertDialog open={isConfirmNoMapOpen} onOpenChange={setConfirmNoMapOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda tidak menginputkan titik koordinat menggunakan peta untuk lokasi ini.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Tidak</AlertDialogCancel>
                        <AlertDialogAction onClick={proceedWithSubmit}>
                            Ya
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout >
    );
}


const LocationViewerMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
    if (isNaN(lat) || isNaN(lng)) {
        return <div className="text-center text-red-500">Koordinat tidak valid.</div>;
    }

    const position: L.LatLngTuple = [lat, lng];

    useEffect(() => {
        console.log("LocationViewerMap mounted with position:", position);
    }, []);

    return (
        <MapContainer
            center={position}
            zoom={16}
            style={{ height: '400px', width: '100%', borderRadius: '8px' }}
            scrollWheelZoom={false} // Good practice for maps in modals
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}></Marker>
        </MapContainer>
    );
};


interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    onClose: () => void;
    initialPosition?: { lat: number; lng: number };
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect, onClose, initialPosition }) => {
    const defaultPosition: L.LatLngTuple = [-7.402, 109.694];
    const [position, setPosition] = useState<L.LatLngTuple | null>(null);

    // Get user's current location
    useEffect(() => {
        // Prioritaskan initialPosition jika ada
        if (initialPosition && initialPosition.lat && initialPosition.lng) {
            setPosition([initialPosition.lat, initialPosition.lng]);
        } else {
            // Jika tidak, baru cari lokasi pengguna saat ini
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                },
                () => {
                    // Fallback ke lokasi default jika gagal
                    setPosition([-7.402, 109.694]);
                }
            );
        }
    }, []);

    const DraggableMarker = () => {
        const markerRef = React.useRef<L.Marker>(null);
        const eventHandlers = React.useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker != null) {
                        const { lat, lng } = marker.getLatLng();
                        setPosition([lat, lng]);
                    }
                },
            }),
            []
        );

        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            },
        });


        return (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={position!}
                ref={markerRef}
            />
        );
    };

    if (!position) {
        return <div>Loading map...</div>;
    }

    const handleConfirm = () => {
        if (position) {
            onLocationSelect(position[0], position[1]);
            onClose();
        }
    };

    return (
        <div>
            <MapContainer
                center={position}
                zoom={15}
                style={{ height: '400px', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker />
            </MapContainer>
            <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Batal
                </Button>
                <Button onClick={handleConfirm}>
                    Konfirmasi Lokasi
                </Button>
            </div>
        </div>
    );


};