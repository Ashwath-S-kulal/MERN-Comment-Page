import React, { useState, useEffect } from "react";
import ReplyForm from "./ReplayForm";
import { FaReply } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { NavLink } from "react-router-dom";




export default function ProjectPage() {
  const [formData, setFormData] = useState({ name: "", text: "" });
  const [status, setStatus] = useState("");
  const [comments, setComments] = useState([]);
  const [showReply, setShowReply] = useState(false);

  const handleReplyClick = (e) => {
    e.preventDefault();
    setShowReply((prev) => !prev);
  };



  const projectId = "project1";
  useEffect(() => {
    fetch(`/api/projects/${projectId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Failed to load comments:", err));
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      setStatus("Comment is required.");
      return;
    }

    try {
      const res = await fetch("/api/projects/project1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post comment");

      setComments([data, ...comments]);
      setFormData({ name: "", text: "" });
      setStatus("Comment posted!");
    } catch (error) {
      console.error(error);
      setStatus("Error posting comment.");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(`api/projects/${projectId}/comments/${commentId}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      // Remove from local state
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
      setStatus("Error deleting comment.");
    }
  };


  const handleUpdate = async (commentId, newText) => {
    try {
      const existingComment = comments.find((c) => c._id === commentId);
      if (!existingComment) throw new Error("Comment not found");
      const res = await fetch(
        `/api/projects/${projectId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newText, name: existingComment.name }),
        }
      );

      const updatedComment = await res.json();
      if (!res.ok) throw new Error(updatedComment.error || "Failed to update");
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updatedComment : c))
      );
    } catch (err) {
      console.error(err);
      setStatus("Error updating comment.");
    }
  };

  // Reply to comment
  const handleReply = async (commentId, replyText) => {
    try {
      const res = await fetch(
        `/api/projects/${projectId}/comments/${commentId}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: replyText }),
        }
      );
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || "Failed to reply");
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updated : c))
      );
    } catch (err) {
      console.error(err);
      setStatus("Error replying to comment.");
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/comments/${commentId}/reply/${replyId}/`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      // Remove from local state
      setComments((prev) => prev.filter((r) => r._id !== replyId));
    } catch (err) {
      console.error(err);
      setStatus("Error deleting comment.");
    }
  };


  const handleUpdateReply = async (commentId, replyId, newText) => {
    try {
      const existingComment = comments.find((c) => c._id === commentId);
      if (!existingComment) throw new Error("Comment not found");
      const res = await fetch(
        `/api/projects/${projectId}/comments/${commentId}/reply/${replyId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newText, name: existingComment.name }),
        }
      );

      const updatedComment = await res.json();
      if (!res.ok) throw new Error(updatedComment.error || "Failed to update");
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updatedComment : c))
      );
    } catch (err) {
      console.error(err);
      setStatus("Error updating comment.");
    }
  };



  return (
    <main>
      <section className="flex flex-col justify-center w-screen px-4">
        <a href="/" className="ring-2 rounded-lg px-10 py-1 mt-8 bg-gray-900 mx-2 hover:text-blue-600 w-fit">Back</a>
        <div className="flex justify-center">
          <img src="https://thumbs.dreamstime.com/b/organic-rice-farming-reduces-chemical-inputs-promotes-sustainable-agriculture-healthier-ecosystems-practices-380817912.jpg"
            alt="Project Image" className="w-screen md:w-[760px] h-80 ring-2 ring-blue-500 rounded-lg my-5 object-fill" />
        </div>
        <form onSubmit={handleSubmit} className="">
          <div className="bg-[#1e293b] rounded-lg p-3 flex flex-col gap-3 w-full md:w-full max-w-3xl justify-self-center">
            <input
              type="text"
              name="name"
              maxLength="50"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full  bg-[#0f172a] text-white p-2 rounded-md outline-none 
              focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />

            <textarea
              name="text"
              maxLength="1000"
              placeholder="Write a comment..."
              required
              value={formData.text}
              onChange={handleChange}
              className="w-full resize-none bg-[#0f172a] text-white p-3 rounded-md outline-none 
              focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            ></textarea>
            <div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 
              rounded-md text-sm font-medium">Post comment</button>
            </div>
            <div aria-live="polite" className="text-green-700">{status}</div>
          </div>

        </form>




        <div className="min-h-screen w-full bg-slate-900 text-slate-100 ">
          {comments.map((c, i) => (
            <div key={i} className="mx-auto max-w-3xl px-4 py-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 md:p-6 w-full">
                <div className="flex gap-3 flex-wrap">
                  <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-slate-800/60">
                    <img
                      alt={`${c.name || "Anonymous"} avatar`}
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-semibold text-white text-sm sm:text-base">
                        {c.name || "Anonymous"}:
                      </span>
                      <span className="text-slate-400 text-xs sm:text-sm">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mt-2 text-slate-300 leading-relaxed break-words text-sm sm:text-base">{c.text}</p>

                    <div className="mt-3 flex flex-wrap gap-2 md:gap-4 justify-end ring-2 p-1 rounded-lg ring-gray-800 bg-gray-800">
                      <button>
                        <NavLink to="/reply" onClick={handleReplyClick}
                          className="flex items-center gap-1 px-4 sm:px-6 font-light text-sm hover:text-blue-600"><FaReply /> Reply</NavLink>
                      </button>
                      <button onClick={() => handleDelete(c._id)} c
                        className="flex items-center gap-1 px-4 sm:px-6 font-light text-sm hover:text-blue-600"><MdDeleteForever /> Delete</button>
                      <button
                        onClick={() => {
                          const newText = prompt("Edit your comment:", c.text);
                          if (newText) handleUpdate(c._id, newText);
                        }}
                        className="flex items-center gap-1 px-4 sm:px-6 font-light text-sm hover:text-blue-600"><FaEdit /> Edit</button>
                    </div>

                    {showReply && (
                      <ReplyForm onCancel={() => setShowReply(false)} onReply={(text) => handleReply(c._id, text)} />
                    )}
                  </div>
                </div>
              </div>

              {c.replies && c.replies.length > 0 && (
                <ul className="ml-8 md:ml-40 mt-1 space-y-1 border-l border-gray-600 pl-3">
                  {c.replies.map((r, idx) => (
                    <div key={idx} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 w-full">
                      <li className="flex flex-wrap gap-3 items-center">
                        <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-slate-800/60">
                          <img
                            alt={`${r.name || "Anonymous"} avatar`}
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row flex-auto justify-between w-full sm:w-auto gap-1">
                          <span className="font-semibold text-sm sm:text-base break-words">{r.name || "Anonymous"}</span>
                          <span className="text-slate-400 text-xs sm:text-sm">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                      </li>

                      <div className="mt-2 text-sm sm:text-base break-words">{r.text}</div>

                      <div className="mt-3 flex flex-wrap gap-2 justify-end ring-2 p-1 rounded-lg ring-gray-800 bg-gray-800">
                        <button
                          onClick={() => handleDeleteReply(c._id, r._id)}
                          className="flex items-center gap-1 px-4 sm:px-6 font-light text-sm hover:text-blue-600"
                        ><MdDeleteForever /> Delete</button>
                        <button
                          onClick={() => {
                            const newText = prompt("Edit your reply:", r.text);
                            if (newText) handleUpdateReply(c._id, r._id, newText);
                          }} 
                          className="flex items-center gap-1 px-4 sm:px-6 font-light text-sm hover:text-blue-600"><FaEdit /> Edit</button>
                      </div>
                    </div>

                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
