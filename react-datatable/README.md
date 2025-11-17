# React DataTable Guidelines

## Overview
A comprehensive guide for using and contributing to the React DataTable component library.
![alt text](image.png)

## Installation
```bash
npm i @phaneth_pho/react-datatable

## Basic Usage
```jsx
import {DataTable} from '@phaneth_pho/react-datatable'
import "@phaneth_pho/react-datatable/dist/styles.css";

function App() {
  return <DataTable data={data} />;
}
```

## Features
- Sortable columns
- Pagination support
- Responsive design
- Header and body rendering by data[] array object automaticaly
- Columns show/hide functionality
- Search functionality
- Export functionality
- Select row functionality
- Support tailwind css v4

## Configuration
| Option | Type | Description |
|--------|------|-------------|
| `data` | Array | Table data source |
| `columns` | Array | Column definitions |
| `paginated` | Boolean | Enable pagination |
| `sortable` | Boolean | Enable sorting |

## API Reference
- `DataTable` - Main component
- `useDataTable()` - Hook for table state

## Contributing
See CONTRIBUTING.md for guidelines.

## License
MIT

## sample usage

```bash

//src/App.jsx

import React, { useEffect, useState } from "react";
import { DataTable } from "@phaneth_pho/react-datatable";
import "@phaneth_pho/react-datatable/dist/styles.css";
import data from './api/data';

import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setIsLoading(true);

      setUsers(data);
      //console.log( users); // Array(6)
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Example handler for deleting a user
  const handleDelete = async (data) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      console.log("Response del:", data);

      setUsers((prev) => prev.filter((row) => row.id !== data.id));
      // await getUsers(); // ✅ Refresh list after delete
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Example handler for updating a user
  const handleEdit = async (data) => {
    try {
      console.log("response eidt:", data);

      setUsers((prev) => prev.map((row) => (row.id === data.id ? data : row)));
      // await getUsers(); // ✅ Refresh list after update
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDetails = async (data) => {
    console.log("details:", data);
  };

  const handleSelected = async (data) => {
    console.log(data);
  };

  return (
    <div>
      <h1>My DataTable</h1>
      <DataTable
        loading={isLoading} //enabled spinner loading on event
        data={users} //asigned data to datatable
        onDetails={handleDetails} //details fuction callback
        onDelete={handleDelete} //delete function callback
        onEdit={handleEdit} //edit function callback
        onSelected={handleSelected} //enable selected rows
        onExport={true} //enable export button
        onSearch={true} //enable search box
        onColumn={true} //enable show/hide column table
      />
    </div>
  );
}

export default App;


```

## functionality

```bash

//all functions below required paramater response back with data

  const handleDetails = async (data) => {
    //your statement
  }

  const handleEdit = async(data)=> {
    //your statement
  }

  const handleDelete = async(data)=>{
    //your statement
  }

  const handleSelected = async(data)=>{
    //your statement 
  }

```
## sample datatable

```bash
      <Datatable
        loading={isLoading} #enabled spinner loading on event
        data={users} #asigned data to datatable
      />

```

## start vite server Vite dev server:

```bash
npm run dev

```