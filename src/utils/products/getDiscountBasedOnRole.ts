import {Role} from '../../redux/slice/authSlice';

interface DiscountParams {
  role: Role;
  discounted_price: number;
  original_price: number;
  salesperson_discounted_price: number;
  dnd_discounted_price: number;
}

export const getDiscountBasedOnRole = ({
  role,
  discounted_price,
  original_price,
  salesperson_discounted_price,
  dnd_discounted_price,
}: DiscountParams): number => {
  if (role === 'user') {
    return discounted_price || original_price;
  } else if (role === 'salesperson') {
    return salesperson_discounted_price || discounted_price || original_price;
  } else if (role === 'dnd') {
    return dnd_discounted_price || discounted_price || original_price;
  } else {
    return discounted_price || original_price;
  }
};
