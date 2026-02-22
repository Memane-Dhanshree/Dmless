import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { StepIndicator } from '../components/forms/StepIndicator';
import toast from 'react-hot-toast';

const employmentTypes = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Contract', label: 'Contract' },
];
const locationTypes = [
  { value: 'Remote', label: 'Remote' },
  { value: 'Onsite', label: 'Onsite' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const step1Schema = yup.object({
  jobTitle: yup.string().required('Job title is required').max(100, 'Max 100 characters'),
  employmentType: yup.string().required('Select employment type').oneOf(employmentTypes.map((e) => e.value)),
  location: yup.string().required('Select location').oneOf(locationTypes.map((l) => l.value)),
  experienceRequired: yup.number().required('Required').min(0, 'Min 0').max(30, 'Max 30').typeError('Enter a number'),
  salaryMin: yup.number().nullable().transform((v) => (v === '' || isNaN(v) ? null : v)).min(0).typeError('Must be number'),
  salaryMax: yup.number().nullable().transform((v) => (v === '' || isNaN(v) ? null : v)).min(yup.ref('salaryMin'), 'Max must be ≥ min').typeError('Must be number'),
  applicationDeadline: yup.date().nullable().min(new Date(), 'Must be today or later').transform((v) => (v ? new Date(v) : null)),
});

const step2Schema = yup.object({
  jobDescription: yup.string().required('Job description is required'),
  requiredSkills: yup.array().of(yup.string()).min(1, 'Add at least one required skill').required(),
});

// Dummy question pool for "Generate" and "Regenerate"
const DUMMY_QUESTIONS_POOL = [
  { question: 'Describe your experience with React.', options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], correct: 2 },
  { question: 'How do you handle state in large applications?', options: ['Local state only', 'Context API', 'Redux or similar', 'Depends on use case'], correct: 3 },
  { question: 'What is your approach to testing?', options: ['Manual only', 'Unit tests', 'Unit + Integration', 'Full coverage'], correct: 3 },
  { question: 'Experience with REST APIs?', options: ['None', 'Consumed only', 'Designed and consumed', 'Both'], correct: 3 },
  { question: 'How do you prioritize tasks under deadline?', options: ['Ad-hoc', 'List only', 'Structured prioritization', 'Agile/Scrum'], correct: 3 },
  { question: 'What is your familiarity with version control (Git)?', options: ['Never used', 'Basic commit/push', 'Branches & merge', 'Rebase, CI/CD'], correct: 3 },
  { question: 'How would you debug a production issue?', options: ['Guess and retry', 'Logs only', 'Logs + repro steps', 'Logs + repro + metrics'], correct: 3 },
  { question: 'Experience with responsive design?', options: ['None', 'Media queries only', 'Flexbox/Grid', 'Full responsive systems'], correct: 3 },
  { question: 'How do you stay updated with frontend trends?', options: ['I don’t', 'Blogs only', 'Conferences + blogs', 'Side projects + community'], correct: 3 },
  { question: 'Describe your experience with backend integration.', options: ['None', 'Consumed APIs', 'Designed APIs', 'Full-stack features'], correct: 3 },
];

function getRandomDummyQuestions(count = 5) {
  const shuffled = [...DUMMY_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q, i) => ({
    id: Date.now() + i,
    question: q.question,
    options: [...q.options],
    correct: q.correct,
  }));
}

function TagInput({ value = [], onChange, placeholder = 'Add skills separated by comma or Enter', minTags = 0, error }) {
  const [input, setInput] = useState('');
  const tags = Array.isArray(value) ? value : [];

  const addTag = (tag) => {
    const t = tag.trim();
    if (t && !tags.includes(t)) {
      onChange([...tags, t]);
      setInput('');
    }
  };

  const removeTag = (i) => {
    onChange(tags.filter((_, idx) => idx !== i));
  };

  const handleChange = (e) => {
    const val = e.target.value;
    // Support comma-separated entry: split on commas, add completed tags, keep last fragment in input
    if (val.includes(',')) {
      const parts = val.split(',');
      const last = parts.pop() ?? '';
      parts.forEach((p) => addTag(p));
      setInput(last);
    } else {
      setInput(val);
    }
  };

  const handleBlur = () => {
    if (input.trim()) {
      addTag(input);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-2 p-2 border border-pastel-blue/50 rounded-lg bg-white min-h-[42px] focus-within:ring-2 focus-within:ring-dmless-primary focus-within:border-transparent">
        {tags.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pastel-blue/40 text-sm"
          >
            {t}
            <button type="button" onClick={() => removeTag(i)} className="hover:text-pastel-redDark" aria-label={`Remove ${t}`}>
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(input))}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1 min-w-[120px] border-0 bg-transparent focus:ring-0 focus:outline-none py-1"
        />
      </div>
      {error && <p className="text-sm text-pastel-redDark" role="alert">{error}</p>}
      {minTags > 0 && tags.length < minTags && (
        <p className="text-sm text-gray-500">Add at least {minTags} skill(s)</p>
      )}
    </div>
  );
}

const STEPS = ['Basic Details', 'Description', 'Screening Questions', 'Application Info', 'Review'];

function QuestionCard({ q, index, onRegenerate, onEdit, onDelete, onSaveEdit, isEditing }) {
  const [editState, setEditState] = useState(() => ({
    question: q.question,
    options: [...(q.options || ['', '', '', ''])],
    correct: q.correct,
  }));
  useEffect(() => {
    if (isEditing) setEditState({ question: q.question, options: [...(q.options || ['', '', '', ''])], correct: q.correct });
  }, [isEditing, q.id]);

  if (isEditing) {
    return (
      <div className="p-4 rounded-lg border-2 border-dmless-primary bg-pastel-blue/10">
        <p className="text-xs font-medium text-gray-500 mb-2">Q{index + 1} (editing)</p>
        <input
          type="text"
          value={editState.question}
          onChange={(e) => setEditState((s) => ({ ...s, question: e.target.value }))}
          className="w-full rounded border border-pastel-blue/50 px-3 py-2 mb-3 text-sm"
          placeholder="Question text"
        />
        {[0, 1, 2, 3].map((i) => (
          <label key={i} className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              name={`correct-${q.id}`}
              checked={editState.correct === i + 1}
              onChange={() => setEditState((s) => ({ ...s, correct: i + 1 }))}
              className="rounded-full"
            />
            <input
              type="text"
              value={editState.options[i] || ''}
              onChange={(e) => {
                const opts = [...editState.options];
                opts[i] = e.target.value;
                setEditState((s) => ({ ...s, options: opts }));
              }}
              className="flex-1 rounded border border-pastel-blue/50 px-2 py-1 text-sm"
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
            />
          </label>
        ))}
        <div className="flex gap-2 mt-3">
          <Button type="button" size="sm" onClick={() => onSaveEdit(editState)}>Save</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => onSaveEdit(null)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border border-pastel-blue/30 bg-white">
      <p className="font-medium text-gray-800 mb-2">Q{index + 1}: {q.question}</p>
      <ul className="list-disc pl-5 text-sm text-gray-600">
        {(q.options || []).map((opt, j) => (
          <li key={j}>{opt} {q.correct === j + 1 ? ' ✓ (Correct)' : ''}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 mt-3">
        <Button type="button" variant="ghost" size="sm" onClick={() => onRegenerate(index)}>Regenerate</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(index)}>Edit</Button>
        <Button type="button" variant="ghost" size="sm" className="text-pastel-redDark" onClick={() => onDelete(index)}>Delete</Button>
      </div>
    </div>
  );
}

export function CreateJob() {
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get('type') || 'Full-time';
  const navigate = useNavigate();
  const { addJob } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: '',
    employmentType: typeFromUrl,
    location: 'Remote',
    experienceRequired: 0,
    salaryMin: '',
    salaryMax: '',
    applicationDeadline: '',
    jobDescription: '',
    requiredSkills: [],
    preferredSkills: [],
    questions: getRandomDummyQuestions(5),
    minCorrectAnswers: 3,
    resumeRequired: true,
    askRelocation: false,
    askNoticePeriod: false,
    askPortfolio: false,
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);

  const step1Form = useForm({
    defaultValues: formData,
    resolver: step === 1 ? yupResolver(step1Schema) : undefined,
  });
  const step2Form = useForm({
    defaultValues: formData,
    resolver: step === 2 ? yupResolver(step2Schema) : undefined,
  });

  useEffect(() => {
    step1Form.reset(formData);
    step2Form.reset(formData);
  }, [formData, step]);

  const updateForm = (data) => setFormData((prev) => ({ ...prev, ...data }));

  const onStep1Submit = (data) => {
    updateForm(data);
    setStep(2);
  };
  const onStep2Submit = (data) => {
    updateForm(data);
    setFormData((prev) => ({
      ...prev,
      ...data,
      questions: prev.questions.length ? prev.questions : getRandomDummyQuestions(5),
    }));
    setEditingQuestionIndex(null);
    setStep(3);
  };

  const regenerateQuestion = (index) => {
    const newOne = getRandomDummyQuestions(1)[0];
    setFormData((prev) => {
      const qs = [...prev.questions];
      qs[index] = { ...newOne, id: prev.questions[index]?.id ?? Date.now() };
      return { ...prev, questions: qs };
    });
    setEditingQuestionIndex(null);
  };

  const regenerateAllQuestions = () => {
    setFormData((prev) => ({ ...prev, questions: getRandomDummyQuestions(5) }));
    setEditingQuestionIndex(null);
    toast.success('All questions regenerated');
  };

  const saveEditedQuestion = (index, editState) => {
    if (editState) {
      setFormData((prev) => {
        const qs = [...prev.questions];
        qs[index] = {
          ...qs[index],
          question: editState.question,
          options: editState.options.filter(Boolean).length ? editState.options : qs[index].options,
          correct: editState.correct,
        };
        return { ...prev, questions: qs };
      });
    }
    setEditingQuestionIndex(null);
  };

  const deleteQuestion = (index) => {
    setFormData((prev) => {
      const qs = prev.questions.filter((_, i) => i !== index);
      if (qs.length < 1) return prev;
      return { ...prev, questions: qs };
    });
    setEditingQuestionIndex(null);
  };

  const handleCreate = () => {
    const jobType = formData.employmentType === 'Internship' ? 'internships' : 'fullTime';
    const newJob = {
      id: `job-${Date.now()}`,
      title: formData.jobTitle,
      status: 'Active',
      type: formData.employmentType,
      totalApplicants: 0,
      shortlisted: 0,
      knockedOut: 0,
      link: `https://dmless.io/jobs/${jobType}/${Date.now()}`,
      screeningQuestions: formData.questions,
      minCorrectAnswers: formData.minCorrectAnswers,
    };
    addJob(newJob);
    toast.success('Job created successfully');
    navigate(formData.employmentType === 'Internship' ? '/jobs/internships' : '/jobs/full-time');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create Job</h1>
      <StepIndicator steps={STEPS} currentStep={step} />

      {step === 1 && (
        <Card>
          <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
            <Input
              label="Job Title"
              required
              {...step1Form.register('jobTitle')}
              error={step1Form.formState.errors.jobTitle?.message}
            />
            <Select
              label="Employment Type"
              required
              options={employmentTypes}
              {...step1Form.register('employmentType')}
              error={step1Form.formState.errors.employmentType?.message}
            />
            <Select
              label="Location"
              required
              options={locationTypes}
              {...step1Form.register('location')}
              error={step1Form.formState.errors.location?.message}
            />
            <Input
              label="Experience Required (years)"
              type="number"
              required
              min={0}
              max={30}
              {...step1Form.register('experienceRequired', { valueAsNumber: true })}
              error={step1Form.formState.errors.experienceRequired?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Salary Min (optional)"
                type="number"
                min={0}
                {...step1Form.register('salaryMin', { valueAsNumber: true })}
                error={step1Form.formState.errors.salaryMin?.message}
              />
              <Input
                label="Salary Max (optional)"
                type="number"
                min={0}
                {...step1Form.register('salaryMax', { valueAsNumber: true })}
                error={step1Form.formState.errors.salaryMax?.message}
              />
            </div>
            <Input
              label="Application Deadline (optional)"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              {...step1Form.register('applicationDeadline')}
              error={step1Form.formState.errors.applicationDeadline?.message}
            />
            <div className="flex justify-between pt-4">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button type="submit">Next</Button>
            </div>
          </form>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description <span className="text-pastel-redDark">*</span>
              </label>
              <textarea
                rows={6}
                className="w-full rounded-lg border border-pastel-blue/50 px-3 py-2 focus:ring-2 focus:ring-dmless-primary focus:border-transparent"
                placeholder="Describe the role, responsibilities, and requirements..."
                {...step2Form.register('jobDescription')}
              />
              {step2Form.formState.errors.jobDescription && (
                <p className="text-sm text-pastel-redDark">{step2Form.formState.errors.jobDescription.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (min 1) *</label>
              <TagInput
                value={step2Form.watch('requiredSkills') ?? formData.requiredSkills}
                onChange={(v) => {
                  step2Form.setValue('requiredSkills', v, { shouldValidate: true });
                  updateForm({ requiredSkills: v });
                }}
                minTags={1}
                error={step2Form.formState.errors.requiredSkills?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Skills (optional)</label>
              <TagInput
                value={formData.preferredSkills}
                onChange={(v) => updateForm({ preferredSkills: v })}
              />
            </div>
            <p className="text-sm text-gray-500">Upload JD (optional) – auto-fill description & skills – UI placeholder</p>
            <div className="flex justify-between pt-4">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button type="submit">Generate AI Screening Questions</Button>
            </div>
          </form>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <p className="text-sm text-gray-600 mb-2">These screening questions will be the active test for this job. Edit as needed, then confirm.</p>
          <p className="text-sm text-gray-600 mb-4">Minimum correct answers to pass: {formData.minCorrectAnswers}</p>
          <div className="mb-3">
            <Button type="button" variant="secondary" size="sm" onClick={regenerateAllQuestions}>
              Regenerate all questions
            </Button>
          </div>
          <div className="space-y-4">
            {formData.questions.map((q, i) => (
              <QuestionCard
                key={q.id ?? i}
                q={q}
                index={i}
                onRegenerate={regenerateQuestion}
                onEdit={setEditingQuestionIndex}
                onDelete={deleteQuestion}
                onSaveEdit={(editState) => saveEditedQuestion(i, editState)}
                isEditing={editingQuestionIndex === i}
              />
            ))}
          </div>
          {formData.questions.length < 5 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setFormData((prev) => ({ ...prev, questions: [...prev.questions, ...getRandomDummyQuestions(1)] }))}
            >
              + Add question
            </Button>
          )}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum correct answers (1–5)</label>
            <select
              value={formData.minCorrectAnswers}
              onChange={(e) => updateForm({ minCorrectAnswers: Number(e.target.value) })}
              className="w-full max-w-[120px] rounded-lg border border-pastel-blue/50 px-3 py-2"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-between pt-6">
            <Button type="button" variant="ghost" onClick={() => setStep(2)}>Back</Button>
            <Button type="button" onClick={() => { setEditingQuestionIndex(null); setStep(4); }}>
              OK – Confirm questions & continue
            </Button>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Additional application info</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.resumeRequired}
                onChange={(e) => updateForm({ resumeRequired: e.target.checked })}
                className="rounded border-pastel-blue/50"
              />
              <span className="text-sm">Resume upload required</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.askRelocation}
                onChange={(e) => updateForm({ askRelocation: e.target.checked })}
                className="rounded border-pastel-blue/50"
              />
              <span className="text-sm">Ask relocation willingness</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.askNoticePeriod}
                onChange={(e) => updateForm({ askNoticePeriod: e.target.checked })}
                className="rounded border-pastel-blue/50"
              />
              <span className="text-sm">Ask notice period</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.askPortfolio}
                onChange={(e) => updateForm({ askPortfolio: e.target.checked })}
                className="rounded border-pastel-blue/50"
              />
              <span className="text-sm">Ask portfolio link</span>
            </label>
          </div>
          <div className="flex justify-between pt-6">
            <Button type="button" variant="ghost" onClick={() => setStep(3)}>Back</Button>
            <Button type="button" onClick={() => setStep(5)}>Review Job</Button>
          </div>
        </Card>
      )}

      {step === 5 && (
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Review & create</h3>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-gray-500">Job Title</dt><dd className="font-medium">{formData.jobTitle}</dd></div>
            <div><dt className="text-gray-500">Location</dt><dd className="font-medium">{formData.location}</dd></div>
            <div><dt className="text-gray-500">Employment Type</dt><dd className="font-medium">{formData.employmentType}</dd></div>
            <div><dt className="text-gray-500">Experience Required</dt><dd className="font-medium">{formData.experienceRequired} years</dd></div>
            <div><dt className="text-gray-500">Screening rule</dt><dd className="font-medium">Min {formData.minCorrectAnswers} correct answers</dd></div>
            <div><dt className="text-gray-500">Application fields</dt><dd className="font-medium">Resume: {formData.resumeRequired ? 'Yes' : 'No'}, Relocation: {formData.askRelocation ? 'Yes' : 'No'}, Notice: {formData.askNoticePeriod ? 'Yes' : 'No'}, Portfolio: {formData.askPortfolio ? 'Yes' : 'No'}</dd></div>
          </dl>
          <div className="flex justify-between pt-6">
            <Button type="button" variant="ghost" onClick={() => setStep(4)}>Edit</Button>
            <Button type="button" onClick={handleCreate}>Create Job</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
