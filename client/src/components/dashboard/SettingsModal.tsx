import { useState, useEffect } from 'react';
import axios from 'axios';

interface MyComponentProps {
  onClose: () => void;
}

const SettingPageModal: React.FC<MyComponentProps> = ({ onClose }) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // Added confirm password state
  const [email, setEmail] = useState<string>('');
  const [username, setUserName] = useState<string>('');
  const [initialPassword, setInitialPassword] = useState<string>(''); // Store the initial password
  const token = localStorage.getItem('token');
  const [passwordMatchError, setPasswordMatchError] = useState<string>(''); // For password mismatch error
  const [isEditing, setIsEditing] = useState<boolean>(false); // Track whether the user is editing their profile
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:3002/avatar/getUser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = response.data;
        console.log(userData);
        setUserName(userData.user_name);
        setEmail(userData.user_email);
        setPassword(userData.user_password);
        setInitialPassword(userData.user_password); // Store the initial password
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false)
      }
    };

    fetchUserData();
  }, [token]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match before submitting
    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match');
      return; // Prevent submission if passwords don't match
    }
    if (password.length < 8 && confirmPassword.length < 8) {
      setPasswordMatchError('Password should be at least 8 characters long');
      return; 
    }

    setPasswordMatchError(''); 

  
    console.log('Submitted data:', { username, email, password });
  };

  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Switch back to view mode
    setPassword(initialPassword); // Restore initial password if canceled
    setConfirmPassword(''); // Clear confirm password field
  };

  if (loading) {
    return (
      <>
      </>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[25rem] rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">My Profile</h2>
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="username">
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)} // Update username state
                className="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Enter your username"
              />
            ) : (
              <p className="text-gray-800">{username}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="email">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
                className="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Enter your email"
              />
            ) : (
              <p className="text-gray-800">{email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="password">
              Password
            </label>
            {isEditing ? (
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange} // Update password state
                className="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Enter your password"
              />
            ) : (
              <p className="text-gray-800">********</p>
            )}
          </div>

          {isEditing && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange} // Update confirmPassword state
                className="w-full rounded border-gray-300 p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {passwordMatchError && (
            <div className="text-red-500 text-sm mb-4">{passwordMatchError}</div>
          )}
          
          <div className="flex">
            <button
              type="button"
              className="mr-2 rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>

            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Confirm Changes
                </button>
                <button
                  type="button"
                  className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </button>
              </>
            ) : (
              <button
                type="button"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={handleEditClick}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingPageModal;
