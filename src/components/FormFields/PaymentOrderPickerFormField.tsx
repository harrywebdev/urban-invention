import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, FieldValues, Path } from "react-hook-form";
import { usePaymentOrders } from "@/data/hooks/use-payment-orders";

type PaymentOrderPickerFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

const PaymentOrderPickerFormField = <T extends FieldValues>({
  control,
  name,
}: PaymentOrderPickerFormFieldProps<T>) => {
  const { data: paymentOrders } = usePaymentOrders();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Platební příkaz</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              {...field}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Vyber scénář" />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {paymentOrders?.map((po) => (
                  <SelectItem key={po.id} value={po.id}>
                    {po.triggerOn}. {po.description}
                  </SelectItem>
                ))}

                {paymentOrders !== undefined && paymentOrders.length === 0 ? (
                  <SelectItem disabled={true} value={"_disabled_"}>
                    Žádné platební příkazy
                  </SelectItem>
                ) : null}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default PaymentOrderPickerFormField;
