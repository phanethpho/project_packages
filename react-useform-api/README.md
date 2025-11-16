Reactjs useForm 
A lightweight React hook for handling API requests (GET, POST, PUT, DELETE) with loading and error states
node version 20.^

Installation

1. Install the package

Run this in your React project folder:

    npm install @phaneth_pho/react-useform-api


or with Yarn:

    yarn add @phaneth_pho/react-useform-api

2. Import and use inside a React component

Example component (UserForm.jsx):

```bash
import React, { useEffect } from "react";
import useForm from "@phaneth_pho/react-useform-api";

export default function UserForm() {
  // Initialize the hook with your base API URL
  const token = localStorage.getItem("access_token");

  // noted token not required for register/login user
  const { data, errors, loading, get, post, put, del, reset } = useForm("https://api.yourapp.com", token);

  // Example: auto-fetch data on load
  useEffect(() => {
    get("/users");
  }, []);


 // Example: handle form submission (GET)
  const handeGetMethod = aysnc () =>{
    const res = await = get('/posts');
  }

  // Example: handle form submission (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await post("/posts", {
        title: "Hello React Hook!",
        body: "This is a test POST request.",
        userId: 1,
      });
      alert("Data submitted successfully!");
    } catch (err) {
      console.error("API error:", errors);
    }
  };

  // Example: handle form submission (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await PUT(`/posts/${id}`, {
        title: "Hello React Hook!",
        body: "This is a test POST request.",
        userId: 1,
      });
      alert("Update Data successfully!");
    } catch (err) {
      console.error("API error:", errors);
    }
  };

  // Example: handle form delete (DELETE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await DEL(`/posts/${id}`, id, true);
      alert("Delete Data successfully!");
    } catch (err) {
      console.error("API error:", errors);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Form Example</h2>

      {loading && <p>⏳ Loading...</p>}

      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>

      {errors && (
        <p style={{ color: "red" }}>
          {errors.message || JSON.stringify(errors)}
        </p>
      )}

      {data && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: 10,
            borderRadius: 8,
            marginTop: 10,
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
```
3. Example API usage

You can now call any of these from your components:

Method	Example	Description

```bash
get(url)	get('/users')	#GET request
post(url, body)	post('/posts', {...})	#POST request
put(url, body)	put('/posts/1', {...})	#PUT request
del(url)	del('/posts/1', 1, true)	#DELETE request
reset()	reset()  #Clear form state

```
4. Example for error handling

If the API returns a 400–500 error, the hook automatically stores it in errors.
You can show it like this:

```bash
  {errors && <p className="error">{errors.message || "Something went wrong"}</p>}
```

5. Example with Authorization token (optional)

If your API requires authentication, you can easily modify your useForm call:

```bash

const token = localStorage.getItem("access_token");
const { post } = useForm("https://api.yourapp.com", token);

await get("/users");
await post("/users", { name: "John Doe" });
await post(`/users/${id}`, { name: "John Doe" });
await del(`/users/${id}`, id, true); #base on your node express route req.body required if your app.use(express.json())
```

Or you can extend your package to accept a config object (I can show you that next if you’d like).

6. Run your React app
  npm run dev     #or npm start

```bash
npm run dev
npm run start
```


Now test your form — it should send real GET/POST/PUT/DELETE requests and manage loading + error states automatically