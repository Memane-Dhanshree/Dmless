import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { platformDistribution, analyticsTrendData } from '../data/placeholderData';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

export function Analytics() {
  const { jobs, hackathons, referrals } = useApp();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('jobs');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Overall and per-campaign analytics</p>
      </div>

      <div className="flex flex-wrap gap-2 p-1 rounded-lg bg-pastel-blue/20 border border-pastel-blue/30 w-fit">
        {[
          { id: 'jobs', label: 'Jobs' },
          { id: 'hackathons', label: 'Hackathons' },
          { id: 'referrals', label: 'Referrals' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeSection === s.id ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'jobs' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Jobs – Overall</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <p className="text-sm font-medium text-gray-700 mb-2">Platform ratio (all jobs)</p>
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
                      {platformDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64">
                <p className="text-sm font-medium text-gray-700 mb-2">Application trend</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="applicants" fill="#93C5FD" name="Applicants" />
                    <Bar dataKey="shortlisted" fill="#86EFAC" name="Shortlisted" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold text-gray-800 mb-3">By job</h3>
            <ul className="space-y-2">
              {[...jobs.internships, ...jobs.fullTime].map((job) => (
                <li key={job.id}>
                  <button
                    type="button"
                    onClick={() => navigate(job.type === 'Internship' ? '/jobs/internships' : '/jobs/full-time')}
                    className="text-dmless-primary hover:underline font-medium"
                  >
                    {job.title}
                  </button>
                  <span className="text-gray-500 text-sm ml-2">– {job.totalApplicants} applicants, {job.shortlisted} shortlisted</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {activeSection === 'hackathons' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Hackathons – Overall</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <p className="text-sm font-medium text-gray-700 mb-2">Platform participation</p>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                    >
                      {platformDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64">
                <p className="text-sm font-medium text-gray-700 mb-2">Registration trend</p>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applicants" stroke="#93C5FD" strokeWidth={2} name="Registrations" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold text-gray-800 mb-3">By hackathon</h3>
            <ul className="space-y-2">
              {hackathons.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => navigate('/hackathons')}
                    className="text-dmless-primary hover:underline font-medium"
                  >
                    {h.title}
                  </button>
                  <span className="text-gray-500 text-sm ml-2">– {h.totalRegistrations} participants</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {activeSection === 'referrals' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Referrals – Overall</h2>
            <p className="text-gray-600">Selected / Total only. No chart for referrals per spec.</p>
          </Card>
          <Card>
            <h3 className="font-semibold text-gray-800 mb-3">By campaign</h3>
            <ul className="space-y-2">
              {referrals.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => navigate('/referrals')}
                    className="text-dmless-primary hover:underline font-medium"
                  >
                    {r.title}
                  </button>
                  <span className="text-gray-500 text-sm ml-2">– {r.accepted} selected / {r.totalReferrals} total</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
