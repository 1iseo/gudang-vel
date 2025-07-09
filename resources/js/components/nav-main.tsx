import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Users } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const auth = page.props.auth as { user: User };

    const canViewUsers = auth.user.role === 'super_admin' || auth.user.role === 'admin';

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                            
                        </SidebarMenuButton>
                        {item.children && item.children.length > 0 && (
                                <SidebarMenuSub>
                                    {item.children.map((child) => (
                                        <SidebarMenuSubItem key={child.title}>
                                            <SidebarMenuSubButton asChild isActive={page.url.startsWith(child.href)}>
                                                <Link href={child.href} prefetch>
                                                    {child.icon && <child.icon />}
                                                    <span>{child.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            )}
                    </SidebarMenuItem>
                ))}
                {canViewUsers && (
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={page.url.startsWith('/users')} tooltip={{ children: 'Manajemen User' }}>
                            <Link href="/users" prefetch>
                                <Users />
                                <span>Manajemen User</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
