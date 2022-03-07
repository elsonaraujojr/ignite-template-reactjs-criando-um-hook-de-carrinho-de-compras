import { useEffect, useState } from "react";
import { ProductsItems } from "../../components/Products";
import { useCart } from "../../hooks/useCart";
import { api } from "../../services/api";
import { formatPrice } from "../../util/format";
import { ProductList } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const newSumAmount = { ...sumAmount };
    newSumAmount[product.id] = product.amount;

    return newSumAmount;
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      api.get<ProductFormatted[]>("products").then((response) => {
        setProducts(
          response.data.map((product) => ({
            ...product,
            priceFormatted: formatPrice(product.price),
          }))
        );
      });
		}
		loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    // TODO
    addProduct(id);
  }

  return (
    <ProductList>
      <ProductsItems
        handleAddProduct={handleAddProduct}
        products={products}
        cartItemsAmount={cartItemsAmount}
      />
    </ProductList>
  );
};

export default Home;
