import React from 'react';
import { BookOpen, Trophy, BarChart3, Settings, User, Sparkles, CheckCircle2, AlertCircle, Flame, BookMarked } from 'lucide-react';
import { StudentProfile } from '../types';

interface HeaderProps {
  activeTab: 'feed' | 'bestseller' | 'form' | 'king' | 'teacher';
  setActiveTab: (tab: 'feed' | 'bestseller' | 'form' | 'king' | 'teacher') => void;
  studentProfile: StudentProfile;
  onOpenProfileModal: () => void;
  onOpenGASModal: () => void;
  isGASConnected: boolean;
  isTeacherMode: boolean;
  onOpenTeacherAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  studentProfile,
  onOpenProfileModal,
  onOpenGASModal,
  isGASConnected,
  isTeacherMode,
  onOpenTeacherAuth
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e6dcce] text-[#3b2713] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & App Name */}
          <div 
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-[#8c6239] text-amber-50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200 border border-[#734e2b] shrink-0">
              <BookMarked className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-[#3b2713] font-serif whitespace-nowrap">
                  우리반 마음서점
                </span>
                <span className="hidden xl:inline-block px-2 py-0.5 text-[11px] font-bold bg-[#f5ede1] text-[#734e2b] rounded-full border border-[#d9ccbd] whitespace-nowrap">
                  전자 독서기록장
                </span>
              </div>
              <p className="text-xs text-[#8c7355] hidden sm:block font-medium whitespace-nowrap">
                따뜻한 책 내음 가득한 학급 독서 서가 📖
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#f5ede1] p-1.5 rounded-2xl border border-[#d9ccbd] shrink-0">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeTab === 'feed'
                  ? 'bg-[#593b1d] text-amber-50 shadow-sm'
                  : 'text-[#6e5843] hover:text-[#3b2713] hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">독서록 서가</span>
            </button>

            <button
              onClick={() => setActiveTab('bestseller')}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeTab === 'bestseller'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-[#6e5843] hover:text-[#3b2713] hover:bg-white/60'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              <span className="whitespace-nowrap">YES24 베스트셀러</span>
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeTab === 'form'
                  ? 'bg-[#8c6239] text-white shadow-sm'
                  : 'text-[#6e5843] hover:text-[#3b2713] hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-200 shrink-0" />
              <span className="whitespace-nowrap">독서록 쓰기</span>
            </button>

            <button
              onClick={() => setActiveTab('king')}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeTab === 'king'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm'
                  : 'text-[#6e5843] hover:text-[#3b2713] hover:bg-white/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-200 shrink-0" />
              <span className="whitespace-nowrap">이달의 독서왕</span>
            </button>

            <button
              onClick={() => {
                if (isTeacherMode) {
                  setActiveTab('teacher');
                } else {
                  onOpenTeacherAuth();
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeTab === 'teacher'
                  ? 'bg-violet-800 text-white shadow-sm'
                  : 'text-[#6e5843] hover:text-[#3b2713] hover:bg-white/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-violet-200 shrink-0" />
              <span className="whitespace-nowrap">교사 대시보드</span>
              {isTeacherMode && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              )}
            </button>
          </nav>

          {/* User Profile & Config Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Student Profile Pill */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl bg-[#fbf8f3] hover:bg-[#f5ede1] border border-[#d9ccbd] text-[#3b2713] text-xs sm:text-sm font-medium transition-colors shadow-2xs whitespace-nowrap shrink-0"
              title="내 학급/이름 설정"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8c6239] shrink-0" />
              <span className="whitespace-nowrap">
                {studentProfile.studentName ? (
                  <>{studentProfile.grade} {studentProfile.classNum} <strong className="text-[#734e2b]">{studentProfile.studentName}</strong></>
                ) : (
                  <span className="text-[#8c7355]">학생 정보 등록</span>
                )}
              </span>
            </button>

            {/* GAS Sync Status Button */}
            <button
              onClick={onOpenGASModal}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all whitespace-nowrap shrink-0 ${
                isGASConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
              title="구글 시트 연동 설정"
            >
              {isGASConnected ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="whitespace-nowrap">구글 시트 연동</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                  <span className="whitespace-nowrap">로컬 저장소</span>
                </>
              )}
              <Settings className="w-3.5 h-3.5 text-[#8c7355] ml-0.5 shrink-0" />
            </button>

          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-[#e6dcce] text-xs font-medium">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
              activeTab === 'feed' ? 'text-[#593b1d] font-bold' : 'text-[#8c7355]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>독서록</span>
          </button>

          <button
            onClick={() => setActiveTab('bestseller')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
              activeTab === 'bestseller' ? 'text-amber-700 font-bold' : 'text-[#8c7355]'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>베스트셀러</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
              activeTab === 'form' ? 'text-[#8c6239] font-bold' : 'text-[#8c7355]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>글쓰기</span>
          </button>

          <button
            onClick={() => setActiveTab('king')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
              activeTab === 'king' ? 'text-amber-700 font-bold' : 'text-[#8c7355]'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>독서왕</span>
          </button>

          <button
            onClick={() => {
              if (isTeacherMode) {
                setActiveTab('teacher');
              } else {
                onOpenTeacherAuth();
              }
            }}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
              activeTab === 'teacher' ? 'text-violet-800 font-bold' : 'text-[#8c7355]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>교사용</span>
          </button>
        </div>

      </div>
    </header>
  );
};

