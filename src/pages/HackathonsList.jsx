import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { platformDistribution, analyticsTrendData, hackathonParticipantsByCampaign } from '../data/placeholderData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

function HackathonCard({ hackathon, participantsList, onDeleteClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('participants');

  const copyLink = () => {
    navigator.clipboard.writeText(hackathon.link);
    toast.success('Link copied to clipboard');
    setMenuOpen(false);
  };

  const tabs = [
    { id: 'participants', label: 'Participants', count: hackathon.totalRegistrations },
    { id: 'submissions', label: 'Submissions', count: hackathon.totalSubmissions },
    { id: 'analytics', label: 'Analytics' },
  ];

  const submissionRate = hackathon.totalRegistrations
    ? Math.round((hackathon.totalSubmissions / hackathon.totalRegistrations) * 100)
    : 0;
  const dropOff = 100 - submissionRate;

  return (
    <Card className="mb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{hackathon.title}</h3>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              hackathon.status === 'Active' ? 'bg-pastel-green/50' : 'bg-gray-200'
            } text-gray-800`}
          >
            {hackathon.status}
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
                    onClick={() => { setMenuOpen(false); onDeleteClick(hackathon); }}
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
        {activeTab === 'participants' && (
          <div>
            <p className="text-sm text-gray-600 mb-2">{hackathon.totalRegistrations} participants.</p>
            {participantsList.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-pastel-blue/30">
                <table className="w-full text-sm text-left">
                  <thead className="bg-pastel-blue/20">
                    <tr>
                      <th className="px-3 py-2 font-medium text-gray-800">Name</th>
                      <th className="px-3 py-2 font-medium text-gray-800">Email</th>
                      <th className="px-3 py-2 font-medium text-gray-800">Registered</th>
                      <th className="px-3 py-2 font-medium text-gray-800">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantsList.map((p) => (
                      <tr key={p.id} className="border-t border-pastel-blue/20">
                        <td className="px-3 py-2">{p.name}</td>
                        <td className="px-3 py-2">{p.email}</td>
                        <td className="px-3 py-2">{p.registeredAt}</td>
                        <td className="px-3 py-2">{p.submitted ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No participants yet.</p>
            )}
          </div>
        )}
        {activeTab === 'submissions' && (
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{hackathon.totalSubmissions}</span> submissions received.
          </p>
        )}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="h-48">
              <p className="text-sm font-medium text-gray-700 mb-2">Registration trend</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="applicants" stroke="#93C5FD" strokeWidth={2} name="Registrations" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-pastel-green/20">
                <p className="text-gray-600">Submission rate</p>
                <p className="text-xl font-bold text-pastel-greenDark">{submissionRate}%</p>
              </div>
              <div className="p-3 rounded-lg bg-pastel-red/20">
                <p className="text-gray-600">Drop-off rate</p>
                <p className="text-xl font-bold text-pastel-redDark">{dropOff}%</p>
              </div>
            </div>
            <div className="h-44">
              <p className="text-sm font-medium text-gray-700 mb-2">Platform-wise participation</p>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {platformDistribution.map((entry, i) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export function HackathonsList() {
  const navigate = useNavigate();
  const { hackathons, removeHackathon } = useApp();
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      removeHackathon(deleteConfirm.id);
      toast.success('Hackathon deleted');
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hackathons</h1>
          <p className="text-gray-600 mt-1">Manage hackathon campaigns and participants</p>
        </div>
        <Button onClick={() => navigate('/hackathons/create')}>Create Hackathon</Button>
      </div>
      {hackathons.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-8">No hackathons yet. Create your first hackathon.</p>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/hackathons/create')}>Create Hackathon</Button>
          </div>
        </Card>
      ) : (
        hackathons.map((h) => (
          <HackathonCard
            key={h.id}
            hackathon={h}
            participantsList={hackathonParticipantsByCampaign[h.id] ?? []}
            onDeleteClick={(item) => setDeleteConfirm({ id: item.id, title: item.title })}
          />
        ))
      )}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete hackathon?" size="sm">
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
