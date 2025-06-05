import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

import { jwtDecode } from 'jwt-decode';


const Signup = () => {
  const { t } = useLanguage();
  const { registerUser } = useContext(AuthContext);

  const token = localStorage.getItem("authTokens");
  if (token) {
    const decoded = jwtDecode(token);
    if (decoded?.user_id) {
      window.location.href = '/';
    } 

  }

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    password1: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, full_name, password, password1 } = formData;
    console.log(formData);

    if (email && full_name && password && password1) {
      registerUser({ email, full_name, password, password1 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('signup')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              {t('login')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder={t('emailPlaceholder') || 'Enter your email'}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                {t('name')}
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder={t('fullNamePlaceholder') || 'Enter your full name'}
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder={t('password')}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password1" className="block text-sm font-medium text-gray-700">
                {t('confirmPassword')}
              </label>
              <input
                id="password1"
                name="password1"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder={t('confirmPassword')}
                value={formData.password1}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              {t('signup')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
