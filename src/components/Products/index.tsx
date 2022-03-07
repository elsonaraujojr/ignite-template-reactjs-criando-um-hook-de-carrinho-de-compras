import { MdAddShoppingCart } from "react-icons/md";
import { ProductItem } from "./styles";


interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

interface ProductProps {
  products: Product[];
  handleAddProduct: (id: number) => void;
  cartItemsAmount : CartItemsAmount;
}

export function ProductsItems({
  products,
  handleAddProduct,
  cartItemsAmount,
}: ProductProps): JSX.Element {
	return (
    <>
      {products.map((product) => (
        <ProductItem key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[product.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </ProductItem>
      ))}
    </>
  );
}
