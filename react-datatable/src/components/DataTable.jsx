import React, { useState } from "react";
import PropTypes from "prop-types";

export default function DataTable({ columns, data, selectable, onSelect }) {
  const [selected, setSelected] = useState([]);

  const toggleRow = (row) => {
    let updated;
    if (selected.includes(row)) updated = selected.filter((r) => r !== row);
    else updated = [...selected, row];

    setSelected(updated);
    onSelect && onSelect(updated);
  };

  return (
    <div className="datatable">
      <table>
        <thead>
          <tr>
            {selectable && <th></th>}
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {selectable && (
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(row)}
                    onChange={() => toggleRow(row)}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectable: PropTypes.bool,
  onSelect: PropTypes.func,
};

DataTable.defaultProps = {
  selectable: false,
  onSelect: null,
};
