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

export type ResultRecord = {
  restaurantId: number;
  restaurantName: string;
  meal: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
    servedOn: Date;
    category: string;
    restaurantId: number;
  };
};

export type GroupedRestaurant = {
  restaurantName: string | null;
  days: MenuDay[];
};
