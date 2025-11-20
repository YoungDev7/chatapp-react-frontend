/**
 * Props for the PasswordField component
 */
export interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  autoComplete?: string;
}
