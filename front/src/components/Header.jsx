
import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';


import { AuthContext } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
    const { language, setLanguage, t } = useLanguage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { logoutUser, authTokens, user } = useContext(AuthContext);

    useEffect(() => {
        if (authTokens && user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [authTokens, user]);

    
    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">B</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Abbas Blog</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                            {t('home')}
                        </Link>
                        <Link to="/posts" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Posts
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                            {t('about')}
                        </Link>
                        <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                            {t('contact')}
                        </Link>
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder={t('search')}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'fa' : 'en')}
                            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors"
                        >
                            {language === 'en' ? 'فا' : 'EN'}
                        </button>

                        {/* Auth Buttons */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-2">
                                <Link to="/dashboard">
                                    <Button variant="ghost" size="sm">
                                        <User className="w-4 h-4 mr-2" />
                                        {t('dashboard')}
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={logoutUser}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    {t('logout')}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">
                                        {t('login')}
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button size="sm">
                                        {t('signup')}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
