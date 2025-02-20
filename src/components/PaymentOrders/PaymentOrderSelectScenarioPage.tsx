import { FC } from "react";
import { PaymentOrderSelectScenarioPageHeader } from "@/components/PaymentOrders/PaymentOrderPageHeaders";
import PaymentOrderSelectScenarioForm from "@/components/Forms/PaymentOrderSelectScenarioForm";

type PaymentOrderSelectScenarioPageProps = unknown;

const PaymentOrderSelectScenarioPage: FC<
  PaymentOrderSelectScenarioPageProps
> = () => {
  return (
    <>
      <div className={"lg:max-w-2xl"}>
        <PaymentOrderSelectScenarioPageHeader />
      </div>

      <div className={"lg:max-w-2xl"}>
        <PaymentOrderSelectScenarioForm />
      </div>
    </>
  );
};

export default PaymentOrderSelectScenarioPage;
