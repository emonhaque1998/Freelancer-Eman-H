
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/db';
import { Project, Review, User } from '../types';

interface ProjectSingleProps {
  user: User | null;
}

export const ProjectSingle: React.FC<ProjectSingleProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const proj = await db.getProjectById(id!);
      if (proj) {
        setProject(proj);
        // Load reviews separately so failure here doesn't hide the project
        try {
          const revs = await db.getReviewsByProject(id!);
          setReviews(revs);
        } catch (revErr) {
          console.error("Failed to load reviews:", revErr);
        }
      } else {
        setProject(null);
      }
    } catch (err) {
      console.error("Error loading project data:", err);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    try {
      const newReview: Review = {
        id: Math.random().toString(36).substr(2, 9),
        projectId: id!,
        userId: user.id,
        userName: user.name,
        rating,
        comment,
        createdAt: new Date().toISOString()
      };
      
      await db.addReview(newReview);
      setComment('');
      setRating(5);
      await loadData();
    } catch (err) {
      alert("Failed to post review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold animate-pulse">Fetching Project Details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-5xl mb-8">🔍</div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Project Not Found</h1>
        <p className="text-slate-500 max-w-sm mb-10 leading-relaxed">
          The project you are looking for might have been removed or the ID is incorrect.
        </p>
        <Link to="/projects" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
          Browse Other Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pb-16 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/projects" className="inline-flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:gap-3 transition-all">
            &larr; Back to Projects
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map(t => (
                  <span key={t} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase rounded-full">
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                {project.title}
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {project.description}
              </p>
              <div className="flex gap-4">
                <a href={project.liveUrl} target="_blank" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
                  Visit Live Site
                </a>
                <a href={project.demoUrl} target="_blank" className="px-8 py-4 bg-white text-slate-900 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                  GitHub Code
                </a>
              </div>
            </div>
            <div className="relative">
              <img src={project.imageUrl} className="rounded-3xl shadow-2xl border-4 border-white aspect-[4/3] object-cover w-full" alt={project.title} />
              <div className="absolute -bottom-4 -right-4 bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100">
                <div className="text-center">
                  <div className="text-2xl font-black text-indigo-600">
                    {reviews.length > 0 
                      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                      : "0.0"}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content & Reviews */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid gap-16">
            
            {/* Reviews Section */}
            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Community Reviews</h2>
                <span className="text-slate-400 font-medium">{reviews.length} total comments</span>
              </div>

              {/* Review Form */}
              {user ? (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-12">
                  <h3 className="font-bold text-lg mb-6">Leave your feedback</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Rate your experience</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${rating >= star ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-400'}`}
                          >
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Comment</label>
                      <textarea
                        required
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 outline-none min-h-[120px]"
                        placeholder="What do you think about this project?"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
                    >
                      {submitting ? 'Posting...' : 'Post Review'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 text-center mb-12">
                  <p className="text-indigo-900 font-bold mb-4">You must be logged in to leave a review.</p>
                  <Link to="/login" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">Login Now</Link>
                </div>
              )}

              {/* Review List */}
              <div className="space-y-6">
                {reviews.map(rev => (
                  <div key={rev.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-slide-down">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{rev.userName}</div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <svg key={s} className={`w-3 h-3 ${rev.rating >= s ? 'text-yellow-400' : 'text-slate-200'} fill-current`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">Be the first to review this project!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
