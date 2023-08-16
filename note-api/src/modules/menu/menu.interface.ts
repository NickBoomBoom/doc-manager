export interface MenuItem {
  id: number;
  isCategory: boolean;
  isNote: boolean;
  children?: MenuItem[];
}
