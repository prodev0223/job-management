import { SidebarItemsType } from "../../types/sidebar";

import {
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  CheckSquare,
  Grid,
  Heart,
  Home,
  Layout,
  List,
  PieChart,
  Sliders,
  MapPin,
  Users,
  Share,
  Trello,
} from "react-feather";

const pagesSection = [
  {
    href: "/",
    icon: Home,
    title: "Dashboard",
  },
  {
    href: "/jobs/list",
    icon: Trello,
    title: "Projects",
  },
  {
    href: "/clients",
    icon: Briefcase,
    title: "Clients",
  },
  {
    href: '/kiosk',
    icon: Users,
    title: "Kiosk"
  },
  {
    href: "/settings",
    icon: Sliders,
    title: "Settings",
  },
] as SidebarItemsType[];

const navItems = [
  {
    title: "Pages",
    pages: pagesSection,
  },
];

export default navItems;
