import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Tabs } from '../components/ui/Tabs';

const industryOptions = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Other', label: 'Other' },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('company');
  const [companyName, setCompanyName] = useState('Acme Corp');
  const [industry, setIndustry] = useState('Technology');
  const [defaultLocation, setDefaultLocation] = useState('Remote');

  const tabs = [
    { id: 'company', label: 'Company Info' },
    { id: 'email', label: 'Email Templates' },
    { id: 'billing', label: 'Billing' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Company, templates, and billing</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'company' && (
        <Card>
          <h2 className="font-semibold text-gray-800 mb-4">Company Info</h2>
          <div className="space-y-4 max-w-md">
            <Input
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-pastel-blue/50 flex items-center justify-center text-sm text-gray-500">
                Upload
              </div>
            </div>
            <Select
              label="Industry"
              options={industryOptions}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
            <Select
              label="Default Location"
              options={[
                { value: 'Remote', label: 'Remote' },
                { value: 'Onsite', label: 'Onsite' },
                { value: 'Hybrid', label: 'Hybrid' },
              ]}
              value={defaultLocation}
              onChange={(e) => setDefaultLocation(e.target.value)}
            />
            <Button>Save</Button>
          </div>
        </Card>
      )}

      {activeTab === 'email' && (
        <Card>
          <h2 className="font-semibold text-gray-800 mb-4">Email Templates</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Received</label>
              <textarea
                rows={4}
                className="w-full max-w-xl rounded-lg border border-pastel-blue/50 px-3 py-2"
                placeholder="Hi {{candidate_name}}, we have received your application..."
                defaultValue="Hi {{candidate_name}}, we have received your application for {{job_title}}. We will get back to you soon."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shortlisted</label>
              <textarea
                rows={4}
                className="w-full max-w-xl rounded-lg border border-pastel-blue/50 px-3 py-2"
                placeholder="Congratulations..."
                defaultValue="Hi {{candidate_name}}, congratulations! You have been shortlisted for {{job_title}}. Next steps: {{next_steps}}."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rejected</label>
              <textarea
                rows={4}
                className="w-full max-w-xl rounded-lg border border-pastel-blue/50 px-3 py-2"
                placeholder="Thank you for your interest..."
                defaultValue="Hi {{candidate_name}}, thank you for your interest in {{job_title}}. We have decided to move forward with other candidates at this time."
              />
            </div>
            <Button>Save templates</Button>
          </div>
        </Card>
      )}

      {activeTab === 'billing' && (
        <Card>
          <h2 className="font-semibold text-gray-800 mb-4">Billing</h2>
          <div className="space-y-4 max-w-md">
            <div className="p-4 rounded-lg bg-pastel-blue/20 border border-pastel-blue/30">
              <p className="text-sm text-gray-600">Current plan</p>
              <p className="text-xl font-bold text-gray-900">Starter</p>
            </div>
            <Button>Upgrade plan</Button>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Payment history</p>
              <p className="text-sm text-gray-500">No payments yet.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
