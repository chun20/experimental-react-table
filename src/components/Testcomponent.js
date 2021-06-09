import React, { useMemo, useCallback, Fragment, useState } from "react"
import styled from "styled-components"
import {
  useTable,
  useSortBy,
  useExpanded,
  usePagination,
  useFilters,
  useGlobalFilter,
} from "react-table"

const Styles = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 14,
      }}
    >
      Search:
      <input
        value={globalFilter || ""}
        onChange={e => {
          setGlobalFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </div>
  )
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ""}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

function Table({ columns: userColumns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { expanded },

    // Expan
    visibleColumns,
    // Pagination
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
    state,
    //Search
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns: userColumns,
      data,
      autoResetPage: false,
      defaultColumn,
      autoResetFilters: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  )

  const renderRowSubComponent = useCallback(({ row }) => {
    const projectData = row.original.projects
    if (!projectData) {
      return <a>no data</a>
    } else {
      return (
        <>
          {projectData.map((row, i) => {
            return <tr>• {row}</tr>
          })}
        </>
      )
    }
  }, [])

  return (
    <>
      <tr>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </tr>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(
                    column.getHeaderProps(column.getSortByToggleProps())
                  )}
                >
                  {column.render("Header")}{" "}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <Fragment {...row.getRowProps()}>
                <tr>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    )
                  })}
                </tr>
                {row.isExpanded ? (
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colSpan={visibleColumns.length}>
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            )
          })}
        </tbody>
      </table>
      <br />
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <br />
      <div>Showing the first 10 results of {rows.length} rows</div>
    </>
  )
}

function Testcomponent({ propTable }) {
  const [searchHandle, setSearchHandle] = useState(propTable)

  const columns = useMemo(
    () => [
      {
        id: "expander",
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? "👇" : "👉"}
          </span>
        ),
        Cell: ({ row }) => (
          <>
            {!row.values.projects ? null : (
              <span {...row.getToggleRowExpandedProps()}>
                {row.isExpanded ? "👇" : "👉"}
              </span>
            )}
          </>
        ),
      },
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Roles",
        accessor: "roles",
      },
      {
        Header: "Projects",
        accessor: "projects",
        Cell: ({ row }) => {
          const handleProjectsNum = row.original
          if (!handleProjectsNum.projects) {
            return <>-</>
          } else if (handleProjectsNum.projects.length === 1) {
            return <>{handleProjectsNum.projects}</>
          } else {
            return <>{handleProjectsNum.projects.length}</>
          }
        },
      },
    ],
    []
  )

  return (
    <Styles>
      <Table columns={columns} data={propTable} />
    </Styles>
  )
}

export default Testcomponent
