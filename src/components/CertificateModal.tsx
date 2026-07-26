import React from 'react';
import { X, Award, Printer, Sparkles } from 'lucide-react';
import { CertificateData } from '../types';

interface CertificateModalProps {
  data: CertificateData | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  data,
  onClose
}) => {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Header Control Buttons */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>전자 독서 상장 출력 미리보기</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>상장 인쇄 / PDF 저장</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Designed to look like an official Korean School Certificate) */}
        <div className="p-8 sm:p-12 text-center bg-amber-50/10 print:bg-white text-slate-100 print:text-slate-900 border-8 border-double border-amber-500/40 print:border-amber-600 m-4 sm:m-6 rounded-2xl relative overflow-hidden">
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 text-amber-500/30 text-2xl font-serif">◆</div>
          <div className="absolute top-3 right-3 text-amber-500/30 text-2xl font-serif">◆</div>
          <div className="absolute bottom-3 left-3 text-amber-500/30 text-2xl font-serif">◆</div>
          <div className="absolute bottom-3 right-3 text-amber-500/30 text-2xl font-serif">◆</div>

          <div className="space-y-6 max-w-lg mx-auto">
            
            {/* Title */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-amber-400 print:text-amber-700 uppercase tracking-widest">
                CERTIFICATE OF READING ACHIEVEMENT
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-amber-300 print:text-amber-900 tracking-wider font-serif py-2">
                독 서 상 장
              </h1>
              <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
            </div>

            {/* Recipient info */}
            <div className="text-sm sm:text-base font-bold text-slate-200 print:text-slate-800 space-x-2 pt-2">
              <span>{data.grade}</span>
              <span>{data.classNum}</span>
              <span className="text-xl font-extrabold text-white print:text-black border-b-2 border-amber-400 px-2">
                {data.studentName}
              </span>
            </div>

            {/* Citation Content */}
            <p className="text-sm sm:text-base leading-loose text-slate-200 print:text-slate-800 font-serif pt-4 px-2">
              위 학생은 다독하며 생각의 깊이를 넓히고 학급 독서 분위기 조성에 우수한 모범을 보였으므로, <strong className="text-amber-300 print:text-amber-800 font-bold">[{data.rankTitle}]</strong>으로 선정하여 이 상장을 수여합니다.
            </p>

            <div className="text-xs text-amber-300/80 print:text-slate-600 pt-2 font-mono">
              총 독서록 기록: <strong className="font-bold text-white print:text-black">{data.bookCount}권</strong> 달성
            </div>

            {/* Date & Signature */}
            <div className="pt-8 space-y-4 font-serif">
              <div className="text-xs text-slate-300 print:text-slate-700">
                {data.issueDate}
              </div>

              <div className="text-lg font-bold text-slate-100 print:text-slate-900 flex items-center justify-center gap-3">
                <span>{data.schoolName || '우리반 스마트 학급'}</span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 print:bg-amber-100 print:text-amber-900 border border-amber-500/30 rounded text-xs">
                  {data.teacherName || '담임교사 인'}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
