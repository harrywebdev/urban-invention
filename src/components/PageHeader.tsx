import { FC, PropsWithChildren } from "react";

type PageHeaderProps = PropsWithChildren;

const PageHeader: FC<PageHeaderProps> = ({ children }) => {
  return (
    <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-1 min-h-12">
      {children}
    </div>
  );
};

const PageHeaderTitle: FC<PageHeaderProps> = ({ children }) => {
  return <h2 className="text-2xl font-bold">{children}</h2>;
};

export { PageHeader, PageHeaderTitle };
