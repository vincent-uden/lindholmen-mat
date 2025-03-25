export interface RestaurantMenu {
  name: string;
  days: MenuDay[];
}

export interface MenuDay {
  date: Date;
  meals: Meal[];
}

export interface Meal {
  category: string;
  name: string;
}
