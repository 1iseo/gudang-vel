import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: string;
    [key: string]: unknown; // Additional properties...
}

export interface Kategori {
    id: number;
    nama: string;
    created_at: string;
    updated_at: string;
}

export interface Barang {
    id: number;
    kode: string;
    nama: string;
    stok: number;
    min_stok: number; // Stok minimal sebelum dianggap hampir habis / perlu restock 
    lokasi_id: number;
    lokasi: Lokasi;
    kategori_id: number;
    image_path: string;
    kategori: Kategori;
    created_at: string;
    updated_at: string;
}

export interface RiwayatBarang {
    id: number;
    barang_id: number;
    user_id: number;
    tipe: 'in' | 'out';
    jumlah: number;
    keterangan: string;
    user: User;
    created_at: string;
    updated_at: string;
    barang: Barang;
}

export interface Lokasi {
    id: number;
    nama: string;
    latitude: number | null;
    longitude: number | null;
    created_at: string;
    updated_at: string;
}