import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Currency } from "@/data/types";

type AmountFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  currency?: Currency;
};

const AmountFormField = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  currency,
}: AmountFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <div className="relative">
              <Input
                type="number"
                placeholder="0"
                step="1"
                className={currency ? "pr-12" : ""}
                {...field}
                onFocus={(e) => {
                  e.target.select();
                }}
                onChange={(value) =>
                  field.onChange(
                    isNaN(value.target.valueAsNumber)
                      ? ""
                      : value.target.valueAsNumber,
                  )
                }
              />

              {currency && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none w-10">
                  <span className="text-sm text-gray-500">{currency}</span>
                </div>
              )}
            </div>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AmountFormField;
