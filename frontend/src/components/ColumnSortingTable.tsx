import React from "react";
import { Helmet } from "react-helmet-async";
import { useTable, useSortBy, TableOptions } from "react-table";

import { Card, Container, Table } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSort,
    faSortUp,
    faSortDown,
} from "@fortawesome/free-solid-svg-icons";


const ColumnSortingTable = (props: TableOptions<Record<string, unknown>>) => {
    const { columns, data } = props;

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable(
            {
                columns,
                data,
            },
            useSortBy
        );

    return (
        <Card>
            {/* <Card.Header>
                <Card.Title>Column Sorting</Card.Title>
                <h6 className="card-subtitle text-muted">
                    Column sorting by react-table
                </h6>
            </Card.Header> */}
            <Card.Body>
                <Table striped bordered {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column: any) => (
                                    // Add the sorting props to control sorting. For this example
                                    // we can add them into the header props
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render("Header")}
                                        {/* Add a sort direction indicator */}
                                        <span>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <FontAwesomeIcon icon={faSortUp} className="ms-2" />
                                                ) : (
                                                    <FontAwesomeIcon icon={faSortDown} className="ms-2" />
                                                )
                                            ) : (
                                                <FontAwesomeIcon icon={faSort} className="ms-2" />
                                            )}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default ColumnSortingTable