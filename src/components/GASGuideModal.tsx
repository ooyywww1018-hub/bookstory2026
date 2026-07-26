import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Link2, FileCode, Play, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { GAS_SCRIPT_CODE } from '../utils/gasScriptSource';

interface GASGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onSaveUrl: (url: string) => void;
  onTestConnection: (url: string) => Promise<boolean>;
}

export const GASGuideModal: React.FC<GASGuideModalProps> = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  onTestConnection
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = async () => {
    onSaveUrl(urlInput);
    if (urlInput.trim()) {
      setTesting(true);
      const isOk = await onTestConnection(urlInput);
      setTesting(false);
      if (isOk) {
        setTestResult({ success: true, message: '구글 앱스 스크립트 연동에 성공하였습니다!' });
        setTimeout(() => onClose(), 1200);
      } else {
        setTestResult({ success: false, message: '연동 확인 중 오류가 발생했습니다. URL을 다시 확인해 주세요.' });
      }
    } else {
      onClose();
    }
  };

  const steps = [
    {
      step: 1,
      title: '구글 스프레드시트 생성',
      desc: '구글 드라이브(drive.google.com)에서 [새로 만들기] → [Google 스프레드시트]를 생성합니다.'
    },
    {
      step: 2,
      title: 'Apps Script 편집기 열기',
      desc: '스프레드시트 상단 메뉴에서 [확장 프로그램] → [Apps Script]를 클릭합니다.'
    },
    {
      step: 3,
      title: 'Code.gs 코드 붙여넣기',
      desc: '아래 [Code.gs 코드 복사] 버튼을 누른 후, 편집기의 기존 코드를 모두 지우고 붙여넣습니다.'
    },
    {
      step: 4,
      title: '웹 앱으로 배포하기',
      desc: '상단 [배포] → [새 배포] → 유형 선택(⚙️) → [웹 앱] 선택. 액세스 권한을 [모든 사용자(Anyone)]로 설정 후 [배포]를 누릅니다.'
    },
    {
      step: 5,
      title: '웹 앱 URL 입력 및 완료',
      desc: '생성된 웹 앱 URL(https://script.google.com/macros/s/...)을 복사하여 아래 입력창에 붙여넣고 저장하세요.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-[#e6dcce] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#f7f1e5] via-[#f2e7d5] to-[#ebdcc7] border-b border-[#e6dcce] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8c6239] border border-[#734e2b] flex items-center justify-center text-amber-100 shadow-sm">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#3b2713] font-serif">구글 앱스 스크립트(GAS) 연동 설정</h3>
              <p className="text-xs text-[#734e2b]">학급의 구글 스프레드시트와 우리반 독서기록장을 실시간으로 연결합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8c7355] hover:text-[#3b2713] rounded-xl hover:bg-[#f5ede1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Active URL Input Area */}
          <div className="p-4 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] space-y-3">
            <label className="block text-sm font-bold text-[#3b2713]">
              현재 구글 앱스 스크립트 웹 앱 URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setTestResult(null);
                }}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 bg-white border border-[#d9ccbd] rounded-xl px-4 py-2.5 text-sm text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] shadow-2xs"
              />
              <button
                onClick={handleSave}
                disabled={testing}
                className="px-5 py-2.5 bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-xs border border-[#734e2b] disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>확인 중...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-amber-200" />
                    <span>저장 및 연동</span>
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div
                className={`flex items-center gap-2 text-xs p-3 rounded-xl border font-semibold ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Quick Code Copy Section */}
          <div className="p-4 bg-[#f8f3eb] rounded-2xl border border-[#d8c3a5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#8c6239] rounded-xl text-amber-100 shadow-2xs">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3b2713] flex items-center gap-2 font-serif">
                  <span>Google Apps Script 코드 (`Code.gs`)</span>
                  <span className="text-[10px] bg-amber-100 text-[#734e2b] px-2 py-0.5 rounded border border-amber-300 font-bold">CORS 지원</span>
                </h4>
                <p className="text-xs text-[#734e2b]">구글 스프레드시트의 Apps Script 편집기에 붙여넣을 서버용 자바스크립트입니다.</p>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                copied
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white hover:bg-[#f5ede1] text-[#593b1d] border border-[#d9ccbd] shadow-2xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8c6239]" />
                  <span>Code.gs 코드 복사</span>
                </>
              )}
            </button>
          </div>

          {/* Step-by-Step Guide Accordion / Timeline */}
          <div>
            <h4 className="text-sm font-bold text-[#3b2713] mb-3 flex items-center gap-2 font-serif">
              <Sparkles className="w-4 h-4 text-[#8c6239]" />
              <span>연동 방법 5단계 가이드</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
              {steps.map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeStep === s.step
                      ? 'bg-[#593b1d] border-[#3b2713] text-amber-50 shadow-2xs'
                      : 'bg-white border-[#d9ccbd] text-[#6e5843] hover:bg-[#f5ede1]'
                  }`}
                >
                  <div className="text-[11px] font-bold opacity-80">STEP {s.step}</div>
                  <div className="text-xs font-bold truncate">{s.title}</div>
                </button>
              ))}
            </div>

            {/* Active Step Details */}
            <div className="p-5 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] text-[#3b2713] text-sm space-y-3">
              <div className="flex items-center gap-2 text-[#734e2b] font-bold text-base font-serif">
                <span className="w-6 h-6 rounded-full bg-[#8c6239] text-amber-50 flex items-center justify-center text-xs font-bold">
                  {steps[activeStep - 1].step}
                </span>
                <span>{steps[activeStep - 1].title}</span>
              </div>
              <p className="text-[#593b1d] leading-relaxed text-xs sm:text-sm">
                {steps[activeStep - 1].desc}
              </p>

              {activeStep === 1 && (
                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8c6239] hover:text-[#734e2b] font-bold underline mt-1"
                >
                  <span>구글 드라이브 바로가기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {activeStep === 3 && (
                <div className="relative mt-2">
                  <pre className="p-3 bg-white rounded-xl text-[11px] text-[#3b2713] overflow-x-auto max-h-32 border border-[#d9ccbd] font-mono">
                    {GAS_SCRIPT_CODE.substring(0, 300)}...
                  </pre>
                </div>
              )}

              {activeStep === 4 && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-[#734e2b] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span>
                    <strong>주의:</strong> [액세스 권한이 있는 사용자] 항목을 반드시 <strong>'모든 사용자 (Anyone)'</strong>로 설정해야 학생들이 로그인 없이 자유롭게 독서록을 제출할 수 있습니다.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Script Code Preview Toggle */}
          <details className="group bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5]">
            <summary className="p-4 text-xs font-bold text-[#734e2b] hover:text-[#3b2713] cursor-pointer flex items-center justify-between">
              <span>전체 Code.gs 소스 코드 미리보기</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0">
              <pre className="p-3 bg-white rounded-xl text-[11px] text-[#3b2713] font-mono overflow-x-auto max-h-48 border border-[#d9ccbd]">
                {GAS_SCRIPT_CODE}
              </pre>
            </div>
          </details>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f8f3eb] border-t border-[#e6dcce] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#f5ede1] text-[#593b1d] border border-[#d9ccbd] transition-colors shadow-2xs"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
