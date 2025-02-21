import { FC } from "react";
import EmptyState from "@/components/EmptyState";
import PaymentOrderTransactionsList from "@/components/PaymentOrderTransactions/PaymentOrderTransactionsList";
import { PaymentOrderWithTransactions } from "@/data/types/payment-order.types";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePaymentOrder } from "@/data/hooks/use-payment-orders";

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
          <div
            className={
              "flex flex-row justify-between items-center bg-neutral-50 border-b"
            }
          >
            <div className={"p-4"}>
              {paymentOrder.triggerOn}. den: {paymentOrder.description}
            </div>

            <Button
              type={"button"}
              onClick={() => {
                if (
                  confirm(
                    "Opravdu chceš odebrat tento příkaz včetně všech transakcí?",
                  )
                ) {
                  void deletePaymentOrder(paymentOrder.id);
                }
              }}
              variant={"outline"}
              size={"icon"}
              className={"text-red-500 mr-4"}
            >
              <Trash2Icon className={"w-6 h-6"} />
            </Button>
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
