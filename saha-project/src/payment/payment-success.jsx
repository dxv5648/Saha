import { useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import supabase from "../supabase-client";
import Footer from "../home-page/footer.jsx";
import Header from "../home-page/header.jsx";
import Background from "../home-page/background.jsx";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();

  // Clear cart and update order status after successful payment
  useEffect(() => {
    const redirectStatus = searchParams.get("redirect_status");
    const paymentIntent = searchParams.get("payment_intent");
    const fromPayment = location.state?.fromPayment === true;
    const shouldProcess =
      (redirectStatus === "succeeded" && paymentIntent) || fromPayment;

    if (!shouldProcess || !user?.id) return;

    const processSuccess = async () => {
      try {
        // Update order status to 'paid'
        if (paymentIntent) {
          try {
            const res = await fetch("/api/update-order-status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                paymentIntentId: paymentIntent,
                status: "paid",
              }),
            });
            if (res.ok) {
              console.log("Order status updated to paid");
            } else {
              console.error("Failed to update order status");
            }
          } catch (e) {
            console.error("Error updating order status:", e);
          }
        }

        // Clear cart and cart_items
        const { data: cartData, error: cartError } = await supabase
          .from("Cart")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (cartError && cartError.code !== "PGRST116") {
          console.error("Error fetching cart for clear:", cartError);
          return;
        }

        if (!cartData) return;

        // Delete all Cart_Items for this cart
        const { error: delCartItemError } = await supabase
          .from("Cart_Item")
          .delete()
          .eq("cart_id", cartData.id);

        if (delCartItemError) {
          console.error("Error clearing cart items after payment:", delCartItemError);
        }

        // Delete the Cart entry
        const { error: delCartError } = await supabase
          .from("Cart")
          .delete()
          .eq("id", cartData.id);

        if (delCartError) {
          console.error("Error clearing cart after payment:", delCartError);
        }

        console.log("Cart and cart items cleared successfully");
      } catch (e) {
        console.error("Error in processSuccess:", e);
      }
    };

    processSuccess();
  }, [searchParams, user?.id, location.state]);

  return (
    <div className="bg-black min-h-screen min-w-screen flex flex-col">
      <Header />
      <div className="w-full relative overflow-hidden flex-1">
        <div className="relative">
          <Background />
          <div className="relative inset-0 z-10 flex flex-col">
            <div className="flex flex-col items-center px-4 py-8 pb-16 min-h-screen">
              <div className="w-full max-w-2xl flex flex-col items-center justify-center flex-1">
                <div className="bg-[#161616F0] p-8 rounded-[20px] text-center">
                  {/* Success Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <h1 className="text-white text-4xl inter-semi-bold mb-4">
                    Payment Successful!
                  </h1>
                  <p className="text-[#D1D1D1] text-base mb-6">
                    Your payment has been processed successfully. Thank you for
                    your booking!
                  </p>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => navigate("/")}
                      className="w-full bg-white text-black text-base py-4 rounded-[10px] hover:bg-gray-100 transition font-medium"
                    >
                      Return to Home
                    </button>
                    <button
                      onClick={() => navigate("/Profile")}
                      className="w-full bg-[#1C1C1CB0] text-[#D1D1D1] text-sm py-3 rounded-[10px] border border-solid border-[#434343] hover:bg-[#2C2C2C] transition"
                    >
                      View My Bookings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
}
