/* eslint-disable prettier/prettier */
export interface MenuItem {
    id: string;
    label: string;
    url?: string;
    children: MenuItem[];
}

export interface PageItem {
    id: string;
    label: string;
    url: string;
}