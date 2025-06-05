
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('about')}</h1>
            <p className="text-xl text-gray-600">
              Learn more about BlogSpace and our mission
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                BlogSpace was founded with a simple mission: to create a platform where writers and readers 
                can connect through meaningful content. We believe that everyone has a story to tell and 
                knowledge to share.
              </p>
              <p>
                Our platform brings together writers from diverse backgrounds, enabling them to share their 
                expertise, experiences, and insights with a global audience. Whether you're a seasoned 
                professional or just starting your writing journey, BlogSpace provides the tools and 
                community you need to succeed.
              </p>
              <p>
                We're committed to fostering a supportive environment where creativity flourishes and 
                meaningful conversations take place. Our bilingual support ensures that language is never 
                a barrier to sharing your voice with the world.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To democratize content creation and provide a platform where every voice can be heard, 
                every story can be told, and every reader can find content that inspires and educates.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700">
                To become the world's leading platform for authentic, high-quality content that connects 
                communities and cultures across the globe.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Join Our Community</h2>
            <div className="text-center">
              <p className="text-gray-700 mb-6">
                Ready to start your writing journey or discover amazing content? Join thousands of 
                writers and readers who call BlogSpace home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Start Writing
                </button>
                <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Explore Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
