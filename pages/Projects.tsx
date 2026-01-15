
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { Project } from '../types';
import { CardSkeleton } from '../components/LoadingUI';
import { Pagination } from '../components/Pagination';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await db.getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const techs = useMemo(() => ['All', ...Array.from(new Set(projects.flatMap(p => p.techStack || [])))], [projects]);

  const filteredProjects = useMemo(() => {
    return filter === 'All' 
      ? projects 
      : projects.filter(p => (p.techStack || []).includes(filter));
  }, [projects, filter]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-base font-bold text-indigo-600 uppercase tracking-widest mb-4">Portfolio</h2>
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">Production Projects.</h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Live applications running on scalable infrastructure, optimized for speed and resilience.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {techs.map(tech => (
            <button
              key={tech}
              onClick={() => setFilter(tech)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === tech 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            paginatedProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group flex flex-col animate-slide-down">
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img 
                    src={project.imageUrl || `https://picsum.photos/seed/${project.id}/800/600`} 
                    alt={project.title} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <Link 
                      to={`/projects/${project.id}`}
                      className="bg-white text-slate-900 px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xl"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(project.techStack || []).map(tech => (
                      <span key={tech} className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
                  <p className="text-slate-600 mb-6 flex-1 line-clamp-2 text-sm">{project.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                     <Link 
                        to={`/projects/${project.id}`}
                        className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Read Reviews <span>&rarr;</span>
                      </Link>
                      <span className="text-slate-400 text-[10px] font-medium">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filteredProjects.length > 0 && (
          <Pagination
            totalItems={filteredProjects.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium">No projects found for this tech stack.</p>
          </div>
        )}
      </div>
    </div>
  );
};
