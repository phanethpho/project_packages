// src/index.d.ts
import { FC } from "react";

export interface Column {
  key: string;
  label: string;
}

export interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  selectable?: boolean;
  onSelect?: (selectedRows: Record<string, any>[]) => void;
}

export const DataTable: FC<DataTableProps>;
