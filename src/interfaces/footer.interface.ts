import type FacebookIcon from "@icons/FacebookIcon.astro";

export interface PageLink {
    display_name: string;
    url: string;
}

export interface NavigationItem {
    display_name: string;
    pages_links: PageLink[];
}

export interface SocialLink {
    display_name: string;
    url: string;
    icon: typeof FacebookIcon;
}

export interface FooterData {
    website_name: string;
    website_tagline: string;
    navigation_items: NavigationItem[];
    social_links: SocialLink[];
}
