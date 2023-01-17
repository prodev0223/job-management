import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTable, usePagination, useRowSelect, TableOptions, useSortBy, useFilters, useGlobalFilter } from "react-table";

import {
    Card,
    Container,
    Table,
    Pagination,
    Row,
    Col,
    Form,
    Button,
} from "react-bootstrap";
import { Edit2, Eye } from "react-feather";
import useAppDispatch from "../hooks/useAppDispatch";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }: { column: any }) => {
    const count = preFilteredRows.length;

    return (
        <Form.Control
            value={filterValue || ""}
            onChange={(e) => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
            className="mt-2"
        />
    )
}

const PaginationTable = (props: TableOptions<Record<string, unknown>>) => {
    const { columns, data, usePageSize } = props;

    const filterTypes = React.useMemo(
        () => ({
            // Or, override the default text filter to use "startWith"
            text: (rows: any, id: any, filterValue: any) => {
                return rows.filter((row: any) => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
                        : true;
                })
            },
        }),
        []
    )


    const defaultColumn = React.useMemo(
        () => ({
            //Let's setup our default filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            defaultColumn, // Be sure to pass the defaultColumn option
            filterTypes,
            initialState: { pageIndex: 0, pageSize: usePageSize ? usePageSize : 20 },
        },
        useFilters,
        useGlobalFilter,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                ...columns,
            ])
        }
    );

    return (
        <Card className="table-responsive">
            {/* <Card.Header>
                <Card.Title>Pagination</Card.Title>
                <h6 className="card-subtitle text-muted">Pagination by react-table</h6>
            </Card.Header> */}
            <Card.Body>
                <Table striped bordered hover {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                        {/* Render the columns filter UI */}
                                        <div>
                                            {column.canFilter ? column.render("Filter") : null}
                                        </div>
                                        {/* <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <FontAwesomeIcon icon={faSortUp} className="ms-2" />
                                                ) : (
                                                    <FontAwesomeIcon icon={faSortDown} className="ms-2" />
                                                )
                                            ) : (
                                                <FontAwesomeIcon icon={faSort} className="ms-2" />
                                            )}
                                        </span> */}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row: any, i: any) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} key={i}>
                                    {row.cells.map((cell: any) => {
                                        return (
                                            <>
                                                <td {...cell.getCellProps()} key={i}>{cell.render("Cell")}</td>
                                            </>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>

                <Row>
                    <Col md="6">
                        <span className="mx-2">
                            Page{" "}
                            <strong>
                                {pageIndex + 1} of {pageOptions.length}
                            </strong>
                        </span>
                        <span className="ms-3 me-2">Show:</span>
                        <Form.Select
                            className="d-inline-block w-auto"
                            value={pageSize}
                            onChange={(e: any) => {
                                setPageSize(Number(e.target.value));
                            }}
                        >
                            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </Form.Select>

                        <span className="ms-3 me-2">Go to page:</span>
                        <Form.Control
                            className="d-inline-block"
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                gotoPage(page);
                            }}
                            style={{ width: "75px" }}
                        />
                    </Col>
                    <Col md="6">
                        <Pagination className="float-end">
                            <Pagination.First
                                onClick={() => gotoPage(0)}
                                disabled={!canPreviousPage}
                            />
                            <Pagination.Prev
                                onClick={() => previousPage()}
                                disabled={!canPreviousPage}
                            />
                            <Pagination.Next
                                onClick={() => nextPage()}
                                disabled={!canNextPage}
                            />
                            <Pagination.Last
                                onClick={() => gotoPage(pageCount - 1)}
                                disabled={!canNextPage}
                            />
                        </Pagination>
                    </Col>
                </Row>
            </Card.Body>
        </Card >
    );
};

export default PaginationTable