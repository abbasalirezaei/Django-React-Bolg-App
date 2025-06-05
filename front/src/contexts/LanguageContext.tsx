
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    signup: 'Sign Up',
    dashboard: 'Dashboard',
    logout: 'Logout',
    
    // Homepage
    latestPosts: 'Latest Posts',
    featuredPosts: 'Featured Posts',
    popularPosts: 'Popular Posts',
    allPosts: 'All Posts',
    newsletter: 'Newsletter',
    subscribeNewsletter: 'Subscribe to our newsletter',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    readMore: 'Read More',
    
    // Post
    by: 'By',
    publishedOn: 'Published on',
    likes: 'Likes',
    views: 'Views',
    comments: 'Comments',
    categories: 'Categories',
    tags: 'Tags',
    
    // Authentication
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    forgotPassword: 'Forgot Password?',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    
    // Dashboard
    myPosts: 'My Posts',
    createPost: 'Create Post',
    profile: 'Profile',
    editPost: 'Edit Post',
    deletePost: 'Delete Post',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
  },
  fa: {
    // Navigation
    home: 'خانه',
    about: 'درباره ما',
    contact: 'تماس با ما',
    login: 'ورود',
    signup: 'ثبت نام',
    dashboard: 'داشبورد',
    logout: 'خروج',
    
    // Homepage
    latestPosts: 'آخرین مطالب',
    featuredPosts: 'مطالب ویژه',
    popularPosts: 'مطالب محبوب',
    allPosts: 'همه مطالب',
    newsletter: 'خبرنامه',
    subscribeNewsletter: 'عضویت در خبرنامه',
    emailPlaceholder: 'ایمیل خود را وارد کنید',
    subscribe: 'عضویت',
    readMore: 'ادامه مطلب',
    
    // Post
    by: 'نویسنده',
    publishedOn: 'تاریخ انتشار',
    likes: 'پسند',
    views: 'بازدید',
    comments: 'نظرات',
    categories: 'دسته‌بندی‌ها',
    tags: 'برچسب‌ها',
    
    // Authentication
    email: 'ایمیل',
    password: 'رمز عبور',
    confirmPassword: 'تایید رمز عبور',
    name: 'نام',
    forgotPassword: 'رمز عبور را فراموش کردید؟',
    alreadyHaveAccount: 'حساب کاربری دارید؟',
    dontHaveAccount: 'حساب کاربری ندارید؟',
    
    // Dashboard
    myPosts: 'مطالب من',
    createPost: 'ایجاد مطلب',
    profile: 'پروفایل',
    editPost: 'ویرایش مطلب',
    deletePost: 'حذف مطلب',
    
    // Common
    search: 'جستجو',
    filter: 'فیلتر',
    all: 'همه',
    save: 'ذخیره',
    cancel: 'لغو',
    edit: 'ویرایش',
    delete: 'حذف',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fa')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      <div className={language === 'fa' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};
