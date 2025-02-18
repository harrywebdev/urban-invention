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

import { TransactionType } from "@/data/types/transaction.types";

type TransactionTypeFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  onChange?: (value: TransactionType) => void;
};

const TransactionTypeFormField = <T extends FieldValues>({
  control,
  name,
  onChange,
}: TransactionTypeFormFieldProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Typ transakce</FormLabel>

            <Select
              onValueChange={(value) => {
                field.onChange(value);

                if (onChange !== undefined) {
                  onChange(TransactionType.parse(value));
                }
              }}
              {...field}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Vyber typ transakce" />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                <SelectItem value="expense">Odchozí</SelectItem>
                <SelectItem value="income">Příchozí</SelectItem>
                <SelectItem value="transfer">Převod</SelectItem>
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default TransactionTypeFormField;
