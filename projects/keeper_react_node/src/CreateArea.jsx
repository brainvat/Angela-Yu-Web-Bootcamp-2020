import React, { useState } from "react";
import PostAddIcon from "@material-ui/icons/PostAdd";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";

function CreateArea(props) {
  const [expanded, setExpanded] = useState(false);
  const [lineCount, setLineCount] = useState(1);

  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote(prevNote => {
      if (!expanded && value.length > 0 && name === "content") {
        setExpanded(true);
      }

      if (name === "content") {
        setLineCount(value.split(/\r\n|\r|\n/).length);
      }

      return {
        ...prevNote,
        [name]: value
      };
    });
    event.preventDefault();
  }

  function submitNote(event) {
    if (props.onAdd(note)) {
      setNote({
        title: "",
        content: ""
      });
      setExpanded(false);
    };
    event.preventDefault();
  }

function handleSubmit(event) {
  submitNote(event);
  event.preventDefault();
}

  return (
    <div>
      <form className="create-note" onSubmit={handleSubmit}>
        {expanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
          />
        )}
        <textarea
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={expanded ? lineCount : 1}
        />
        {expanded ? (
          <Zoom in={true}>
            <Fab onClick={submitNote}>
              <PostAddIcon />
            </Fab>
          </Zoom>
        ) : (
          <Fab onClick={submitNote}>
            <PostAddIcon />
          </Fab>
        )}
      </form>
    </div>
  );
}

export default CreateArea;
