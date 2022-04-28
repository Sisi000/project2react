import React from 'react'
import "./Comments.css"
import img from "../../images/user.png"
// import CommentForm from "./CommentForm";


const Comment = ({comment, replies, currentUserId, deleteComment}) => {
  const fiveMinutes = 300000;
  const timePassed = new Date() - new Date (comment.create) > fiveMinutes;
  const canReply = Boolean(currentUserId)
  const canEdit = currentUserId === comment.userId && !timePassed;
  const canDelete = currentUserId === comment.userId && !timePassed;
  const createdAt = new Date(comment.createdAt).toLocaleDateString()
  return (
    <div className='comment'>
      <div className='comment-image-container'>
        <img src={img} alt=""/>
      </div>
      <div className='comment-right-part'>
        <div className='comment-content'>
          <div className='comment-author'>{comment.username}</div>
          <div>{createdAt}</div>
        </div>
        <div className='comment-text'>{comment.comment}</div>
        <div className='comment-actions'>
          {canReply && <div className='comment-action'>Reply</div>}
          {canEdit && <div className='comment-action'>Edit</div>}
          {canDelete && <div className='comment-action' onClick={() => deleteComment(comment._id)}>Delete</div>}
        </div>
        {replies.length > 0 && (
          <div className='replies'>
            {replies.map(reply => (
              <Comment 
               comment={reply}
               key={reply._id} 
               replies={[]} 
               currentUserId={currentUserId} 
               deleteComment={deleteComment}/>
            ))}
            </div>
        )}
      </div>
    </div>
  )
}

export default Comment