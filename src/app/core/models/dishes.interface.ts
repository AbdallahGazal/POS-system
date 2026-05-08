export interface Dishes {
  data: Dish[];
}

export interface Dish {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  active: boolean;
}

export interface DishPayload {
  name: string;
  price: number;
  categoryId: number;
  active?: boolean;
}
