import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

const profileSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().required('New password is required').min(8, 'Min 8 characters').notOneOf([yup.ref('currentPassword')], 'New password must be different from current password'),
  confirmPassword: yup.string().required('Confirm password').oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export function Profile() {
  const { user, updateUser } = useApp();
  const profileForm = useForm({
    defaultValues: { name: user.name, email: user.email, phone: user.phone },
    resolver: yupResolver(profileSchema),
  });
  const passwordForm = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    resolver: yupResolver(passwordSchema),
  });

  const onProfileSubmit = (data) => {
    updateUser(data);
    toast.success('Profile updated');
  };
  const onPasswordSubmit = () => {
    toast.success('Password changed');
    passwordForm.reset();
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Update your account details</p>
      </div>

      <Card>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <Input
            label="Name"
            required
            {...profileForm.register('name')}
            error={profileForm.formState.errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            readOnly
            {...profileForm.register('email')}
            error={profileForm.formState.errors.email?.message}
            className="bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">Email is read-only (same as signup).</p>
          <Input
            label="Phone"
            required
            {...profileForm.register('phone')}
            error={profileForm.formState.errors.phone?.message}
          />
          <div className="flex gap-2">
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="ghost" onClick={() => profileForm.reset()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="font-semibold text-gray-800 mb-4">Change Password</h2>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            required
            {...passwordForm.register('currentPassword')}
            error={passwordForm.formState.errors.currentPassword?.message}
          />
          <Input
            label="New Password"
            type="password"
            required
            {...passwordForm.register('newPassword')}
            error={passwordForm.formState.errors.newPassword?.message}
          />
          <Input
            label="Confirm New Password"
            type="password"
            required
            {...passwordForm.register('confirmPassword')}
            error={passwordForm.formState.errors.confirmPassword?.message}
          />
          <div className="flex gap-2">
            <Button type="submit">Change Password</Button>
            <Button type="button" variant="ghost" onClick={() => passwordForm.reset()}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
