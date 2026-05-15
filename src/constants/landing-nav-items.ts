// constants/navItems.ts

export interface NavItem {
    label: string;
    sectionId: string; // ID of the section to scroll to
}

const navItems: NavItem[] = [
    { label: "Home", sectionId: "home" },
    { label: "Why us", sectionId: "why-choose-us" },
    { label: "Events", sectionId: "events" },
    { label: "Programmes", sectionId: "programmes" },
    { label: "Support", sectionId: "support" },
];

export default navItems;