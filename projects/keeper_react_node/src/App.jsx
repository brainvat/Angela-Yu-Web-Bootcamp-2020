import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

const maxNotes = 15;

function App() {
  const [notes, setNotes] = useState([]);
  const [blocked, setBlocked] = useState(false);

  function addNote(newNote) {
    if (notes.length === maxNotes) {
      setBlocked(true);
      return false;
    }

    setNotes(prevNotes => {
      newNote.title = newNote.title || "No title";
      return [...prevNotes, newNote];
    });
    return true;
  }

  function deleteNote(id) {
    setNotes(prevNotes => {
      if (prevNotes.length - 1 < maxNotes) {
        setBlocked(false);
      }

      return prevNotes.filter((noteItem, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      {blocked && <Note blocked={true} />}
      <Footer />
    </div>
  );
}

export default App;
