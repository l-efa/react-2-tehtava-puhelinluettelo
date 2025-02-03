import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newParam, setNewParam] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("Promise fullfilled");
      setPersons(response.data);
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
        <Person param={newParam} persons={persons} />
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
      alert(`The name ${newName} already exists`);
      setNewName("");
      setNewNumber("");
      return;
    }

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    setPersons(persons.concat(nameObject));
    setNewName("");
    setNewNumber("");
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

  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person.name}>
          {person.name}
          {person.number}
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
