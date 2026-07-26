import React from 'react';
import { X, BookOpen, Star, Calendar, User, Tag, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { ReadingRecord } from '../types';

interface ReadingDetailModalProps {
  record: ReadingRecord | null;
  onClose: () => void;
  onDeleteRecord?: (id: string) => void;
  isTeacherMode?: boolean;
}

export const ReadingDetailModal: React.FC<ReadingDetailModalProps> = ({
  record,
  onClose,
  onDeleteRecord,
  isTeacherMode
}) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = () => {
    if (window.confirm(`'${record.bookTitle}' 독서록을 삭제하시겠습니까?`)) {
      if (onDeleteRecord) {
        onDeleteRecord(record.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm animate-fade-in print:bg-white print:p-0">
      <div className="relative w-full max-w-2xl bg-white border border-[#e6dcce] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col print:shadow-none print:border-none print:bg-white print:text-black">
        
        {/* Header - Non printable control buttons */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#f7f1e5] via-[#f2e7d5] to-[#ebdcc7] border-b border-[#e6dcce] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8c6239] border border-[#734e2b] flex items-center justify-center text-amber-100 shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white text-[#734e2b] text-xs font-bold border border-[#d9ccbd]">
                  {record.category}
                </span>
                <span className="text-xs text-[#8c7355]">독서록 상세보기</span>
              </div>
              <h3 className="text-lg font-bold text-[#3b2713] truncate max-w-sm mt-0.5 font-serif">
                {record.bookTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-[#593b1d] hover:text-[#3b2713] bg-white hover:bg-[#f5ede1] rounded-xl border border-[#d9ccbd] transition-colors text-xs font-semibold flex items-center gap-1.5 px-3"
              title="인쇄하기"
            >
              <Printer className="w-4 h-4 text-[#8c6239]" />
              <span className="hidden sm:inline">인쇄/PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#8c7355] hover:text-[#3b2713] rounded-xl hover:bg-[#f5ede1] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 print:p-8 print:text-black">
          
          {/* Top Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#fbf8f3] rounded-xl border border-[#e3d5c5] print:bg-gray-50 print:border-gray-200">
              <div className="text-[11px] text-[#8c7355] print:text-gray-500">작성자</div>
              <div className="text-sm font-bold text-[#3b2713] print:text-black mt-0.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#8c6239] print:hidden" />
                <span>{record.grade} {record.classNum} {record.studentName}</span>
              </div>
            </div>

            <div className="p-3 bg-[#fbf8f3] rounded-xl border border-[#e3d5c5] print:bg-gray-50 print:border-gray-200">
              <div className="text-[11px] text-[#8c7355] print:text-gray-500">읽은 날짜</div>
              <div className="text-sm font-bold text-[#3b2713] print:text-black mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#8c6239] print:hidden" />
                <span>{record.readDate}</span>
              </div>
            </div>

            <div className="p-3 bg-[#fbf8f3] rounded-xl border border-[#e3d5c5] print:bg-gray-50 print:border-gray-200">
              <div className="text-[11px] text-[#8c7355] print:text-gray-500">지은이 / 출판사</div>
              <div className="text-xs font-semibold text-[#593b1d] print:text-black mt-0.5 truncate">
                {record.author || '-'} / {record.publisher || '-'}
              </div>
            </div>

            <div className="p-3 bg-[#fbf8f3] rounded-xl border border-[#e3d5c5] print:bg-gray-50 print:border-gray-200">
              <div className="text-[11px] text-[#8c7355] print:text-gray-500">추천 별점</div>
              <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      record.rating >= star ? 'fill-amber-400 text-amber-500' : 'text-[#d4c3b1] print:text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-[#3b2713] print:text-black ml-1">{record.rating}점</span>
              </div>
            </div>
          </div>

          {/* Book Title Large */}
          <div className="p-4 bg-[#f7f1e5] rounded-2xl border border-[#d8c3a5] print:bg-gray-100 print:border-gray-300">
            <h2 className="text-xl sm:text-2xl font-black text-[#3b2713] print:text-black tracking-tight font-serif">
              📖 {record.bookTitle}
            </h2>
          </div>

          {/* Summary Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#734e2b] print:text-gray-700 uppercase tracking-wider flex items-center gap-1.5 font-serif">
              <Sparkles className="w-3.5 h-3.5 text-[#8c6239] print:hidden" />
              <span>줄거리 요약</span>
            </h4>
            <div className="p-4 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] text-[#3b2713] print:bg-white print:border-gray-300 print:text-black text-sm leading-relaxed whitespace-pre-wrap">
              {record.summary || '줄거리 내용이 작성되지 않았습니다.'}
            </div>
          </div>

          {/* Reflection Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#734e2b] print:text-gray-700 uppercase tracking-wider flex items-center gap-1.5 font-serif">
              <BookOpen className="w-3.5 h-3.5 text-[#8c6239] print:hidden" />
              <span>나의 생각과 느낀 점 (독후감)</span>
            </h4>
            <div className="p-4 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] text-[#3b2713] print:bg-white print:border-gray-300 print:text-black text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {record.reflection || '소감 내용이 작성되지 않았습니다.'}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#f8f3eb] border-t border-[#e6dcce] flex items-center justify-between print:hidden">
          <div className="text-xs text-[#8c7355]">
            등록일시: {new Date(record.createdAt).toLocaleString('ko-KR')}
          </div>

          <div className="flex items-center gap-2">
            {isTeacherMode && onDeleteRecord && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 transition-colors"
              >
                삭제하기
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
