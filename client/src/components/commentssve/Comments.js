import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import "./Comments.css";
import { useAuth0 } from "@auth0/auth0-react";

const Comments = () => {
  const { isAuthenticated } = useAuth0();
  const { user } = useAuth0();


  const [backendUsers, setBackendUsers] = useState([]);
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );

  // GET REPLIES
  const getReplies = async (commentId) => {
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
  //DELETE
  const deleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want delete comment?")) {
      let id = backendComments._id;
      const data = JSON.stringify(commentId);
      const response = await fetch(`/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      const updatedBackendComments = backendComments.filter(
        (backendComment) => backendComment._id !== commentId
      );
      setBackendComments(updatedBackendComments);
      if (response.status === 200) {
        console.log("success");
      } else {
        alert("error deleting comment");
      }
    }
  };

  //UPDATE COMMENT
  // const updateComment = (text, commentId) => {
  //   updateCommentApi(text).then(() => {
  //     const updatedBackendComments = backendComments.map((backendComment) => {
  //       if (backendComment.id === commentId) {
  //         return { ...backendComment, body: text };
  //       }
  //       return backendComment;
  //     });
  //     setBackendComments(updatedBackendComments);
  //     setActiveComment(null);
  //   });
  // };

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
  console.log(allcomments);

  useEffect(() => {
    allcomments();
  }, []);

  const finduseremail = async () => {
    try {
      if (!user) return setBackendUsers(null);
      let email = user.email;
      let response = await fetch(`/findusersbyemail?email=${email}`);
      let allusers = await response.json();
      return setBackendUsers(allusers);
    } catch (ex) {
      console.log(ex);
    }
  };

  useEffect(() => {
    finduseremail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  
  // const finduserbyid = async (id) => {
  //   try {
  //     // if (!user) return setBackendUsers(null);
  //     let response = await fetch(`/findusersbyid?id=${id}`);
  //     let usersid = await response.json();
  //     return setBackendUsers(usersid);
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // };

  // useEffect(() => {
  //   finduserbyid();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthenticated]);



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
            deleteComment={deleteComment}
            // updateComment={updateComment}
            currentUser={user}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
