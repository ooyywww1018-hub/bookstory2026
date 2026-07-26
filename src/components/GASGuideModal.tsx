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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">구글 앱스 스크립트(GAS) 연동 설정</h3>
              <p className="text-xs text-slate-400">학급의 구글 스프레드시트와 우리반 독서기록장을 실시간으로 연결합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Active URL Input Area */}
          <div className="p-4 bg-slate-850 bg-slate-800/60 rounded-xl border border-slate-700/70 space-y-3">
            <label className="block text-sm font-semibold text-slate-200">
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
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={handleSave}
                disabled={testing}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>확인 중...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>저장 및 연동</span>
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div
                className={`flex items-center gap-2 text-xs p-3 rounded-lg border ${
                  testResult.success
                    ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-950/50 text-rose-300 border-rose-500/30'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Quick Code Copy Section */}
          <div className="p-4 bg-gradient-to-r from-indigo-950/40 via-slate-800/40 to-slate-800/40 rounded-xl border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 rounded-lg text-indigo-400">
                <FileCode className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Google Apps Script 코드 (`Code.gs`)</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">CORS 지원</span>
                </h4>
                <p className="text-xs text-slate-400">구글 스프레드시트의 Apps Script 편집기에 붙여넣을 서버용 자바스크립트입니다.</p>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>복사 완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-indigo-300" />
                  <span>Code.gs 코드 복사</span>
                </>
              )}
            </button>
          </div>

          {/* Step-by-Step Guide Accordion / Timeline */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>연동 방법 5단계 가이드</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
              {steps.map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeStep === s.step
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-[11px] font-bold opacity-80">STEP {s.step}</div>
                  <div className="text-xs font-semibold truncate">{s.title}</div>
                </button>
              ))}
            </div>

            {/* Active Step Details */}
            <div className="p-5 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-300 text-sm space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs">
                  {steps[activeStep - 1].step}
                </span>
                <span>{steps[activeStep - 1].title}</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {steps[activeStep - 1].desc}
              </p>

              {activeStep === 1 && (
                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium underline mt-1"
                >
                  <span>구글 드라이브 바로가기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {activeStep === 3 && (
                <div className="relative mt-2">
                  <pre className="p-3 bg-slate-900 rounded-lg text-[11px] text-slate-300 overflow-x-auto max-h-32 border border-slate-800 font-mono">
                    {GAS_SCRIPT_CODE.substring(0, 300)}...
                  </pre>
                </div>
              )}

              {activeStep === 4 && (
                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-amber-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>
                    <strong>주의:</strong> [액세스 권한이 있는 사용자] 항목을 반드시 <strong>'모든 사용자 (Anyone)'</strong>로 설정해야 학생들이 로그인 없이 자유롭게 독서록을 제출할 수 있습니다.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Script Code Preview Toggle */}
          <details className="group bg-slate-950/40 rounded-xl border border-slate-800">
            <summary className="p-4 text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer flex items-center justify-between">
              <span>전체 Code.gs 소스 코드 미리보기</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-0">
              <pre className="p-3 bg-slate-950 rounded-lg text-[11px] text-slate-300 font-mono overflow-x-auto max-h-48 border border-slate-800">
                {GAS_SCRIPT_CODE}
              </pre>
            </div>
          </details>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
