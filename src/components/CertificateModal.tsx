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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-white border border-[#e6dcce] rounded-3xl shadow-2xl overflow-hidden flex flex-col print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Header Control Buttons */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#f7f1e5] via-[#f2e7d5] to-[#ebdcc7] border-b border-[#e6dcce] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-[#734e2b] font-bold text-sm font-serif">
            <Award className="w-5 h-5 text-[#8c6239]" />
            <span>전자 독서 상장 출력 미리보기</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs border border-[#734e2b] transition-all"
            >
              <Printer className="w-4 h-4 text-amber-200" />
              <span>상장 인쇄 / PDF 저장</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#8c7355] hover:text-[#3b2713] rounded-xl hover:bg-[#f5ede1] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Official Korean School Certificate Style) */}
        <div className="p-8 sm:p-12 text-center bg-[#fffdfa] print:bg-white text-[#3b2713] border-8 border-double border-[#8c6239] m-4 sm:m-6 rounded-2xl relative overflow-hidden shadow-xs">
          
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 text-[#8c6239] text-2xl font-serif">◆</div>
          <div className="absolute top-3 right-3 text-[#8c6239] text-2xl font-serif">◆</div>
          <div className="absolute bottom-3 left-3 text-[#8c6239] text-2xl font-serif">◆</div>
          <div className="absolute bottom-3 right-3 text-[#8c6239] text-2xl font-serif">◆</div>

          <div className="space-y-6 max-w-lg mx-auto">
            
            {/* Title */}
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#8c6239] uppercase tracking-widest">
                CERTIFICATE OF READING ACHIEVEMENT
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3b2713] tracking-wider font-serif py-2">
                독 서 상 장
              </h1>
              <div className="w-16 h-1 bg-[#8c6239] mx-auto rounded-full"></div>
            </div>

            {/* Recipient info */}
            <div className="text-sm sm:text-base font-bold text-[#593b1d] space-x-2 pt-2">
              <span>{data.grade}</span>
              <span>{data.classNum}</span>
              <span className="text-xl font-black text-[#3b2713] border-b-2 border-[#8c6239] px-2 font-serif">
                {data.studentName}
              </span>
            </div>

            {/* Citation Content */}
            <p className="text-sm sm:text-base leading-loose text-[#3b2713] font-serif pt-4 px-2">
              위 학생은 다독하며 생각의 깊이를 넓히고 학급 독서 분위기 조성에 우수한 모범을 보였으므로, <strong className="text-[#8c6239] font-bold">[{data.rankTitle}]</strong>으로 선정하여 이 상장을 수여합니다.
            </p>

            <div className="text-xs text-[#734e2b] font-semibold pt-2 font-mono">
              총 독서록 기록: <strong className="font-extrabold text-[#3b2713]">{data.bookCount}권</strong> 달성
            </div>

            {/* Date & Signature */}
            <div className="pt-8 space-y-4 font-serif">
              <div className="text-xs text-[#8c7355] font-semibold">
                {data.issueDate}
              </div>

              <div className="text-lg font-bold text-[#3b2713] flex items-center justify-center gap-3">
                <span>{data.schoolName || '우리반 스마트 학급'}</span>
                <span className="px-3 py-1 bg-[#f5ede1] text-[#734e2b] border border-[#d9ccbd] rounded text-xs font-bold">
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
