import Footer from "../home-page/footer.jsx";
import Header from "../home-page/header.jsx";
import Background from "../home-page/background.jsx";
import CartHeader from "./cart-header.jsx";
import CartItems from "./cart-items.jsx";
import OrderSummary from "./order-summary.jsx";

export default function Cart() {
  return (
    <div className="bg-black min-h-screen min-w-screen flex flex-col">
      <Header />
      <Body />
      <Footer className="mt-auto" />
    </div>
  );
}

function Body() {
  return (
    <div className="w-full relative overflow-hidden">
      <div className="relative">
        <Background />
        <div className="relative inset-0 z-10 flex flex-col">
          <CartHeader />
          <div className="flex justify-center px-4 py-8 pb-16">
            <div className="w-full max-w-350 flex gap-8">
              <CartItems />
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
