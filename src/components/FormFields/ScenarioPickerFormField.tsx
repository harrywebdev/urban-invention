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
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/data/db";

type ScenarioPickerFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

const ScenarioPickerFormField = <T extends FieldValues>({
  control,
  name,
}: ScenarioPickerFormFieldProps<T>) => {
  const scenarios = useLiveQuery(() => db.scenarios.toArray(), []);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Scénář</FormLabel>
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
                {scenarios?.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}

                {scenarios !== undefined && scenarios.length === 0 ? (
                  <SelectItem disabled={true} value={"_disabled_"}>
                    Žádné scénáře
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

export default ScenarioPickerFormField;
