import { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newParam, setNewParam] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((response) => {
      console.log(response);
      setPersons(response);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Notification errorMessage={errorMessage} />
      </div>
      <div>
        <Filter setNewParam={setNewParam} newParam={newParam} />
      </div>
      <Form
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        persons={persons}
        setPersons={setPersons}
        setErrorMessage={setErrorMessage}
      />
      <h2>Numbers</h2>
      <div>
        <Person param={newParam} persons={persons} setPersons={setPersons} />
      </div>
    </div>
  );
}

const Notification = ({ errorMessage }) => {
  if (errorMessage === null) {
    return null;
  }
  return (
    <div className="error">
      <p>{errorMessage}</p>
    </div>
  );
};

const Form = ({
  newName,
  newNumber,
  setNewName,
  setNewNumber,
  persons,
  setPersons,
  setErrorMessage,
}) => {
  const changeNameValue = (event) => {
    console.log(event.target);
    setNewName(event.target.value);
  };

  const changeNumberValue = (event) => {
    console.log(event.target);
    setNewNumber(event.target.value);
  };

  const addNewName = (event) => {
    event.preventDefault();

    const nameExists = persons.some((person) => person.name === newName);

    if (nameExists) {
      if (
        confirm(
          `The name ${newName} already exists. Would you like to update their number?`
        )
      ) {
        const person = persons.find((p) => p.name === newName);
        console.log(person);
        console.log(person._id);
        const changedNote = { ...person, number: newNumber };

        personService.update(person._id, changedNote).then((response) => {
          setPersons(
            persons.map((person) =>
              person.name !== newName ? person : response
            )
          );
          setErrorMessage(
            `Person '${person.name}''s number updated in the server!`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
        });
      }
      setNewName("");
      setNewNumber("");
      return;
    }

    const nameObject = {
      name: newName,
      number: newNumber,
    };
    personService.create(nameObject).then((response) => {
      setPersons(persons.concat(response));
      console.log(response);

      setErrorMessage(`Person '${response.name}' added to the server!`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
      setNewName("");
      setNewNumber("");
    });
  };

  return (
    <>
      <form onSubmit={addNewName}>
        <div>
          name: <input onChange={changeNameValue} value={newName} />
        </div>
        <div>
          number:
          <input onChange={changeNumberValue} value={newNumber}></input>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const Person = ({ param, persons, setPersons }) => {
  console.log("persons: ", persons);
  const filteredPersons = persons.filter((person) =>
    person.name.includes(param)
  );

  const remove = (id) => {
    console.log("Removing ID:", id);

    personService
      .remove(id)
      .then((response) => {
        console.log("Deleted:", response);
        setPersons((prevPersons) => {
          const updatedPersons = prevPersons.filter(
            (person) => person._id !== id
          );
          console.log("Updated persons list:", updatedPersons);
          return [...updatedPersons]; // Ensures a new array reference
        });
      })
      .catch((error) => {
        console.error("Error deleting person:", error);
      });
  };

  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person._id}>
          {person.name} {" - "} {person.number}
          <button onClick={() => remove(person._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

const Filter = ({ setNewParam, newParam }) => {
  const changeParamValue = (event) => {
    console.log(event.target);
    setNewParam(event.target.value);
  };

  return (
    <>
      Filter:
      <input
        style={{ marginBlockEnd: 10 }}
        onChange={changeParamValue}
        value={newParam}
      />
    </>
  );
};

export default App;
