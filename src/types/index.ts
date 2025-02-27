export interface MenuItem {
    id: string;
    name: string;
    url?: string;
    children: MenuItem[];
    isExpanded?: boolean;
    cssClass?: string;
    type?: 'page' | 'custom' | 'subelement';
    parent?: string;
    moveDirection?: 'up' | 'down' | 'out';
}

export interface PageItem {
    id: string;
    name: string;
    url: string;
}