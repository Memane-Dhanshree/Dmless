import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required').min(8, 'Min 8 characters'),
});

export function Login() {
  const navigate = useNavigate();
  const { login } = useApp();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = ({ email, password }) => {
    const result = login({ email, password });
    if (result?.ok) {
      navigate('/dashboard');
    } else if (result?.reason === 'no_account') {
      toast.error('No account found. Please sign up first.');
    } else if (result?.reason === 'wrong_email') {
      toast.error('Incorrect email. Please check or sign up.');
    } else if (result?.reason === 'wrong_password') {
      toast.error('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pastel-yellow/50 via-pastel-blue/20 to-pastel-green/30">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">DmLess</h1>
          <p className="text-gray-600 mt-1">Recruiter Dashboard</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
          <Button type="submit" className="w-full" size="lg">
            Sign in
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-dmless-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
