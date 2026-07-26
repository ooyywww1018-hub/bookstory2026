import React, { useState } from 'react';
import { X, User, Check, Sparkles } from 'lucide-react';
import { StudentProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [grade, setGrade] = useState(profile.grade || '3학년');
  const [classNum, setClassNum] = useState(profile.classNum || '2반');
  const [studentName, setStudentName] = useState(profile.studentName || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      alert('이름을 입력해 주세요.');
      return;
    }
    onSaveProfile({ grade, classNum, studentName: studentName.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-[#e6dcce] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#f7f1e5] via-[#f2e7d5] to-[#ebdcc7] border-b border-[#e6dcce] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8c6239] border border-[#734e2b] flex items-center justify-center text-amber-100 shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#3b2713] font-serif">내 프로필 설정</h3>
              <p className="text-xs text-[#734e2b]">독서록 작성 시 내 정보가 자동으로 적용됩니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8c7355] hover:text-[#3b2713] rounded-xl hover:bg-[#f5ede1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - Pure White Background */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#593b1d] mb-1">학년</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3 py-2.5 text-sm font-bold text-[#3b2713] focus:outline-none focus:border-[#8c6239] shadow-2xs"
              >
                {['1학년', '2학년', '3학년', '4학년', '5학년', '6학년', '중1', '중2', '중3', '고1', '고2', '고3'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#593b1d] mb-1">반</label>
              <select
                value={classNum}
                onChange={(e) => setClassNum(e.target.value)}
                className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3 py-2.5 text-sm font-bold text-[#3b2713] focus:outline-none focus:border-[#8c6239] shadow-2xs"
              >
                {Array.from({ length: 15 }, (_, i) => `${i + 1}반`).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#593b1d] mb-1">학생 이름 *</label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="예: 김민준"
              className="w-full bg-white border border-[#d9ccbd] rounded-xl px-4 py-2.5 text-sm text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] focus:ring-1 focus:ring-[#8c6239] shadow-2xs"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#f5ede1] text-[#593b1d] border border-[#d9ccbd] transition-colors shadow-2xs"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 shadow-xs border border-[#734e2b] transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-amber-200" />
              <span>저장하기</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
