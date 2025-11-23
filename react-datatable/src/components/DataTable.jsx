import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Trash,
  Pencil,
  File,
  ArrowUpWideNarrow,
  ArrowDownNarrowWide,
  Download,
} from "lucide-react";
import {
  getSortedRowModel,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Input } from "./ui/input";
import { Spinner2 } from "./ui/spinner2";


// ---- Utility: Format Date -----
function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d)) return value;
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds())
  );
}

// ---- Utility: Detect Data Type -----
function detectType(value) {
  if (value === null || value === undefined) return "string";
  if (typeof value === "boolean") return "boolean";
  if (!isNaN(Number(value))) return "number";
  const date = new Date(value);
  if (!isNaN(date.getTime())) return "date";
  return "string";
}

// ---- Auto Column Generator -----
function generateColumnsFromData(data = []) {
  if (!data.length) return [];
  const sample = data[0];

  return Object.keys(sample).map((key) => {
    const type = detectType(sample[key]);

    return {
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      cell: ({ row }) => {
        const value = row.getValue(key);

        if (type === "date") return <div>{formatDate(value)}</div>;
        if (type === "number") return <div className="text-right">{value}</div>;
        if (type === "boolean")
          return <div className="text-center">{value ? "✓" : "✗"}</div>;

        return <div>{value}</div>;
      },
      enableSorting: true, // <-- make column sortable
    };
  });
}

// ---- Build Full Columns with Select + Actions -----
function buildColumns(
  data = [],
  onDetails = null,
  onEdit = null,
  onDelete = null,
  dropdownClass = "",
) {
  const autoCols = generateColumnsFromData(data);

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    ...autoCols,

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className={dropdownClass ? `hover:cursor-pointer ${dropdownClass}` : "capitalize hover:cursor-pointer bg-background"}>
              {onDetails && (
                <DropdownMenuItem onClick={() => onDetails(item)} className="hover:cursor-pointer bg-background">
                  <File /> Detail
                </DropdownMenuItem>
              )}

              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(item)} className="hover:cursor-pointer bg-background">
                  <Pencil />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className={`text-red-400 hover:text-red-500 hover:cursor-pointer bg-background`}
                  onClick={() => onDelete(item)}
                >
                  <Trash className="text-red-400" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

// ---- Main Datatable Component -----
export default function Datatable({
  data = [],
  loading = false,
  onDetails,
  onEdit,
  onDelete,
  onSelected,
  onExport = false,
  onSearch = false,
  onColumn = false,
  // Custom style props
  className = "",
  buttonClass = "",
  inputClass = "",
  checkboxClass = "",
  dropdownClass = "",
  exportButtonClass = "",
  tableRowClass = "",
}) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10); // default 10 rows per page

  const filteredData = React.useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  const columns = React.useMemo(
    () => buildColumns(filteredData, onDetails, onEdit, onDelete, checkboxClass, dropdownClass),
    [filteredData, onDetails, onEdit, onDelete, checkboxClass, dropdownClass]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
  });

  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const delSelected = async () => {
    const rows = await table.getFilteredSelectedRowModel().rows;
    const selectedData = rows.map((item) => item.original);
    if (onSelected) onSelected(selectedData);
  };

  const exportDataToExcel = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const header = Object.keys(data[0]);
      const rows = data.map((row) => header.map((h) => row[h]).join(","));
      const csvString = [header.join(","), ...rows].join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "export-data.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading)
    return (
      <div className={`p-4 w-full text-center pt-12 ${className}`}>
        <Spinner2 className="m-auto size-9" />
      </div>
    );

  if (!data.length)
    return (
      <div className={`p-4 w-full text-center pt-12 ${className}`}>
        No data found.
      </div>
    );

  return (
    <div className={`max-w-full ${className}`}>
      <div className="flex justify-between items-center py-4">
        <div className="flex justify-baseline gap-2">
          {onSearch && (
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`max-w-sm ${inputClass}`}
            />
          )}

          {filteredData.length && onExport && (
            <Button
              variant="outline"
              className={`${exportButtonClass} flex items-center gap-1`}
              onClick={exportDataToExcel}
            >
              <Download /> Export
            </Button>
          )}

          {table.getFilteredSelectedRowModel().rows.length > 0 &&
            onSelected && (
              <Button
                variant="outline"
                className={`${buttonClass} flex items-center gap-1`}
                onClick={delSelected}
              >
                <span>[{table.getFilteredSelectedRowModel().rows.length}]</span>
                <Trash className="text-red-400" />
              </Button>
            )}
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`${buttonClass}`}
              >
                Rows: {pageSize} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={dropdownClass ? `hover:cursor-pointer ${dropdownClass}` : "capitalize hover:cursor-pointer bg-background"}>
              {[5, 10, 20, 50, 100].map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => setPageSize(size)}
                >
                  {size} rows
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {onColumn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`${buttonClass}`}>
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={dropdownClass ? `hover:cursor-pointer ${dropdownClass}` : "capitalize hover:cursor-pointer bg-background"}>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className={`w-full overflow-auto border rounded-xl p-3 shadow-sm ${className}`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={tableRowClass ? `${tableRowClass}` : "border-background"}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <ArrowDownNarrowWide className="inline-flex ml-1 size-4" />,
                      desc: <ArrowUpWideNarrow className="inline-flex ml-1 size-4" />,
                    }[header.column.getIsSorted()] ?? null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className={tableRowClass ? `${tableRowClass}` : "border-background"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing{" "}
          {table.getFilteredRowModel().rows.length === 0
            ? 0
            : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} row(s)
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className={buttonClass}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={buttonClass}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}