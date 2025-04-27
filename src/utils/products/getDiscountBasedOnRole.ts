type Role = 'user' | 'salesperson' | 'dnd';

interface DiscountParams {
  role: Role;
  discounted_price: number | null;
  salesperson_discounted_price: number | null;
  dnd_discounted_price: number | null;
}

export const getDiscountBasedOnRole = ({
  role,
  discounted_price,
  salesperson_discounted_price,
  dnd_discounted_price,
}: DiscountParams): number | null => {
  if (role === 'user') {
    return discounted_price;
  } else if (role === 'salesperson') {
    return salesperson_discounted_price;
  } else if (role === 'dnd') {
    return dnd_discounted_price;
  } else {
    return null;
  }
};