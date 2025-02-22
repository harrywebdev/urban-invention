import { FC } from "react";
import SelectScenarioForm from "@/components/Forms/SelectScenarioForm";
import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";

type SelectScenarioPageProps = unknown;

const SelectScenarioPage: FC<SelectScenarioPageProps> = () => {
  return (
    <>
      <div className={"lg:max-w-2xl"}>
        <PageHeader>
          <PageHeaderTitle>Vyber scénář</PageHeaderTitle>
        </PageHeader>
      </div>

      <div className={"lg:max-w-2xl"}>
        <SelectScenarioForm />
      </div>
    </>
  );
};

export default SelectScenarioPage;
