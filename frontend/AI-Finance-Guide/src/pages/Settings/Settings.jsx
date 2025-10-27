import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { BASE_URL, API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [preferences, setPreferences] = useState({
    theme: localStorage.getItem('theme') || 'light',
    currency: localStorage.getItem('currency') || 'USD',
    notifications: localStorage.getItem('notifications') === 'true',
  });
  const [loading, setLoading] = useState(false);

  // Fetch user profile on page load
  useEffect(() => {
    
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          BASE_URL + API_PATHS.AUTH.GET_USER_INFO,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData({ name: data.name, email: data.email, password: '' });
      } catch (_error) {
        console.error(_error);
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();

    // Apply theme on mount
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleAccountChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { name: userData.name, email: userData.email };
      if (userData.password) payload.password = userData.password;

      await axios.put(BASE_URL + API_PATHS.AUTH.GET_USER_INFO, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profile updated successfully!');
      setUserData({ ...userData, password: '' });
    } catch (_error) {
      console.error(_error);
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  // Preferences Logic
  const handleThemeToggle = () => {
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setPreferences({ ...preferences, theme: newTheme });
    localStorage.setItem('theme', newTheme);
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setPreferences({ ...preferences, currency: newCurrency });
    localStorage.setItem('currency', newCurrency);
  };

  const handleNotificationToggle = () => {
    const newSetting = !preferences.notifications;
    setPreferences({ ...preferences, notifications: newSetting });
    localStorage.setItem('notifications', newSetting);
    toast.success(
      newSetting ? 'Notifications enabled' : 'Notifications disabled'
    );
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="my-6 max-w-3xl mx-auto space-y-8">
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>

        {/* Account Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <form onSubmit={handleSaveAccount} className="space-y-5">
            <div>
              <label className="block text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleAccountChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleAccountChange}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleAccountChange}
                placeholder="Leave blank to keep current password"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition w-full"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Appearance */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Theme Mode</p>
            <button
              onClick={handleThemeToggle}
              className={`px-4 py-2 rounded-md text-white ${
                preferences.theme === 'dark' ? 'bg-gray-800' : 'bg-primary'
              }`}
            >
              {preferences.theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>
          <div className="flex flex-col gap-3">
            <label className="text-gray-600">Default Currency</label>
            <select
              value={preferences.currency}
              onChange={handleCurrencyChange}
              className="border p-2 rounded-md focus:ring-2 focus:ring-primary"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="ZAR">ZAR (R)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Email Notifications</p>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications}
                onChange={handleNotificationToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 
              peer-checked:after:translate-x-full peer-checked:after:border-white 
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
              after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
              after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
