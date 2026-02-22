import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { StepIndicator } from '../components/forms/StepIndicator';
import toast from 'react-hot-toast';

const locationTypes = [
  { value: 'Remote', label: 'Remote' },
  { value: 'Onsite', label: 'Onsite' },
  { value: 'Hybrid', label: 'Hybrid' },
];
const categoryOptions = [
  { value: 'AI/ML', label: 'AI/ML' },
  { value: 'Web3', label: 'Web3' },
  { value: 'Fintech', label: 'Fintech' },
  { value: 'Health', label: 'Health' },
  { value: 'General', label: 'General' },
];

const step1Schema = yup.object({
  hackathonTitle: yup.string().required('Title is required').max(100, 'Max 100 characters'),
  category: yup.string().required('Select category').oneOf(categoryOptions.map((c) => c.value)),
  startDate: yup.string().required('Start date required').test('valid-date', 'Must be today or later', (v) => {
    if (!v) return false;
    const d = new Date(v);
    return !isNaN(d.getTime()) && d >= new Date(new Date().setHours(0, 0, 0, 0));
  }),
  endDate: yup.string().required('End date required').test('after-start', 'End must be after start', function (v) {
    if (!v) return false;
    const start = this.parent.startDate;
    if (!start) return true;
    return new Date(v) >= new Date(start);
  }),
  location: yup.string().required('Select location').oneOf(locationTypes.map((l) => l.value)),
  applicationDeadline: yup.string().nullable(),
  maxParticipants: yup.number().nullable().min(1).max(1000).transform((v) => (v === '' || isNaN(v) ? null : v)),
});

const step2Schema = yup.object({
  description: yup.string().required('Description is required'),
});

const STEPS = ['Basic Details', 'Description', 'Review'];

const getDefaultDates = () => {
  const today = new Date();
  const next = new Date(today);
  next.setDate(next.getDate() + 7);
  return {
    startDate: today.toISOString().split('T')[0],
    endDate: next.toISOString().split('T')[0],
  };
};

export function CreateHackathon() {
  const navigate = useNavigate();
  const { addHackathon } = useApp();
  const [step, setStep] = useState(1);
  const defaultDates = getDefaultDates();

  const form = useForm({
    defaultValues: {
      hackathonTitle: '',
      category: 'General',
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
      location: 'Remote',
      applicationDeadline: '',
      maxParticipants: '',
      description: '',
      submissionGuidelines: '',
    },
    resolver: step === 1 ? yupResolver(step1Schema) : step === 2 ? yupResolver(step2Schema) : undefined,
    mode: 'onSubmit',
  });

  const values = form.watch();

  const onStep1Submit = (data) => {
    setStep(2);
  };
  const onStep2Submit = () => {
    setStep(3);
  };

  const handleCreate = () => {
    const newHackathon = {
      id: `hack-${Date.now()}`,
      title: values.hackathonTitle || form.getValues('hackathonTitle'),
      status: 'Active',
      totalRegistrations: 0,
      totalSubmissions: 0,
      totalFinalists: 0,
      link: `https://dmless.io/hackathons/${Date.now()}`,
    };
    addHackathon(newHackathon);
    toast.success('Hackathon created successfully');
    navigate('/hackathons');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create Hackathon</h1>
      <StepIndicator steps={STEPS} currentStep={step} />

      {step === 1 && (
        <Card>
          <form onSubmit={form.handleSubmit(onStep1Submit)} className="space-y-4">
            <Input
              label="Hackathon Title"
              required
              {...form.register('hackathonTitle')}
              error={form.formState.errors.hackathonTitle?.message}
            />
            <Select
              label="Category / Track"
              required
              options={categoryOptions}
              {...form.register('category')}
              error={form.formState.errors.category?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                {...form.register('startDate')}
                error={form.formState.errors.startDate?.message}
              />
              <Input
                label="End Date"
                type="date"
                required
                {...form.register('endDate')}
                error={form.formState.errors.endDate?.message}
              />
            </div>
            <Select
              label="Location"
              required
              options={locationTypes}
              {...form.register('location')}
              error={form.formState.errors.location?.message}
            />
            <Input
              label="Application Deadline (optional)"
              type="date"
              {...form.register('applicationDeadline')}
              error={form.formState.errors.applicationDeadline?.message}
            />
            <Input
              label="Maximum Participants (1–1000, optional)"
              type="number"
              min={1}
              max={1000}
              {...form.register('maxParticipants', { valueAsNumber: true })}
              error={form.formState.errors.maxParticipants?.message}
            />
            <div className="flex justify-between pt-4">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Back</Button>
              <Button type="submit">Next</Button>
            </div>
          </form>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <form onSubmit={form.handleSubmit(onStep2Submit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hackathon Description <span className="text-pastel-redDark">*</span>
              </label>
              <textarea
                rows={6}
                className="w-full rounded-lg border border-pastel-blue/50 px-3 py-2 focus:ring-2 focus:ring-dmless-primary focus:border-transparent"
                placeholder="Describe the hackathon, themes, and rules..."
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-pastel-redDark">{form.formState.errors.description.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (optional)</label>
              <input
                type="text"
                className="w-full rounded-lg border border-pastel-blue/50 px-3 py-2"
                placeholder="Comma-separated skills"
                {...form.register('requiredSkills')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Submission guidelines (optional)</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-pastel-blue/50 px-3 py-2"
                placeholder="How to submit..."
                {...form.register('submissionGuidelines')}
              />
            </div>
            <div className="flex justify-between pt-4">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button type="submit">Next</Button>
            </div>
          </form>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Review & create</h3>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-gray-500">Title</dt><dd className="font-medium">{String(values.hackathonTitle ?? '')}</dd></div>
            <div><dt className="text-gray-500">Category</dt><dd className="font-medium">{String(values.category ?? '')}</dd></div>
            <div><dt className="text-gray-500">Start – End</dt><dd className="font-medium">{String(values.startDate ?? '')} – {String(values.endDate ?? '')}</dd></div>
            <div><dt className="text-gray-500">Location</dt><dd className="font-medium">{String(values.location ?? '')}</dd></div>
            <div><dt className="text-gray-500">Max participants</dt><dd className="font-medium">{values.maxParticipants || '—'}</dd></div>
          </dl>
          <div className="flex justify-between pt-6">
            <Button type="button" variant="ghost" onClick={() => setStep(2)}>Edit</Button>
            <Button type="button" onClick={handleCreate}>Create Hackathon</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
