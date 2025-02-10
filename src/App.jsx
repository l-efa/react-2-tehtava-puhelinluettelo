import { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newParam, setNewParam] = useState("");

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
        <Filter setNewParam={setNewParam} newParam={newParam} />
      </div>
      <Form
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        persons={persons}
        setPersons={setPersons}
      />
      <h2>Numbers</h2>
      <div>
        <Person param={newParam} persons={persons} setPersons={setPersons} />
      </div>
    </div>
  );
}

const Form = ({
  newName,
  newNumber,
  setNewName,
  setNewNumber,
  persons,
  setPersons,
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
        const changedNote = { ...person, number: newNumber };

        personService.update(person.id, changedNote).then((response) => {
          setPersons(
            persons.map((person) =>
              person.name !== newName ? person : response
            )
          );
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

const Person = (props) => {
  const filteredPersons = props.persons.filter(
    (person) => person.name.includes(props.param) // Check if name includes the param
  );

  const remove = (id) => {
    personService.remove(id).then((response) => {
      console.log(response);
      props.setPersons(filteredPersons.filter((person) => person.id !== id));
    });
  };

  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person.name}>
          {person.name} {" - "} {person.number}
          <button onClick={() => remove(person.id)}>Delete</button>
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
