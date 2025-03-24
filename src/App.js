import React, { useState } from "react";
import "./App.css";
import eventsData from "./event-list.json";
import { FaStar } from "react-icons/fa"; // Import ikony gwiazdek

function App() {
  const [events, setEvents] = useState(eventsData);


  const [title, setTitle] = useState("");
  const [dueTime, setDueTime] = useState("");
  let [difficulty, setDifficulty] = useState(0);
  const [description, setDescription] = useState("");


  const isExpired = (dueDate) => {
    if (!dueDate) return false;
    const taskDate = new Date(dueDate);
    return taskDate < new Date();
  };


  const addEvent = () => {
    const fixedDifficulty = enforceMinMaxDiff(Number(difficulty));
    const newEvent = {
      id: events.length,
      title,
      dueTime,
      difficulty: fixedDifficulty,
      description,
      isDone: false,
    };
    setEvents([...events, newEvent]);


    setTitle("");
    setDueTime("");
    setDifficulty(0);
    setDescription("");
  };
  let clickTimeout = null;

  const handleStarClick = (eventId, index) => {
    if (clickTimeout !== null) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      setDifficultyToZero(eventId);
    } else {
      clickTimeout = setTimeout(() => {
        updateDifficulty(eventId, index + 1);
        clickTimeout = null;
      }, 250);
    }
  };




  const removeEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };


  const flipIsDone = (eventId) => {
    setEvents(events.map(event =>
        event.id === eventId ? { ...event, isDone: !event.isDone } : event
    ));
  };


  const updateDifficulty = (eventId, newDifficulty) => {
    setEvents(events.map(event =>
        event.id === eventId && !event.isDone && !isExpired(event.dueTime)
            ? { ...event, difficulty: newDifficulty }
            : event
    ));
  };
  const setDifficultyToZero = (eventId) => {
    setEvents(events.map(event =>
        event.id === eventId
            ? { ...event, difficulty: 0 }
            : event
    ));
  };
  const enforceMinMaxDiff = (value) => {
    const min = 0;
    const max = 10;
    if (value < min) return min;
    if (value > max) return max;
    return value;
  };



  const starColors = {
    orange: "#F2C265",
    grey: "#A9A9A9"
  };
  const stars = Array(10).fill(0);

  return (

        <div className="container">
          <h1>Lista Zadań/Wydarzeń</h1>
          <ul className="uList">
            {events.map((event) => (
                <ol key={event.id} className = "oList" style={{color: isExpired(event.dueTime) ? "red" : "black"}}>
                  <b>TYTUŁ: </b>{event.title || "Brak"}<br/>
                  <b>DO KIEDY: </b>{event.dueTime || "Nieokreślono"}<br/>
                  <b>JAK TRUDNE? </b>{event.difficulty !== undefined ? event.difficulty : "-"}<br/>

                  <b>OPIS: </b>{event.description || "Brak opisu"}<br/>
                  <b>CZY WYKONANO? </b>
                  {event.isDone ? "✔️" : "❌"}
                  <button onClick={() => flipIsDone(event.id)}>Zmień status</button>
                  <br/>


                  {isExpired(event.dueTime) && <span style={{color: "red"}}>Przeterminowane!</span>} <br/>


                  {(isExpired(event.dueTime) || event.isDone) && (
                      <button onClick={() => removeEvent(event.id)}>Usuń wydarzenie</button>
                  )}

                  <br/>


                  <div style={{display: "flex", justifyContent: "center", gap: "5px"}}>
                    {stars.map((_, index) => (
                        <FaStar
                            key={index}
                            size={24}
                            color={event.difficulty > index ? starColors.orange : starColors.grey}
                            style={{cursor: (!event.isDone && !isExpired(event.dueTime)) ? "pointer" : "default"}}
                            onClick={() => {
                              if (!event.isDone && !isExpired(event.dueTime)) {
                                handleStarClick(event.id, index);
                              }
                            }}
                        />

                    ))}
                  </div>

                  <br/>
                </ol>
            ))}
          </ul>

          <h2>Dodaj nowe wydarzenie</h2>
          <ul className="uListAdd">
            <label htmlFor="title">Tytuł</label> <br/>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} /> <br/>

            <label htmlFor="date">Data</label> <br/>
            <input type="date" id="date" value={dueTime} onChange={(e) => setDueTime(e.target.value)} /> <br/>

            <label htmlFor="difficulty">Trudność (0-10)</label> <br/>
            <input type="number" id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} /> <br/>

            <label htmlFor="description">Opis</label> <br/>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} /> <br/>
          </ul>

          <button onClick={addEvent}>Dodaj wydarzenie</button>
        </div>

  );
}

export default App;
