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
  onDelete = null
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

            <DropdownMenuContent align="end">
              {onDetails && (
                <DropdownMenuItem onClick={() => onDetails(item)}>
                  <File /> Detail
                </DropdownMenuItem>
              )}

              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  <Pencil />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className={`text-red-400 hover:text-red-500`}
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
}) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10); // default 10 rows per page

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  const columns = React.useMemo(
    () => buildColumns(filteredData, onDetails, onEdit, onDelete),
    [filteredData, onDetails, onEdit, onDelete]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // <-- add pagination
    getSortedRowModel: getSortedRowModel(), // <-- Add this
    enableSorting: true, // optional, all columns sortable by default
  });

  // update table page size
  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  //rows selection
  const delSelected = async () => {
    const rows = await table.getFilteredSelectedRowModel().rows;
    const data = [];
    rows.forEach((item) => {
      data.push(item.original);
    });
    if (onSelected) onSelected(data);
  };

  // export data to excel
  const exportDataToExcel = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const header = Object.keys(data[0]); // Get headers from the first object
      const rows = data.map((row) => header.map((h) => row[h]).join(",")); // Map data to CSV rows
      const csvString = [header.join(","), ...rows].join("\n"); // Combine header and rows
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "export-data.csv";
      link.click();
      await URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };



  if (loading)
    return (
      <div className="p-4 w-full text-center pt-12">
        <Spinner2 className="m-auto size-9" />
      </div>
    );

  if (!data.length)
    return <div className="p-4 w-full text-center pt-12">No data found.</div>;

  return (
    <div className="max-w-full">
      <div className="flex justify-between items-center py-4">
        <div className="flex justify-baseline">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          {filteredData.length && (
            <Button variant="outline" className="w-22" onClick={exportDataToExcel}>
              <Download /> Export
            </Button>
            
          )}
          
          {table.getFilteredSelectedRowModel().rows.length > 0 &&
            onSelected && (
              <Button variant="outline" onClick={delSelected}>
                <span>[{table.getFilteredSelectedRowModel().rows.length}]</span>
                <Trash className="text-red-400" />
              </Button>
            )}
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2 bg-background">
                Rows: {pageSize} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[5, 10, 20, 50, 100].map((size) => (
                <DropdownMenuItem className="hover:cursor-pointer bg-background" key={size} onClick={() => setPageSize(size)}>
                  {size} rows
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize over:cursor-pointer bg-background"
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
        </div>
      </div>

      <div className="w-full overflow-auto border rounded-xl p-3 shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: (
                        <ArrowDownNarrowWide className="inline-flex ml-1 size-4" />
                      ),
                      desc: (
                        <ArrowUpWideNarrow className="inline-flex ml-1 size-4" />
                      ),
                    }[header.column.getIsSorted()] ?? null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
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
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
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
