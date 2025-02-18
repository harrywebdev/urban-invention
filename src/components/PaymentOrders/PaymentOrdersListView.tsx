import { FC } from "react";
import EmptyState from "@/components/EmptyState";
import PaymentOrderTransactionsList from "@/components/Transactions/PaymentOrderTransactionsList";
import { PaymentOrderWithTransactions } from "@/data/types/payment-order.types";

type PaymentOrdersListViewProps = {
  paymentOrders: PaymentOrderWithTransactions[];
};

const PaymentOrdersListView: FC<PaymentOrdersListViewProps> = ({
  paymentOrders,
}) => {
  if (paymentOrders.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {paymentOrders.map((paymentOrder) => (
        <div key={paymentOrder.id} className="border rounded-md">
          <div className={"bg-neutral-50 p-4 border-b"}>
            {paymentOrder.triggerOn}. den: {paymentOrder.description}
          </div>

          <PaymentOrderTransactionsList
            transactions={paymentOrder.transactions}
          />
        </div>
      ))}
    </div>
  );
};

export default PaymentOrdersListView;
