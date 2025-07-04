import { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { userAuthorContextObj } from "../../contexts/userAuthorContext"
import { FaEdit } from 'react-icons/fa'
import { MdDelete, MdRestore } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'

function ArticleByID() {
  const { state } = useLocation()
  const { currentUser } = useContext(userAuthorContextObj)
  const [editArticleStatus, setEditArticleStatus] = useState(false)
  const { register, handleSubmit } = useForm()
  const { getToken } = useAuth()

  const [articleData, setArticleData] = useState(state) // render data from this

  // Save changes
  async function onSave(modifiedArticle) {
    try {
      const articleAfterChanges = { ...articleData, ...modifiedArticle }
      const token = await getToken()
      const currentDate = new Date()

      articleAfterChanges.dateOfModification =
        currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear()

      const res = await axios.put(
        `http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
        articleAfterChanges,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (res.data.message === 'article updated') {
        setEditArticleStatus(false)
        setArticleData(res.data.payload)
      } else {
        console.log("Unexpected response:", res.data)
      }
    } catch (err) {
      console.error("Error occurred while saving article:", err.response?.data || err.message || err)
    }
  }

  function enableEdit() {
    setEditArticleStatus(true)
  }

  // Delete article
  async function deleteArticle() {
    const updatedArticle = { ...articleData, isArticleActive: false }

    const res = await axios.put(
      `http://localhost:3000/author-api/articles/${updatedArticle.articleId}`,
      updatedArticle
    )

    if (res.data.message === 'article deleted or restored') {
      setArticleData(res.data.payload)
    }
  }

  // Restore article
  async function restoreArticle() {
    const updatedArticle = { ...articleData, isArticleActive: true }

    const res = await axios.put(
      `http://localhost:3000/author-api/articles/${updatedArticle.articleId}`,
      updatedArticle
    )

    if (res.data.message === 'article deleted or restored') {
      setArticleData(res.data.payload)
    }
  }

  return (
    <div>
      <div className='container'>
        {editArticleStatus === false ? (
          <>
            {/* Article Header */}
            <div className="mb-4 w-100 p-4 rounded-3 bg-light shadow d-flex justify-content-between align-items-center flex-wrap">
              <div className="mb-3">
                <h2 className="fw-semibold">{articleData.title}</h2>
                <div>
                  <small className="text-secondary me-3">
                    Created on: {articleData.dateOfCreation}
                  </small>
                  <small className="text-secondary">
                    Modified on: {articleData.dateOfModification}
                  </small>
                </div>
              </div>

              {/* Author + Buttons */}
              <div className="d-flex align-items-center flex-wrap">
                <div className="text-center me-3">
                  <img
                    src={articleData.authorData.profileImageUrl}
                    width="60"
                    height="60"
                    className="rounded-circle mb-1"
                    alt="Author"
                  />
                  <p className="mb-0 small">{articleData.authorData.nameOfAuthor}</p>
                </div>

                {currentUser.role === 'author' && (
                  <div className="d-flex">
                    <button className="btn btn-outline-warning me-2" onClick={enableEdit}>
                      <FaEdit />
                    </button>
                    {articleData.isArticleActive ? (
                      <button className="btn btn-outline-danger me-2" onClick={deleteArticle}>
                        <MdDelete className="fs-5" />
                      </button>
                    ) : (
                      <button className="btn btn-outline-info me-2" onClick={restoreArticle}>
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
                {articleData.content}
              </p>
            </div>

            {/* Comments Section */}
            <div className="mb-5">
              <h4 className="mb-3">Comments</h4>
              {articleData.comments.length === 0 ? (
                <p className="text-muted">No comments yet...</p>
              ) : (
                articleData.comments.map(commentObj => (
                  <div key={commentObj._id} className="mb-3 border-bottom pb-2">
                    <p className="fw-bold mb-1">{commentObj?.nameOfUser}</p>
                    <p className="mb-0">{commentObj?.comment}</p>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSave)}>
            <div className="mb-4">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                defaultValue={articleData.title}
                {...register("title")}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="form-label">
                Select a category
              </label>
              <select
                {...register("category")}
                id="category"
                className="form-select"
                defaultValue={articleData.category}
              >
                <option value="programming">Programming</option>
                <option value="AI&ML">AI&ML</option>
                <option value="database">Database</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                {...register("content")}
                className="form-control"
                id="content"
                rows="10"
                defaultValue={articleData.content}
              ></textarea>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success">
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ArticleByID
