"use client"
import React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash, Plus } from "lucide-react"
import Link from "next/link"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    filterColumn?: string,
    filterColumnPlaceholder?: string,
    nofilter?: boolean,
    addCause?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    filterColumn,
    filterColumnPlaceholder,
    nofilter,
    addCause
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            rowSelection,
        }
    })

    return (
        <div>
            <div className="flex items-end justify-between w-full py-4">
                {!nofilter && <Input
                    placeholder={filterColumnPlaceholder ?? "Search..."}
                    value={(table.getColumn(filterColumn ?? "")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filterColumn ?? "")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />}

                <div className={`${!nofilter ? "" : " ml-auto"} `}>
                    {addCause && <Link href={'/cause/create'} className=" inline-flex items-center gap-1 text-primaryShades-800">
                        <Plus size={19} />
                        Add cause
                    </Link>}

                    <Button
                        variant="secondary"
                        size="sm"
                        className=" bg-white"
                        onClick={() => {
                            console.log(table.getFilteredSelectedRowModel().rowsById)
                        }}
                    >
                        <Trash size={20} />

                    </Button>
                </div>

            </div>
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4 ">
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
    )
}
