"use client";

import { FC } from "react";
import { Form } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  SelectScenarioFormSchema,
  SelectScenarioFormValues,
} from "@/data/forms/select-scenario.form";
import ScenarioPickerFormField from "@/components/FormFields/ScenarioPickerFormField";
import { useScenario } from "@/contexts/ScenarioContext";

type SelectScenarioFormProps = unknown;

const SelectScenarioForm: FC<SelectScenarioFormProps> = () => {
  const router = useRouter();
  const { setCurrentScenarioId } = useScenario();

  const form = useForm<SelectScenarioFormValues>({
    resolver: zodResolver(SelectScenarioFormSchema),
    defaultValues: {
      scenarioId: "",
    },
  });

  const { control } = form;

  const onSubmit = async (data: SelectScenarioFormValues) => {
    setCurrentScenarioId(data.scenarioId);
    router.refresh();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className={"space-y-4 py-5 px-6 bg-neutral-50 rounded-md"}>
            <ScenarioPickerFormField control={control} name="scenarioId" />
          </div>

          <SubmitButton>Vybrat</SubmitButton>
        </form>
      </Form>
    </>
  );
};

export default SelectScenarioForm;
