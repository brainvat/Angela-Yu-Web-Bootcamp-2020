import React from "react";

const Note = function(p) {
  function createMarkup(s) {
    const encodedStr = s.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
      return '&#'+i.charCodeAt(0)+';';
    });
    
    return {__html: s };
  };

  return (
    <div className="note">
      <h1>{p.title || "This is the note title"}</h1>
      <p dangerouslySetInnerHTML={createMarkup(p.content || "This is the note content")}></p>
    </div>
  );
};

export default Note;
