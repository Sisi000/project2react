import React from "react";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";


const CommentForm = ({ handleSubmit, submitLabel, hasCancelButton = false, initialText = '', handleCancel }) => {
  const[text, setText] = useState(initialText);
  const { isAuthenticated } = useAuth0();
  const isTextareaDisabled = text.length === 0;
  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(text);
    setText("");
  };
  return (
    <form onSubmit={onSubmit}>
      <textarea
        className="comment-form-textarea"
        disabled={!isAuthenticated}
        value={text}
        placeholder="Add a comment"
        onChange={(e) => setText(e.target.value)}
      />
      <button className="comment-form-button" disabled={isTextareaDisabled}>
        {submitLabel}
      </button>
      {hasCancelButton && (
        <button type="button" className="comment-form-button comment-form-cancel-button" onClick={handleCancel}>Cancel</button>
      )}
    </form>
  );
};

export default CommentForm;
