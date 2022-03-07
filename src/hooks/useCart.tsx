import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storageCart = localStorage.getItem("@RocketShoes:cart");
    // const storageCart = localStorage.removeItem("@RocketShoes:cart");

    if (storageCart) {
      return JSON.parse(storageCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const updateProduct = [...cart];
      const productExists = updateProduct.find((p) => p.id === productId);

      const stockAmount = await api
        .get<Stock>(`/stock/${productId}`)
        .then((response) => response.data.amount);

      const cartAmount = productExists ? productExists.amount : 0;
      const amount = cartAmount + 1;

      if (amount > stockAmount) {
        toast.error("Quantidade solicitada fora de estoque");
        return;
      }

      if (productExists) {
        productExists.amount = amount;
      } else {
        const product = await api
          .get<Product>(`/products/${productId}`)
          .then((response) => response.data);

        const newProduct = { ...product, amount };

        updateProduct.push(newProduct);
      }

      setCart(updateProduct);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updateProduct));
    } catch (err) {
      toast.error("Erro na adição do produto");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const oldCart = [...cart];
      const productIndex = oldCart.findIndex((p) => p.id === productId);

      if (productIndex >= 0) {
        oldCart.splice(productIndex, 1);
        setCart(oldCart);
        localStorage.setItem("@RocketShoes:cart", JSON.stringify(oldCart));
      } else {
        throw Error();
      }
    } catch {
      toast.error("Erro na remoção do produto");
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount <= 0) {
				return;
			}

			const stockAmount = await api.get<Stock>(`/stock/${productId}`).then((response) => response.data.amount);

			if (amount > stockAmount) {
				toast.error("Quantidade solicitada fora de estoque");
				return;
			}

			const updateProduct = [...cart];
			const productExists = updateProduct.find((p) => p.id === productId);

			if (productExists) {
				productExists.amount = amount;
				setCart(updateProduct);
				localStorage.setItem("@RocketShoes:cart", JSON.stringify(updateProduct));
			} else {
				throw Error();
			}
    } catch {
      toast.error("Erro na alteração de quantidade do produto");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
