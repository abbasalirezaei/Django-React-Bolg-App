import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
	const { loginUser } = useContext(AuthContext);
	const { t } = useLanguage();

	const token = localStorage.getItem("authTokens");
	if (token) {
		const decoded = jwtDecode(token);
		var user_id = decoded.user_id;
		window.location.href = '/';
	}

	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { email, password } = formData;

		console.log('Login attempt:', { email, password });

		if (email.length > 0 && password.length > 0) {
			loginUser(email, password);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				
				<div>
					<div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
						<span className="text-white font-bold text-xl">B</span>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						{t('login')}
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						{t('dontHaveAccount')}{' '}
						<Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
							{t('signup')}
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
								placeholder={t('emailPlaceholder')}
								value={formData.email}
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
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 text-blue-600 border-gray-300 rounded"
							/>
							<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
								Remember me
							</label>
						</div>
						<div className="text-sm">
							<a href="#" className="font-medium text-blue-600 hover:text-blue-500">
								{t('forgotPassword')}
							</a>
						</div>
					</div>

					<div>
						<Button type="submit" className="w-full">
							{t('login')}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
