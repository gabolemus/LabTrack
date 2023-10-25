/** Interface for the dropdown options */
export interface DropdownOption {
  /** Name of the option */
  name: string;
  /** Callback to be executed when the option is clicked */
  onClick: () => void;
}
