import React, { useState } from "react";
import "./App.css";
import eventsData from "./event-list.json";
import { FaStar } from "react-icons/fa"; // Import ikony gwiazdek
//walidacja danych od użytkownika
function App() {
  const [events, setEvents] = useState(eventsData);

  // State dla inputów nowego zadania
  const [title, setTitle] = useState("");
  const [dueTime, setDueTime] = useState("");
  let [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");

  // Sprawdza, czy zadanie jest przeterminowane
  const isExpired = (dueDate) => {
    if (!dueDate) return false;
    const taskDate = new Date(dueDate);
    return taskDate < new Date();
  };

  // Dodaje nowe zadanie
  const addEvent = () => {
    enforceMinMaxDiff(Number(difficulty))
    const newEvent = {
      id: events.length,
      title,
      dueTime,
      difficulty: Number(difficulty),
      description,
      isDone: false,
    };
    setEvents([...events, newEvent]);

    // Czyszczenie inputów
    setTitle("");
    setDueTime("");
    setDifficulty("");
    setDescription("");
  };

  // Usuwa zadanie
  const removeEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Zmienia status wykonania zadania
  const flipIsDone = (eventId) => {
    setEvents(events.map(event =>
        event.id === eventId ? { ...event, isDone: !event.isDone } : event
    ));
  };

  // Funkcja do zmiany ilości gwiazdek (tylko dla niewykonanych i nieprzeterminowanych)
  const updateDifficulty = (eventId, newDifficulty) => {
    setEvents(events.map(event =>
        event.id === eventId && !event.isDone && !isExpired(event.dueTime)
            ? { ...event, difficulty: newDifficulty }
            : event
    ));
  };
  const enforceMinMaxDiff = ()=>{
    let min = 0;
    let max = 10;
    if(difficulty < min){
      difficulty = 0;
    } else if (difficulty > max){
      difficulty = 10;
    }
  }

  // Kolory gwiazdek
  const starColors = {
    orange: "#F2C265",
    grey: "#A9A9A9"
  };
  const stars = Array(10).fill(0); // 10-stopniowa skala trudności

  return (
      <center>
        <div>
          <h1>Lista Zadań/Wydarzeń</h1>
          <ul>
            {events.map((event) => (
                <ol key={event.id} style={{ color: isExpired(event.dueTime) ? "red" : "black" }}>
                  <b>TYTUŁ: </b>{event.title || "Brak"}<br />
                  <b>DO KIEDY: </b>{event.dueTime || "Nieokreślono"}<br />
                  <b>JAK TRUDNE? </b>{event.difficulty || "-"}<br />
                  <b>OPIS: </b>{event.description || "Brak opisu"}<br />
                  <b>CZY WYKONANO? </b>
                  {event.isDone ? "✔️" : "❌"}
                  <button onClick={() => flipIsDone(event.id)}>Zmień status</button><br />

                  {/* Komunikat o przeterminowaniu */}
                  {isExpired(event.dueTime) && <span style={{ color: "red" }}>Przeterminowane!</span>} <br />

                  {/* Przycisk usunięcia zadania */}
                  {(isExpired(event.dueTime) || event.isDone) && (
                      <button onClick={() => removeEvent(event.id)}>Usuń wydarzenie</button>
                  )}

                  <br />

                  {/* Gwiazdki - interaktywna zmiana trudności */}
                  <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
                    {stars.map((_, index) => (
                        <FaStar
                            key={index}
                            size={24}
                            color={event.difficulty > index ? starColors.orange : starColors.grey}
                            style={{ cursor: (!event.isDone && !isExpired(event.dueTime)) ? "pointer" : "default" }}
                            onClick={() => {
                              if (!event.isDone && !isExpired(event.dueTime)) {
                                updateDifficulty(event.id, index + 1);
                              }
                            }}
                        />
                    ))}
                  </div>

                  <br />
                </ol>
            ))}
          </ul>

          <h2>Dodaj nowe wydarzenie</h2>
          <ul>
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
      </center>
  );
}

export default App;
