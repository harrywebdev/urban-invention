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
import { formatAccountNumber } from "@/lib/utils";
import { AccountId, Currency } from "@/data/types/types";
import { forwardRef, ReactNode, Ref } from "react";
import { useAccountsForPicker } from "@/data/hooks/use-accounts";

type AccountPickerFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  limitByCurrency?: Currency;
  ignoreAccountId?: AccountId;
  isDisabled?: boolean;
  onChange?: (value: AccountId) => void;
};

const AccountPickerFormField = <
  T extends FieldValues,
  E extends HTMLButtonElement,
>(
  {
    control,
    name,
    label,
    limitByCurrency,
    ignoreAccountId,
    isDisabled,
    onChange,
  }: AccountPickerFormFieldProps<T>,
  ref: Ref<E>,
) => {
  const accounts = useAccountsForPicker({
    limitByCurrency,
    ignoreAccountId,
  });

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem
            className={isDisabled ? "opacity-50 pointer-events-none" : ""}
          >
            <FormLabel>{label}</FormLabel>

            <Select
              onValueChange={(value) => {
                field.onChange(value);

                if (onChange !== undefined) {
                  onChange(value);
                }
              }}
              {...field}
            >
              <FormControl>
                <SelectTrigger ref={ref}>
                  <SelectValue placeholder="Vyber účet" />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <span className={"whitespace-nowrap"}>
                      {account.name}
                      <small className={"inline text-gray-500 text-sm ml-1"}>
                        ({account.currency}, {formatAccountNumber(account)})
                      </small>
                    </span>
                  </SelectItem>
                ))}

                {accounts !== undefined && accounts.length === 0 ? (
                  <SelectItem disabled={true} value={"_disabled_"}>
                    Žádné účty
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

const AccountPickerFormFieldWithRef = forwardRef(AccountPickerFormField) as <
  T extends FieldValues,
>(
  props: AccountPickerFormFieldProps<T> & { ref?: Ref<HTMLButtonElement> },
) => ReactNode;

export default AccountPickerFormFieldWithRef;
