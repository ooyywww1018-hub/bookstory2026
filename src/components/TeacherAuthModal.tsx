import React, { useState } from 'react';
import { X, Lock, KeyRound, Check, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { getTeacherPassword, saveTeacherPassword } from '../utils/storage';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = getTeacherPassword();
    if (passwordInput === correctPass) {
      setErrorMsg('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다. (기본 비밀번호: 1234)');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 2) {
      setErrorMsg('새 비밀번호는 2자리 이상 입력해 주세요.');
      return;
    }
    saveTeacherPassword(newPassword.trim());
    alert('교사용 비밀번호가 성공적으로 변경되었습니다!');
    setIsChangingPass(false);
    setNewPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-violet-900/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">교사 전용 대시보드 접근</h3>
              <p className="text-xs text-slate-400">학급 관리자 인증을 위해 비밀번호를 입력하세요.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {!isChangingPass ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>관리자 비밀번호</span>
                  <span className="text-[11px] text-violet-400 font-normal">초기 기본값: 1234</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="비밀번호 입력"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-400 mt-1.5">{errorMsg}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPass(true)}
                  className="text-xs text-slate-400 hover:text-violet-300 underline"
                >
                  비밀번호 변경하기
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30 transition-all flex items-center gap-1.5"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>인증 및 로그인</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">새 비밀번호 설정</h4>
                <p className="text-xs text-slate-400 mb-3">새로 사용할 비밀번호를 입력해 주세요.</p>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="예: 5678"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPass(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  돌아가기
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>비밀번호 변경 완료</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
