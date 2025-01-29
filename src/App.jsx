import { useState } from "react";

function App() {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newParam, setNewParam] = useState("");

  const changeNameValue = (event) => {
    console.log(event.target);
    setNewName(event.target.value);
  };

  const changeNumberValue = (event) => {
    console.log(event.target);
    setNewNumber(event.target.value);
  };

  const changeParamValue = (event) => {
    console.log(event.target);
    setNewParam(event.target.value);
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

  const Person = (props) => {
    console.log(props.param);
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

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        Filter:
        <input
          style={{ marginBlockEnd: 10 }}
          onChange={changeParamValue}
          value={newParam}
        />
      </div>
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
      <h2>Numbers</h2>
      <div>
        <Person param={newParam} persons={persons} />
      </div>
    </div>
  );
}
export default App;
