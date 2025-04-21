import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);
  function removeOneCharacter(index) {
    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }

  function updateList(person) {
    setCharacters([...characters, person]);
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          console.log("User creation failed: Status code is not 201");
          throw new Error("User creation failed");
        }
      })
      .then((data) => {
        setCharacters([...characters, data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteUser(id) {
    return fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    });
  }

  function removeOneCharacter(index) {
    const user = characters[index];

    if (!user.id) {
      console.error("Cannot delete user without ID:", user);
      return;
    }

    deleteUser(user.id)
      .then((response) => {
        console.log("Delete response status:", response.status);
        if (response.status === 204 || response.status === 200) {
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        } else if (response.status === 404) {
          console.log("User not found in backend");
          // Still remove from frontend if backend can't find it
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        } else {
          console.error("Unexpected status code:", response.status);
        }
      })
      .catch((error) => {
        console.log("Error deleting user:", error);
      });
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
