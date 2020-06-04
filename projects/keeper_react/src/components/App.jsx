import React from "react";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";
import notes from "./notes";

const App = function() {
  return (
    <div>
      <Header />
      {notes.map(note =>
        <Note id={note.id} title={note.title} content={note.content} />
      )}
      <Footer />
    </div>
  );
};

export default App;
