import { Classes, H6, Icon, IconName, MenuItem } from "@blueprintjs/core";
import { Select2, Select2Props } from "@blueprintjs/select";
import { FCC } from "types";

export type DetailedSelectItem =
  | DetailedSelectChoice
  | { type: "header"; header: string };
export interface DetailedSelectChoice {
  type: "choice";
  icon?: IconName;
  title: string;
  value: string;
  description: string;
}

const DetailedSelect2 = Select2.ofType<DetailedSelectItem>();

export const DetailedSelect: FCC<
  Omit<Select2Props<DetailedSelectItem>, "itemRenderer" | "onItemSelect"> & {
    onItemSelect: (item: DetailedSelectChoice) => void;
  }
> = ({ items, onItemSelect, children, ...props }) => {
  return (
    <DetailedSelect2
      className="inline-flex"
      items={items}
      filterable={false}
      itemRenderer={(action, { handleClick, handleFocus, modifiers }) => {
        if (!modifiers.matchesPredicate) return null;

        if (action.type === "header") {
          return (
            <li className={Classes.MENU_HEADER}>
              <H6>{action.header}</H6>
            </li>
          );
        }

        return (
          <MenuItem
            selected={modifiers.active}
            key={action.value}
            onClick={handleClick}
            onFocus={handleFocus}
            multiline
            text={
              <div className="flex items-start">
                <Icon icon={action.icon} className="pt-0.5" />
                <div className="flex flex-col ml-2">
                  <div className="flex-1">{action.title}</div>
                  <div className="text-xs text-gray-600">
                    {action.description}
                  </div>
                </div>
              </div>
            }
          />
        );
      }}
      onItemSelect={(item) => {
        item.type === "choice" && onItemSelect(item);
      }}
      {...props}
    >
      {children}
    </DetailedSelect2>
  );
};
