import ProfileSetupForm from '../components/profile-setup/ProfileSetupForm';
import ProtectedRoute from '../components/common/ProtectedRoute';

const ProfileSetupPage = () => {
  return (
    <ProtectedRoute>
      <ProfileSetupForm />
    </ProtectedRoute>
  );
};

export default ProfileSetupPage;