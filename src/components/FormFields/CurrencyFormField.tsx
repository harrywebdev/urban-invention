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

type CurrencyFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

const CurrencyFormField = <T extends FieldValues>({
  control,
  name,
}: CurrencyFormFieldProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Měna účtu</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              {...field}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Vyber měnu účtu" />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                <SelectItem value="CZK">CZK</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default CurrencyFormField;
