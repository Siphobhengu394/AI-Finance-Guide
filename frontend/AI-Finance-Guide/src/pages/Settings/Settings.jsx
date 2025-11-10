import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { BASE_URL, API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    password: '',
    profileImageUrl: ''
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
        setUserData({
          fullName: data.fullName,
          email: data.email,
          profileImageUrl: data.profileImageUrl || "",
          password: ''
        });
      } catch (_error) {
        console.error(_error);
        toast.error('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  // Apply theme whenever preferences.theme changes
  useEffect(() => {
    const active = preferences.theme === 'dark' ? 'dark' : 'light';
    console.log('[Theme] applying theme:', active);

    if (active === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      // debug fallback: set a visible body background so you can see theme change instantly
      document.body.style.backgroundColor = '#0f172a'; // dark slate
      document.body.style.color = '#e6eef8';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.style.backgroundColor = '#f8fafc'; // light gray
      document.body.style.color = '#111827';
    }

    // Persist to localStorage (ensure source of truth)
    localStorage.setItem('theme', active);
  }, [preferences.theme]);

  const handleAccountChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        BASE_URL + API_PATHS.IMAGE.UPLOAD_IMAGE,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData((prev) => ({ ...prev, profileImageUrl: data.imageUrl }));
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Failed to upload image");
      console.log(err);
    }
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        fullName: userData.fullName,
        email: userData.email,
        profileImageUrl: userData.profileImageUrl
      };
      if (userData.password) {
        payload.password = userData.password;
      }

      await axios.put(BASE_URL + API_PATHS.AUTH.UPDATE_USER_INFO, payload, {
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

  // Theme Toggle Logic (only update state + localStorage; useEffect applies)
  const handleThemeToggle = () => {
    setPreferences((prev) => {
      const newTheme = prev.theme === 'light' ? 'dark' : 'light';
      // update immediately in state; useEffect will apply DOM changes
      return { ...prev, theme: newTheme };
    });
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setPreferences((prev) => ({ ...prev, currency: newCurrency }));
    localStorage.setItem('currency', newCurrency);
  };

  const handleNotificationToggle = () => {
    const newSetting = !preferences.notifications;
    setPreferences((prev) => ({ ...prev, notifications: newSetting }));
    localStorage.setItem('notifications', newSetting);
    toast.success(newSetting ? 'Notifications enabled' : 'Notifications disabled');
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="my-6 max-w-3xl mx-auto space-y-8">
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>

        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>

          <form onSubmit={handleSaveAccount} className="space-y-5">

            <div className="flex flex-col items-center gap-4 mb-6">
              <img
                src={userData.profileImageUrl || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />

              <label
                htmlFor="profileImage"
                className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition"
              >
                Update Profile Picture
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>

            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleAccountChange}
                className="w-full border p-2 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleAccountChange}
                className="w-full border p-2 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleAccountChange}
                placeholder="Leave blank to keep current password"
                autoComplete="new-password"
                className="w-full border p-2 rounded-md dark:bg-gray-700 dark:border-gray-600"
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
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-2xl shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Theme Mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active: <strong>{preferences.theme}</strong></p>
            </div>

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
