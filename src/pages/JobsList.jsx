import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Copy, MoreVertical, Trash2, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { platformDistribution, jobShortlistedByCampaign } from '../data/placeholderData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import toast from 'react-hot-toast';

function JobCard({ job, onDeleteClick, shortlistedList }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('shortlisted');

  const copyLink = () => {
    navigator.clipboard.writeText(job.link);
    toast.success('Link copied to clipboard');
    setMenuOpen(false);
  };

  const tabs = [
    { id: 'shortlisted', label: 'Shortlisted', count: job.shortlisted },
    { id: 'knockout', label: 'Knockout', count: job.knockedOut },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <Card className="mb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pastel-green/50 text-gray-800">
            {job.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={copyLink} aria-label="Copy link">
            <Copy className="w-4 h-4" />
          </Button>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="More options"
              aria-expanded={menuOpen}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" aria-hidden onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-pastel-blue/30 py-1 z-20">
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-pastel-blue/20"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-pastel-redDark hover:bg-pastel-red/20"
                    onClick={() => { setMenuOpen(false); onDeleteClick(job); }}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mt-4" />
      <div className="mt-4">
        {activeTab === 'shortlisted' && (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              {job.shortlisted} shortlisted candidate{job.shortlisted !== 1 ? 's' : ''}.
            </p>
            {shortlistedList.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-pastel-blue/30">
                <table className="w-full text-sm text-left">
                  <thead className="bg-pastel-blue/20">
                    <tr>
                      <th className="px-3 py-2 font-medium text-gray-800">Name</th>
                      <th className="px-3 py-2 font-medium text-gray-800">Email</th>
                      <th className="px-3 py-2 font-medium text-gray-800">Applied</th>
                      <th className="px-3 py-2 font-medium text-gray-800">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortlistedList.map((c) => (
                      <tr key={c.id} className="border-t border-pastel-blue/20">
                        <td className="px-3 py-2">{c.name}</td>
                        <td className="px-3 py-2">{c.email}</td>
                        <td className="px-3 py-2">{c.appliedAt}</td>
                        <td className="px-3 py-2">{c.score ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No shortlisted candidates yet.</p>
            )}
          </div>
        )}
        {activeTab === 'knockout' && (
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-pastel-redDark">{job.knockedOut}</span> candidates knocked out.
          </p>
        )}
        {activeTab === 'analytics' && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {platformDistribution.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">Platform-wise application ratio</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export function JobsList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobs, removeJob } = useApp();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const isInternship = location.pathname.includes('internships');
  const jobList = isInternship ? jobs.internships : jobs.fullTime;
  const title = isInternship ? 'Internship Jobs' : 'Full-Time Jobs';

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      removeJob(deleteConfirm.jobId, deleteConfirm.type);
      toast.success('Job deleted');
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">Manage job campaigns and view applicants</p>
        </div>
        <Button onClick={() => navigate(isInternship ? '/jobs/create?type=Internship' : '/jobs/create?type=Full-time')}>
          Create Job
        </Button>
      </div>
      {jobList.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-8">No jobs yet. Create your first job campaign.</p>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/jobs/create')}>Create Job</Button>
          </div>
        </Card>
      ) : (
        jobList.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            shortlistedList={jobShortlistedByCampaign[job.id] ?? []}
            onDeleteClick={(j) => setDeleteConfirm({ jobId: j.id, type: j.type, title: j.title })}
          />
        ))
      )}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete job?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete &quot;{deleteConfirm?.title}&quot;? This cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
