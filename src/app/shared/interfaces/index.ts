import { FormGroup, FormControl } from '@angular/forms';

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any> ? FormGroup<ControlsOf<T[K]>> : FormControl<T[K]>;
};

export interface IProfile {
  username: string;
  email: string;
  gender: string;
  city: string;
  address: string;
  company: string;
  mobile: string;
  tele: string;
  website: string;
  date: string;
}

export interface ITdDataTableColumnWidth {
  min?: number;
  max?: number;
}
export interface ITdDataTableColumn {
  name: string;
  label: string;
  tooltip?: string;
  numeric?: boolean;
  format?: (value: any) => any;
  nested?: boolean;
  sortable?: boolean;
  hidden?: boolean;
  filter?: boolean;
  width?: ITdDataTableColumnWidth | number;
}
