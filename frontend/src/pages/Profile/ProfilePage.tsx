import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  User,
  Mail,
  ShieldCheck,
  Sparkles,
  Check,
  Camera,
  Calendar,
  Layers,
  FileText,
  LogOut,
  Save,
  Briefcase,
  Image as ImageIcon,
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [bio, setBio] =
    useState('');

  const [memberSince, setMemberSince] =
    useState('');

  const [profileImage, setProfileImage] =
    useState('');

  const [saved, setSaved] =
    useState(false);

  /*
   * ======================================================
   * LOAD USER DATA
   * ======================================================
   */

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem('user');

      if (
        !storedUser ||
        storedUser === 'undefined'
      ) {
        return;
      }

      const user =
        JSON.parse(storedUser);

      setName(
        user?.username || ''
      );

      setEmail(
        user?.email || ''
      );

      setBio(
        user?.bio || ''
      );

      setProfileImage(
        user?.profileImage || ''
      );

      if (user?.createdAt) {
        const joined =
          new Date(user.createdAt);

        setMemberSince(
          joined.toLocaleDateString(
            'en-US',
            {
              month: 'short',
              year: 'numeric',
            }
          )
        );
      }
    } catch (error) {
      console.error(
        'Invalid user data in localStorage:',
        error
      );
    }
  }, []);

  /*
   * ======================================================
   * PROFILE INITIALS
   * ======================================================
   */

  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) =>
        part
          .charAt(0)
          .toUpperCase()
      )
      .slice(0, 2)
      .join('') || 'U';

  /*
   * ======================================================
   * OPEN IMAGE PICKER
   * ======================================================
   */

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  /*
   * ======================================================
   * HANDLE PROFILE IMAGE
   * ======================================================
   */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Only allow image files.
     */

    if (!file.type.startsWith('image/')) {
      alert(
        'Please select a valid image file.'
      );

      return;
    }

    /*
     * Keep the image reasonably sized.
     */

    if (file.size > 5 * 1024 * 1024) {
      alert(
        'Please select an image smaller than 5 MB.'
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      const image =
        reader.result;

      if (
        typeof image === 'string'
      ) {
        setProfileImage(image);
        setSaved(false);
      }
    };

    reader.onerror = () => {
      alert(
        'Unable to read the selected image.'
      );
    };

    reader.readAsDataURL(file);
  };

  /*
   * ======================================================
   * SAVE PROFILE
   * ======================================================
   */

  const handleSave = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const storedUser =
        localStorage.getItem('user');

      if (storedUser) {
        const user =
          JSON.parse(storedUser);

        const updatedUser = {
          ...user,

          username: name,

          email: email,

          bio: bio,

          profileImage:
            profileImage,
        };

        localStorage.setItem(
          'user',
          JSON.stringify(updatedUser)
        );
      }

      setSaved(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error(
        'Error saving profile:',
        error
      );
    }
  };

  /*
   * ======================================================
   * LOGOUT
   * ======================================================
   */

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    navigate('/login');
  };

  /*
   * ======================================================
   * PAGE
   * ======================================================
   */

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">

      {/* ==================================================
          PROFILE HEADER
      ================================================== */}

      <Card
        glow
        className="overflow-hidden border-slate-800"
      >

        {/* Cover */}

        <div className="relative h-32 sm:h-40 overflow-hidden bg-gradient-to-r from-indigo-600/25 via-purple-600/15 to-slate-900">

          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />

          <div className="absolute -right-20 -top-32 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="absolute -left-20 -bottom-32 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />

        </div>

        {/* Profile Header Content */}

        <div className="relative px-6 pb-6">

          <div className="flex flex-col sm:flex-row sm:items-end gap-5">

            {/* Avatar */}

            <div className="-mt-12 relative shrink-0">

              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-2xl shadow-indigo-500/20">

                <div className="w-full h-full bg-slate-950 rounded-[14px] overflow-hidden flex items-center justify-center">

                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-indigo-400">
                      {initials}
                    </span>
                  )}

                </div>

              </div>

              {/* Camera */}

              <button
                type="button"
                onClick={
                  handleCameraClick
                }
                aria-label="Upload profile photo"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500 hover:bg-slate-800 transition shadow-lg flex items-center justify-center"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Hidden input */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />

            </div>

            {/* Identity */}

            <div className="flex-1 min-w-0">

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
                  {name ||
                    'Your Name'}
                </h1>

                <Badge
                  variant="emerald"
                  className="text-[9px]"
                >
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Verified
                </Badge>

              </div>

              <p className="text-xs text-slate-400 mt-1 break-all">
                {email ||
                  'your@email.com'}
              </p>

            </div>

            {/* Plan */}

            <div className="self-start sm:self-end">

              <Badge
                variant="indigo"
                className="px-3 py-1.5 text-xs"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Pro Plan
              </Badge>

            </div>

          </div>

        </div>

      </Card>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ==================================================
            LEFT PROFILE INFORMATION
        ================================================== */}

        <div className="lg:col-span-4">

          <Card className="border-slate-800 overflow-hidden">

            <div className="p-5 border-b border-slate-800">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                </div>

                <div>

                  <h2 className="text-sm font-semibold text-white">
                    Account Overview
                  </h2>

                  <p className="text-[10px] text-slate-500 mt-1">
                    Your Forma workspace activity
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5 space-y-5">

              {/* Forms */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-indigo-400" />
                  </div>

                  <div>

                    <p className="text-xs font-medium text-slate-300">
                      Forms Created
                    </p>

                    <p className="text-[10px] text-slate-600">
                      Your generated forms
                    </p>

                  </div>

                </div>

                <span className="text-sm font-bold text-white">
                  0
                </span>

              </div>

              {/* Submissions */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-purple-400" />
                  </div>

                  <div>

                    <p className="text-xs font-medium text-slate-300">
                      Submissions
                    </p>

                    <p className="text-[10px] text-slate-600">
                      Total responses
                    </p>

                  </div>

                </div>

                <span className="text-sm font-bold text-white">
                  0
                </span>

              </div>

              {/* Member */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                  </div>

                  <div>

                    <p className="text-xs font-medium text-slate-300">
                      Member Since
                    </p>

                    <p className="text-[10px] text-slate-600">
                      Account creation
                    </p>

                  </div>

                </div>

                <span className="text-xs font-semibold text-white">
                  {memberSince ||
                    'Recently Joined'}
                </span>

              </div>

            </div>

            {/* Photo helper */}

            <div className="mx-5 mb-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">

              <div className="flex gap-3">

                <ImageIcon className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />

                <div>

                  <p className="text-xs font-medium text-white">
                    Profile photo
                  </p>

                  <p className="text-[10px] leading-relaxed text-slate-500 mt-1">
                    Click the camera button
                    on your profile picture
                    to upload an image.
                    Maximum size is 5 MB.
                  </p>

                </div>

              </div>

            </div>

          </Card>

        </div>

        {/* ==================================================
            EDIT PROFILE
        ================================================== */}

        <div className="lg:col-span-8">

          <Card className="border-slate-800">

            {/* Header */}

            <div className="p-6 border-b border-slate-800">

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-400" />
                  </div>

                  <div>

                    <h2 className="text-sm font-semibold text-white">
                      Personal Details
                    </h2>

                    <p className="text-[10px] text-slate-500 mt-1">
                      Update your account information
                    </p>

                  </div>

                </div>

                <ShieldCheck className="w-4 h-4 text-emerald-400" />

              </div>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSave}
              className="p-6 space-y-6"
            >

              {/* Name + Email */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Name */}

                <div className="space-y-2">

                  <label className="text-xs font-medium text-slate-300">
                    Full Name
                  </label>

                  <div className="relative">

                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />

                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      placeholder="Enter your full name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition"
                    />

                  </div>

                </div>

                {/* Email */}

                <div className="space-y-2">

                  <label className="text-xs font-medium text-slate-300">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="you@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition"
                    />

                  </div>

                </div>

              </div>

              {/* Bio */}

              <div className="space-y-2">

                <div className="flex items-center justify-between">

                  <label className="text-xs font-medium text-slate-300">
                    Bio / Role
                  </label>

                  <span className="text-[10px] text-slate-600">
                    Optional
                  </span>

                </div>

                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) =>
                    setBio(
                      e.target.value
                    )
                  }
                  placeholder="Tell us about your work, role, or what you use Forma for..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 resize-none transition"
                />

              </div>

              {/* Account security */}

              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.025] p-4">

                <div className="flex gap-3">

                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">

                    <ShieldCheck className="w-4 h-4 text-emerald-400" />

                  </div>

                  <div>

                    <p className="text-xs font-semibold text-white">
                      Account information
                    </p>

                    <p className="text-[10px] leading-relaxed text-slate-500 mt-1">
                      Your profile information
                      is associated with your
                      Forma account. Save your
                      changes to update your
                      profile.
                    </p>

                  </div>

                </div>

              </div>

              {/* Actions */}

              <div className="pt-2 border-t border-slate-800 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">

                {/* Logout */}

                <Button
                  type="button"
                  size="sm"
                  onClick={
                    handleLogout
                  }
                  className="bg-red-600 hover:bg-red-700 border border-red-500/20"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  Logout
                </Button>

                {/* Save */}

                <Button
                  type="submit"
                  size="sm"
                >

                  {saved ? (
                    <>
                      <Check className="w-4 h-4 mr-1.5 text-emerald-400" />
                      Changes Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1.5" />
                      Save Profile Changes
                    </>
                  )}

                </Button>

              </div>

            </form>

          </Card>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;