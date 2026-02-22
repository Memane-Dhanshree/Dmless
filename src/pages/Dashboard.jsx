import { useNavigate } from 'react-router-dom';
import { Briefcase, Code2, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';

const statCard = (label, value, sub) => ({ label, value, sub });

export function Dashboard() {
  const { jobsSummary, hackathonsSummary, referralsSummary } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your campaigns and activity</p>
      </div>

      {/* 1. Jobs Section */}
      <section aria-labelledby="jobs-heading">
        <h2 id="jobs-heading" className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-dmless-primary" />
          Jobs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            hover
            onClick={() => navigate('/jobs/internships')}
            className="border-pastel-blue/50 bg-gradient-to-br from-white to-pastel-blue/10"
          >
            <h3 className="font-semibold text-gray-800 mb-3">Internships</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Total Jobs</p>
                <p className="text-xl font-bold text-gray-900">{jobsSummary.internships.totalJobs}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Applicants</p>
                <p className="text-xl font-bold text-gray-900">{jobsSummary.internships.totalApplicants}</p>
              </div>
              <div>
                <p className="text-gray-500">Knocked Out</p>
                <p className="text-xl font-bold text-pastel-redDark">{jobsSummary.internships.totalKnockedOut}</p>
              </div>
              <div>
                <p className="text-gray-500">Shortlisted</p>
                <p className="text-xl font-bold text-pastel-greenDark">{jobsSummary.internships.totalShortlisted}</p>
              </div>
            </div>
            <p className="text-xs text-dmless-primary mt-3 font-medium">Click to view Internship jobs →</p>
          </Card>
          <Card
            hover
            onClick={() => navigate('/jobs/full-time')}
            className="border-pastel-green/50 bg-gradient-to-br from-white to-pastel-green/10"
          >
            <h3 className="font-semibold text-gray-800 mb-3">Full-Time</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Total Jobs</p>
                <p className="text-xl font-bold text-gray-900">{jobsSummary.fullTime.totalJobs}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Applicants</p>
                <p className="text-xl font-bold text-gray-900">{jobsSummary.fullTime.totalApplicants}</p>
              </div>
              <div>
                <p className="text-gray-500">Knocked Out</p>
                <p className="text-xl font-bold text-pastel-redDark">{jobsSummary.fullTime.totalKnockedOut}</p>
              </div>
              <div>
                <p className="text-gray-500">Shortlisted</p>
                <p className="text-xl font-bold text-pastel-greenDark">{jobsSummary.fullTime.totalShortlisted}</p>
              </div>
            </div>
            <p className="text-xs text-dmless-primary mt-3 font-medium">Click to view Full-Time jobs →</p>
          </Card>
        </div>
      </section>

      {/* 2. Hackathons Section */}
      <section aria-labelledby="hackathons-heading">
        <h2 id="hackathons-heading" className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-pastel-purpleDark" />
          Hackathons
        </h2>
        <Card
          hover
          onClick={() => navigate('/hackathons')}
          className="border-pastel-purple/50 bg-gradient-to-br from-white to-pastel-purple/10 max-w-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total Hackathons</p>
              <p className="text-xl font-bold text-gray-900">{hackathonsSummary.totalHackathons}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Registrations</p>
              <p className="text-xl font-bold text-gray-900">{hackathonsSummary.totalRegistrations}</p>
            </div>
            <div>
              <p className="text-gray-500">Submissions</p>
              <p className="text-xl font-bold text-gray-900">{hackathonsSummary.totalSubmissions}</p>
            </div>
            <div>
              <p className="text-gray-500">Finalists</p>
              <p className="text-xl font-bold text-pastel-greenDark">{hackathonsSummary.totalFinalists}</p>
            </div>
          </div>
          <p className="text-xs text-dmless-primary mt-3 font-medium">Click to view Hackathons →</p>
        </Card>
      </section>

      {/* 3. Referrals Section */}
      <section aria-labelledby="referrals-heading">
        <h2 id="referrals-heading" className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-pastel-greenDark" />
          Referrals
        </h2>
        <Card
          hover
          onClick={() => navigate('/referrals')}
          className="border-pastel-green/50 bg-gradient-to-br from-white to-pastel-green/10 max-w-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Total Campaigns</p>
              <p className="text-xl font-bold text-gray-900">{referralsSummary.totalCampaigns}</p>
            </div>
            <div>
              <p className="text-gray-500">Referrals Submitted</p>
              <p className="text-xl font-bold text-gray-900">{referralsSummary.totalReferrals}</p>
            </div>
            <div>
              <p className="text-gray-500">Accepted</p>
              <p className="text-xl font-bold text-pastel-greenDark">{referralsSummary.totalAccepted}</p>
            </div>
            <div>
              <p className="text-gray-500">Rejected</p>
              <p className="text-xl font-bold text-pastel-redDark">{referralsSummary.totalRejected}</p>
            </div>
          </div>
          <p className="text-xs text-dmless-primary mt-3 font-medium">Click to view Referrals →</p>
        </Card>
      </section>
    </div>
  );
}
