import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ErrorAlert from '../components/ui/ErrorAlert';
import { normalizeApiError } from '../utils/errorHandler';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorObj, setErrorObj] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorObj({ title: 'Validation Error', message: 'Image must be less than 5MB' });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrorObj(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setErrorObj(null);

    const formData = new FormData();
    if (name) formData.append('name', name);
    if (selectedFile) formData.append('avatar', selectedFile);

    try {
      const response = await api.put('/users/profile', formData);

      if (response.data.success) {
        setMessage('Profile updated successfully!');
        updateUser(response.data.data);
      }
    } catch (err) {
      setErrorObj(normalizeApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-on-surface mb-8">My Profile</h1>
        
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-outline-variant/60">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b border-outline-variant/60">
              <div className="relative group">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-primary/20" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-primary/20">
                    <span className="material-symbols-outlined text-[40px] text-on-surface-variant">person</span>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
              </div>
              
              <div className="flex flex-col justify-center text-center sm:text-left h-24">
                <h3 className="font-title-lg font-semibold text-on-surface">{user?.name}</h3>
                <p className="text-on-surface-variant">{user?.email}</p>
                <p className="text-[12px] text-outline mt-1">JPG, GIF or PNG. Max size of 5MB.</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-surface w-full rounded-xl px-4 py-3 text-[14px] text-on-surface border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-on-surface">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  disabled
                  className="bg-surface-container-low w-full rounded-xl px-4 py-3 text-[14px] text-on-surface-variant border border-outline-variant/60 cursor-not-allowed"
                />
                <span className="text-[11px] text-outline">Email address cannot be changed.</span>
              </div>
            </div>

            {/* Messages */}
            {message && <div className="text-[#22c55e] text-[13px] font-medium bg-[#22c55e]/10 p-3 rounded-lg border border-[#22c55e]/20">{message}</div>}
            {errorObj && <ErrorAlert error={errorObj} />}

            {/* Submit */}
            <div className="flex justify-end pt-4 mt-2 border-t border-outline-variant/60">
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2.5 rounded-full font-semibold text-[14px] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
