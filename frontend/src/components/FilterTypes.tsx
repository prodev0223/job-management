import React from "react";
import { Form } from "react-bootstrap";

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
export function NumberRangeColumnFilter({
    column: { filterValue = [], preFilteredRows, setFilter, id },
}: {
    column: any;
}) {
    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
        preFilteredRows.forEach((row: any) => {
            min = Math.min(row.values[id], min);
            max = Math.max(row.values[id], max);
        });
        return [min, max];
    }, [id, preFilteredRows]);

    return (
        <div className="d-flex mt-2">
            <Form.Control
                value={filterValue[0] || ""}
                type="number"
                onChange={(e) => {
                    const val = e.target.value;
                    setFilter((old = []) => [
                        val ? parseInt(val, 10) : undefined,
                        old[1],
                    ]);
                }}
                placeholder={`Min (${min})`}
                style={{
                    width: "110px",
                }}
            />
            <span className="mx-2 mt-1">to</span>
            <Form.Control
                value={filterValue[1] || ""}
                type="number"
                onChange={(e) => {
                    const val = e.target.value;
                    setFilter((old = []) => [
                        old[0],
                        val ? parseInt(val, 10) : undefined,
                    ]);
                }}
                placeholder={`Max (${max})`}
                style={{
                    width: "110px",
                }}
            />
        </div>
    );
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}: {
    column: any;
}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row: any) => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
        <Form.Select
            value={filterValue}
            onChange={(e: any) => {
                setFilter(e.target.value || undefined);
            }}
        >
            <option value="">All</option>
            {options.map((option: any, i: any) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </Form.Select>
    );
}

export const dateBetweenFilterFn = (rows: any[], id: string | number, filterValues: (string | number | Date)[]) => {
    const sd = filterValues[0] ? new Date(filterValues[0]) : undefined
    const ed = filterValues[1] ? new Date(filterValues[1]) : undefined

    if (ed || sd) {
        return rows.filter(r => {
            const cellDate = new Date(r.values[id])

            if (ed && sd) {
                return cellDate >= sd && cellDate <= ed
            } else if (sd) {
                return cellDate >= sd
            } else if (ed) {
                return cellDate <= ed
            }
        })
    } else {
        return rows
    }
}

export const DateRangeColumnFilter = ({
    column: {
        filterValue = [],
        preFilteredRows,
        setFilter,
        id
    } }: {
        column: any;
    }) => {
    const [min, max] = React.useMemo(() => {
        let min = preFilteredRows.length ? new Date(preFilteredRows[0].values[id]) : new Date(0)
        let max = preFilteredRows.length ? new Date(preFilteredRows[0].values[id]) : new Date(0)

        preFilteredRows.forEach((row: any) => {
            const rowDate = new Date(row.values[id])

            min = rowDate <= min ? rowDate : min
            max = rowDate >= max ? rowDate : max
        })

        return [min, max]
    }, [id, preFilteredRows])

    return (
        <div>
            <input
                min={min.toISOString().slice(0, 10)}
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [val ? val : undefined, old[1]])
                }}
                type="date"
                value={filterValue[0] || ''}
            />
            {' to '}
            <input
                max={max.toISOString().slice(0, 10)}
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [old[0], val ? val.concat('T23:59:59.999Z') : undefined])
                }}
                type="date"
                value={filterValue[1]?.slice(0, 10) || ''}
            />
        </div>
    )
}