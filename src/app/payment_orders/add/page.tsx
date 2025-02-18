import PaymentOrderForm from "@/components/Forms/PaymentOrderForm";
import { PaymentOrderCreatePageHeader } from "@/components/PaymentOrders/PaymentOrderPageHeaders";

export default function AddPaymentOrder() {
  return (
    <>
      <div className={"lg:max-w-2xl"}>
        <PaymentOrderCreatePageHeader />
      </div>

      <div className={"lg:max-w-2xl"}>
        <PaymentOrderForm />
      </div>
    </>
  );
}
