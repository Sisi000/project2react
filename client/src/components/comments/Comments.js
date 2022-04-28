import React from "react";
import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import "./Comments.css";
import { useAuth0 } from "@auth0/auth0-react";

const Comments = () => {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );

  const { isAuthenticated } = useAuth0();
  const { user } = useAuth0();
  const [userid, setUserid] = useState();

  // console.log("CURRENT USER", user.sub);

  useEffect(() => {
    if (user) {
      let currentUserid = user.sub;
      setUserid(currentUserid);
    }
  }, [user]);

  // GET REPLIES
  const getReplies = (commentId) => {
    return backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  //GET DATE AND TIME
  const getTimeStamp = () => {
    const date = new Date().toString();
    const createdAt = `${date.substring(4, 10)}, ${date.substring(
      11,
      15
    )} ${date.substring(16, 21)}`;
    // console.log(createdAt);
    return createdAt;
  };

  //ADD COMMENT
  const addComment = async (text, parentId = null) => {
    const newComment = {
      username: user.nickname,
      comment: text,
      parentId: parentId,
      createdAt: getTimeStamp(),
      user_id: user.sub,
    };

    const data = JSON.stringify(newComment);
    console.log(`creating new comment: ${data}`);
    const response = await fetch("/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    setBackendComments([newComment, ...backendComments]);
    setActiveComment(null);
    if (response.status === 200) {
      console.log("success");
    } else {
      alert("error creating comment");
    }
  };

  //DELETE COMMENT
  const deleteComment = async (comment) => {
    if (window.confirm("Are you sure you want delete a comment?")) {
      console.log("delete is ", comment);
      const id = comment._id;
      const response = await fetch(`/delete/${id}`, {
        method: "DELETE",
      });
      // const updatedBackendComments = backendComments.filter(
      //   (backendComment) => backendComment._id !== comment._id
      // );
      // setBackendComments(updatedBackendComments);
      if (response.status === 200) {
        console.log("success");
      } else {
        alert("error deleting comment");
      }
      allcomments();
   
    }
  };

  //UPDATE COMMENT
  const updateComment = async (text, comment) => {
    const data = JSON.stringify();
    console.log(`editing comment: ${data}`);
    const id = comment._id;
    const response = await fetch(`/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    const updatedBackendComments = backendComments.map((backendComment) => {
      if (backendComment.id === comment._id) {
        return { ...backendComment, body: text };
      }
      return backendComment;
    });
    setBackendComments(updatedBackendComments);
    setActiveComment(null);
    if (response.status === 200) {
      console.log("success");
    } else {
      alert("error creating comment");
    }
  };

  //GET ALL COMMENTS
  const allcomments = async () => {
    try {
      let response = await fetch("/allcomments");
      let allcomments = await response.json();
      return setBackendComments(allcomments);
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    allcomments();
  }, []);

  return (
    <div className="comments">
      <h3 className="comments-title">Comments</h3>
      <CommentForm submitLabel="Submit" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            key={rootComment._id}
            comment={rootComment}
            replies={getReplies(rootComment._id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={(comment) => deleteComment(comment)}
            updateComment={updateComment}
            currentUser={userid}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
