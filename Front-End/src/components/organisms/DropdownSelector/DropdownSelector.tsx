import React from "react";
import { DropdownOption } from "./dropdown";

/** Interface to define the props of the component */
interface DropdownSelectorProps {
  /** Title of the dropdown */
  title: string;
  /** Array of options to be shown in the dropdown */
  options: DropdownOption[];
}

const DropdownSelector = ({ title, options }: DropdownSelectorProps) => {
  return (
    <div className="btn-group dropdown">
      <button
        type="button"
        className="btn btn-secondary dropdown-toggle"
        data-toggle="dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        {title}
      </button>
      <div className="dropdown-menu">
        {options.map((option, idx) => (
          <button
            key={idx}
            className="dropdown-item"
            type="button"
            onClick={option.onClick}>
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DropdownSelector;
