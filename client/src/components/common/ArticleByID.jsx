import { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { userAuthorContextObj } from "../../contexts/userAuthorContext"
import { FaEdit } from 'react-icons/fa'
import { MdDelete, MdRestore } from 'react-icons/md'

function ArticleByID() {
  const { state } = useLocation()
  const { currentUser } = useContext(userAuthorContextObj)

  return (
    <div>
      <div className='container'>
        {/* Article Header */}
        <div className="mb-4 w-100 p-4 rounded-3 bg-light shadow d-flex justify-content-between align-items-center flex-wrap">
          {/* Article Info */}
          <div className="mb-3">
            <h2 className="fw-semibold">{state.title}</h2>
            <div>
              <small className="text-secondary me-3">
                Created on: {state.dateOfCreation}
              </small>
              <small className="text-secondary">
                Modified on: {state.dateOfModification}
              </small>
            </div>
          </div>

          {/* Author + Buttons */}
          <div className="d-flex align-items-center flex-wrap">
            {/* Author Info */}
            <div className="text-center me-3">
              <img
                src={state.authorData.profileImageUrl}
                width="60"
                height="60"
                className="rounded-circle mb-1"
                alt="Author"
              />
              <p className="mb-0 small">{state.authorData.nameOfAuthor}</p>
            </div>

            {/* Author Controls */}
            {currentUser.role === 'author' && (
              <div className="d-flex">
                <button className="btn btn-outline-warning me-2">
                  <FaEdit />
                </button>
                {state.isArticleActive ? (
                  <button className="btn btn-outline-danger me-2">
                    <MdDelete className="fs-5" />
                  </button>
                ) : (
                  <button className="btn btn-outline-info me-2">
                    <MdRestore className="fs-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Article Content */}
        <div className="mb-5">
          <p className="fs-5" style={{ whiteSpace: 'pre-line' }}>
            {state.content}
          </p>
        </div>

        {/* Comments Section */}
        <div className="mb-5">
          <h4 className="mb-3">Comments</h4>
          {
            state.comments.length === 0 ? (
              <p className="text-muted">No comments yet...</p>
            ) : (
              state.comments.map(commentObj => (
                <div key={commentObj._id} className="mb-3 border-bottom pb-2">
                  <p className="fw-bold mb-1">{commentObj?.nameOfUser}</p>
                  <p className="mb-0">{commentObj?.comment}</p>
                </div>
              ))
            )
          }
        </div>
      </div>
    </div>
  )
}

export default ArticleByID
