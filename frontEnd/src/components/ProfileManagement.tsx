import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Save } from 'lucide-react';
import { profileAPI } from "../api/api";

const ProfileManagement = () => {
    const { t } = useLanguage();
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        website: '',
        twitter: '',
        linkedin: '',
        image:''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await profileAPI.getProfile();
                
                setProfileData({
                    fullName: response.data.full_name || '',
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    bio: response.data.bio || '',
                    image: response.data.image || '',
                    location: response.data.location || '',
                    website: response.data.website || '',
                    twitter: response.data.twitter || '',
                    linkedin: response.data.linkedin || ''
                });
                console.log(response);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (field: string, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Profile updated:', profileData);
        // TODO: اینجا میتونی پروفایل رو با API به‌روزرسانی کنی
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('profile')}</h2>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="space-y-6">
                        {/* Profile Picture Section */}
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                 {profileData.image ? (
                                        <img
                                        src={profileData.image}
                                        alt="User Profile"
                                        className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-blue-600" />
                                    )}

                            </div>
                            <div>
                                <Button variant="outline" size="sm">
                                    Change Photo
                                </Button>
                                <p className="text-sm text-gray-500 mt-2">
                                    JPG, GIF or PNG. 1MB max.
                                </p>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={profileData.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={profileData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={profileData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={profileData.bio}
                                onChange={(e) => handleChange('bio', e.target.value)}
                                placeholder="Tell us about yourself..."
                                rows={4}
                            />
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        value={profileData.website}
                                        onChange={(e) => handleChange('website', e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="twitter">Twitter</Label>
                                    <Input
                                        id="twitter"
                                        value={profileData.twitter}
                                        onChange={(e) => handleChange('twitter', e.target.value)}
                                        placeholder="@username"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="linkedin">LinkedIn</Label>
                                    <Input
                                        id="linkedin"
                                        value={profileData.linkedin}
                                        onChange={(e) => handleChange('linkedin', e.target.value)}
                                        placeholder="linkedin.com/in/username"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex items-center justify-end pt-6 border-t border-gray-100">
                            <Button type="submit">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileManagement;
