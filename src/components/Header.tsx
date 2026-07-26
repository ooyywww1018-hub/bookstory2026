import React from 'react';
import { BookOpen, Trophy, BarChart3, Settings, User, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { StudentProfile } from '../types';

interface HeaderProps {
  activeTab: 'form' | 'feed' | 'king' | 'teacher';
  setActiveTab: (tab: 'form' | 'feed' | 'king' | 'teacher') => void;
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
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & App Name */}
          <div 
            onClick={() => setActiveTab('feed')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  우리반 전자 독서기록장
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                  스마트 학급용
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                함께 읽고 생각하며 성장하는 우리들의 독서 공간 📖
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'feed'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>독서록 모아보기</span>
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'form'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>독서록 작성하기</span>
            </button>

            <button
              onClick={() => setActiveTab('king')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'king'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>이달의 독서왕</span>
            </button>

            <button
              onClick={() => {
                if (isTeacherMode) {
                  setActiveTab('teacher');
                } else {
                  onOpenTeacherAuth();
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'teacher'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-violet-300" />
              <span>교사 대시보드</span>
              {isTeacherMode && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          </nav>

          {/* User Profile & Config Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Student Profile Pill */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-colors"
              title="내 학급/이름 설정"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
              <span className="max-w-[120px] truncate">
                {studentProfile.studentName ? (
                  <>{studentProfile.grade} {studentProfile.classNum} <strong className="text-indigo-300">{studentProfile.studentName}</strong></>
                ) : (
                  <span className="text-slate-400">학생 정보 등록</span>
                )}
              </span>
            </button>

            {/* GAS Sync Status Button */}
            <button
              onClick={onOpenGASModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                isGASConnected
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/50'
              }`}
              title="구글 시트 연동 설정"
            >
              {isGASConnected ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">구글 시트 연동중</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">로컬 모드 (설정)</span>
                </>
              )}
              <Settings className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'feed' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>독서목록</span>
          </button>

          <button
            onClick={() => setActiveTab('form')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'form' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>기록하기</span>
          </button>

          <button
            onClick={() => setActiveTab('king')}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'king' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
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
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'teacher' ? 'text-violet-400 font-bold' : 'text-slate-400'
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
