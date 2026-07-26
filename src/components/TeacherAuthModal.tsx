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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-[#e6dcce] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#f7f1e5] via-[#f2e7d5] to-[#ebdcc7] border-b border-[#e6dcce] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8c6239] border border-[#734e2b] flex items-center justify-center text-amber-100 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#3b2713] font-serif">교사 대시보드 인증</h3>
              <p className="text-xs text-[#734e2b]">학급 관리자 인증을 위해 비밀번호를 입력하세요.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8c7355] hover:text-[#3b2713] rounded-xl hover:bg-[#f5ede1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Pure White */}
        <div className="p-6">
          {!isChangingPass ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#593b1d] mb-1 flex items-center justify-between">
                  <span>관리자 비밀번호</span>
                  <span className="text-[11px] text-[#8c6239] font-normal">초기 기본값: 1234</span>
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
                    className="w-full bg-white border border-[#d9ccbd] rounded-xl px-4 py-2.5 text-sm text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] focus:ring-1 focus:ring-[#8c6239] pr-10 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#8c7355] hover:text-[#3b2713]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-xs text-rose-600 mt-1.5 font-semibold">{errorMsg}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPass(true)}
                  className="text-xs text-[#8c6239] hover:text-[#734e2b] underline font-bold"
                >
                  비밀번호 변경하기
                </button>

                <div className="flex gap-2">
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
                    <KeyRound className="w-4 h-4 text-amber-200" />
                    <span>인증 및 로그인</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[#3b2713] mb-1 font-serif">새 비밀번호 설정</h4>
                <p className="text-xs text-[#734e2b] mb-3">새로 사용할 비밀번호를 입력해 주세요.</p>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="예: 5678"
                  className="w-full bg-white border border-[#d9ccbd] rounded-xl px-4 py-2.5 text-sm text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] shadow-2xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPass(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#f5ede1] text-[#593b1d] border border-[#d9ccbd] transition-colors shadow-2xs"
                >
                  돌아가기
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 shadow-xs border border-[#734e2b] transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-amber-200" />
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
