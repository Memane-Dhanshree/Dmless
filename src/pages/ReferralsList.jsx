import { useState } from 'react';
import { Copy, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { referralSelectedByCampaign } from '../data/placeholderData';
import toast from 'react-hot-toast';

function ReferralCard({ campaign, selectedList }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('total');

  const copyLink = () => {
    navigator.clipboard.writeText(campaign.link);
    toast.success('Link copied to clipboard');
    setMenuOpen(false);
  };

  const tabs = [
    { id: 'total', label: 'Total Referrals', count: campaign.totalReferrals },
    { id: 'selected', label: 'Selected', count: campaign.accepted },
    { id: 'rejected', label: 'Rejected', count: campaign.rejected },
  ];

  return (
    <Card className="mb-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{campaign.title}</h3>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              campaign.status === 'Active' ? 'bg-pastel-green/50' : 'bg-gray-200'
            } text-gray-800`}
          >
            {campaign.status}
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
                    onClick={() => setMenuOpen(false)}
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
        {activeTab === 'total' && (
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{campaign.totalReferrals}</span> total referrals submitted.
          </p>
        )}
        {activeTab === 'selected' && (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold text-pastel-greenDark">{campaign.accepted}</span> selected.
            </p>
            {selectedList.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-pastel-blue/30">
                <table className="w-full text-sm text-left">
                  <thead className="bg-pastel-blue/20">
                    <tr>
                      <th className="px-3 py-2 font-medium text-gray-800">Name</th>
                      <th className="px-3 py-2 font-medium text-gray-800">Email</th>
                      <th className="px-3 py-2 font-medium text-gray-800">Referred by</th>
                      <th className="px-3 py-2 font-medium text-gray-800">Selected at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedList.map((s) => (
                      <tr key={s.id} className="border-t border-pastel-blue/20">
                        <td className="px-3 py-2">{s.name}</td>
                        <td className="px-3 py-2">{s.email}</td>
                        <td className="px-3 py-2">{s.referredBy}</td>
                        <td className="px-3 py-2">{s.selectedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No selected referrals yet.</p>
            )}
          </div>
        )}
        {activeTab === 'rejected' && (
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-pastel-redDark">{campaign.rejected}</span> rejected.
          </p>
        )}
      </div>
    </Card>
  );
}

export function ReferralsList() {
  const navigate = useNavigate();
  const { referrals } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referral Campaigns</h1>
          <p className="text-gray-600 mt-1">Manage referral campaigns (create via internal flow only)</p>
        </div>
      </div>
      {referrals.length === 0 ? (
        <Card>
          <p className="text-gray-500 text-center py-8">No referral campaigns yet.</p>
        </Card>
      ) : (
        referrals.map((r) => (
          <ReferralCard key={r.id} campaign={r} selectedList={referralSelectedByCampaign[r.id] ?? []} />
        ))
      )}
    </div>
  );
}
