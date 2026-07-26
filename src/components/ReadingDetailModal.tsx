import React, { useState, useEffect } from 'react';
import { X, BookOpen, Star, Calendar, User, Printer, Sparkles, Edit3, Trash2, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import { ReadingRecord, BookCategory } from '../types';

interface ReadingDetailModalProps {
  record: ReadingRecord | null;
  onClose: () => void;
  onDeleteRecord?: (id: string) => void;
  onUpdateRecord?: (updatedRecord: ReadingRecord) => Promise<void> | void;
  isTeacherMode?: boolean;
  currentStudentName?: string;
}

const CATEGORIES: BookCategory[] = [
  '문학/소설',
  '인문/교양',
  '과학/자연',
  '역사/사회',
  '예술/체육',
  '만화/동화',
  '기타'
];

export const ReadingDetailModal: React.FC<ReadingDetailModalProps> = ({
  record,
  onClose,
  onDeleteRecord,
  onUpdateRecord,
  isTeacherMode,
  currentStudentName
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states for editing
  const [grade, setGrade] = useState('3학년');
  const [classNum, setClassNum] = useState('2반');
  const [studentName, setStudentName] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [category, setCategory] = useState<BookCategory>('문학/소설');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [readDate, setReadDate] = useState<string>('');
  const [summary, setSummary] = useState('');
  const [reflection, setReflection] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (record) {
      setGrade(record.grade || '3학년');
      setClassNum(record.classNum || '2반');
      setStudentName(record.studentName || '');
      setBookTitle(record.bookTitle || '');
      setAuthor(record.author || '');
      setPublisher(record.publisher || '');
      setCategory(record.category || '문학/소설');
      setRating(record.rating || 5);
      setReadDate(record.readDate || new Date().toISOString().substring(0, 10));
      setSummary(record.summary || '');
      setReflection(record.reflection || '');
      setIsEditing(false);
      setShowDeleteConfirm(false);
      setErrorMsg('');
    }
  }, [record]);

  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const confirmDeleteAction = () => {
    if (onDeleteRecord && record) {
      onDeleteRecord(record.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      setErrorMsg('작성자 이름을 입력해 주세요.');
      return;
    }
    if (!bookTitle.trim()) {
      setErrorMsg('도서명을 입력해 주세요.');
      return;
    }
    if (!summary.trim() || summary.trim().length < 5) {
      setErrorMsg('줄거리를 최소 5자 이상 입력해 주세요.');
      return;
    }
    if (!reflection.trim() || reflection.trim().length < 5) {
      setErrorMsg('독후감/소감을 최소 5자 이상 입력해 주세요.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      const updatedRecord: ReadingRecord = {
        ...record,
        grade,
        classNum,
        studentName: studentName.trim(),
        bookTitle: bookTitle.trim(),
        author: author.trim() || '미상',
        publisher: publisher.trim() || '미상',
        category,
        rating,
        readDate,
        summary: summary.trim(),
        reflection: reflection.trim()
      };

      if (onUpdateRecord) {
        await onUpdateRecord(updatedRecord);
      }
      setIsEditing(false);
    } catch (err: any) {
      setErrorMsg(err.message || '수정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
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
                  {isEditing ? '독서록 수정 모드' : record.category}
                </span>
                <span className="text-xs text-[#8c7355] font-semibold">
                  {isEditing ? '내용을 수정 후 저장하세요' : '독서록 상세보기'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#3b2713] truncate max-w-sm mt-0.5 font-serif">
                📖 {isEditing ? bookTitle || record.bookTitle : record.bookTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={handlePrint}
                className="p-2 text-[#593b1d] hover:text-[#3b2713] bg-white hover:bg-[#f5ede1] rounded-xl border border-[#d9ccbd] transition-colors text-xs font-semibold flex items-center gap-1.5 px-3 shadow-2xs"
                title="인쇄하기"
              >
                <Printer className="w-4 h-4 text-[#8c6239]" />
                <span className="hidden sm:inline">인쇄/PDF</span>
              </button>
            )}

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
          
          {!isEditing ? (
            /* VIEW MODE */
            <>
              {/* Top Metadata Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#fbf8f3] rounded-xl border border-[#e3d5c5] print:bg-gray-50 print:border-gray-200">
                  <div className="text-[11px] text-[#8c7355] print:text-gray-500 font-bold">작성자</div>
                  <div className="text-sm font-bold text-[#3b2713] print:text-black mt-0.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#8c6239] print:hidden" />
                    <span>{record.grade} {record.classNum} {record.studentName}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#fbf8f3] rounded-xl border border-[#e3d5c5] print:bg-gray-50 print:border-gray-200">
                  <div className="text-[11px] text-[#8c7355] print:text-gray-500 font-bold">읽은 날짜</div>
                  <div className="text-sm font-bold text-[#3b2713] print:text-black mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8c6239] print:hidden" />
                    <span>{record.readDate}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#fbf8f3] rounded-xl border border-[#e3d5c5] print:bg-gray-50 print:border-gray-200">
                  <div className="text-[11px] text-[#8c7355] print:text-gray-500 font-bold">지은이 / 출판사</div>
                  <div className="text-xs font-semibold text-[#593b1d] print:text-black mt-0.5 truncate">
                    {record.author || '-'} / {record.publisher || '-'}
                  </div>
                </div>

                <div className="p-3 bg-[#fbf8f3] rounded-xl border border-[#e3d5c5] print:bg-gray-50 print:border-gray-200">
                  <div className="text-[11px] text-[#8c7355] print:text-gray-500 font-bold">추천 별점</div>
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
            </>
          ) : (
            /* EDIT MODE */
            <form id="edit-record-form" onSubmit={handleSaveEdit} className="space-y-5">
              
              {/* Writer Metadata */}
              <div className="p-4 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] space-y-3">
                <h4 className="text-xs font-bold text-[#734e2b] uppercase tracking-wider font-serif">
                  작성자 정보
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#593b1d] mb-1">학년</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3 py-2 text-xs font-bold text-[#3b2713] focus:outline-none focus:border-[#8c6239]"
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
                      className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3 py-2 text-xs font-bold text-[#3b2713] focus:outline-none focus:border-[#8c6239]"
                    >
                      {Array.from({ length: 15 }, (_, i) => `${i + 1}반`).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#593b1d] mb-1">학생 이름 *</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3 py-2 text-xs font-bold text-[#3b2713] focus:outline-none focus:border-[#8c6239]"
                    />
                  </div>
                </div>
              </div>

              {/* Book Info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#593b1d] mb-1">도서명 *</label>
                  <input
                    type="text"
                    required
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#3b2713] focus:outline-none focus:border-[#8c6239]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#593b1d] mb-1">지은이</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3 py-2 text-xs text-[#3b2713] focus:outline-none focus:border-[#8c6239]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#593b1d] mb-1">출판사</label>
                    <input
                      type="text"
                      value={publisher}
                      onChange={(e) => setPublisher(e.target.value)}
                      className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3 py-2 text-xs text-[#3b2713] focus:outline-none focus:border-[#8c6239]"
                    />
                  </div>
                </div>

                {/* Category & Rating */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-[#593b1d] mb-1">카테고리</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as BookCategory)}
                      className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3 py-2 text-xs font-bold text-[#3b2713] focus:outline-none focus:border-[#8c6239]"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#593b1d] mb-1">
                      별점: <strong className="text-amber-600 font-bold">{rating}점</strong>
                    </label>
                    <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-[#d9ccbd]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              (hoverRating || rating) >= star ? 'text-amber-500 fill-amber-400' : 'text-[#d4c3b1]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#593b1d] mb-1">읽은 날짜</label>
                  <input
                    type="date"
                    value={readDate}
                    onChange={(e) => setReadDate(e.target.value)}
                    className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3 py-2 text-xs font-bold text-[#3b2713] focus:outline-none focus:border-[#8c6239]"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-[#593b1d] mb-1">줄거리 요약 *</label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-white border border-[#d9ccbd] rounded-xl p-3 text-xs text-[#3b2713] focus:outline-none focus:border-[#8c6239] leading-relaxed"
                ></textarea>
              </div>

              {/* Reflection */}
              <div>
                <label className="block text-xs font-bold text-[#593b1d] mb-1">나의 생각과 느낀 점 (독후감) *</label>
                <textarea
                  rows={5}
                  required
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="w-full bg-white border border-[#d9ccbd] rounded-xl p-3 text-xs text-[#3b2713] focus:outline-none focus:border-[#8c6239] leading-relaxed"
                ></textarea>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#f8f3eb] border-t border-[#e6dcce] flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-[#8c7355] font-semibold">
            등록일시: {new Date(record.createdAt).toLocaleString('ko-KR')}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 shadow-2xs transition-colors flex items-center gap-1.5 border border-[#734e2b]"
                  title="독서록 수정"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-200" />
                  <span>수정하기</span>
                </button>

                {onDeleteRecord && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1.5"
                    title="독서록 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>삭제하기</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#f5ede1] text-[#593b1d] border border-[#d9ccbd] transition-colors shadow-2xs"
                >
                  닫기
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#f5ede1] text-[#593b1d] border border-[#d9ccbd] transition-colors shadow-2xs flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>취소</span>
                </button>

                <button
                  type="submit"
                  form="edit-record-form"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 border border-[#734e2b] transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {isSaving ? (
                    <span>저장 중...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-amber-200" />
                      <span>수정 완료</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in print:hidden">
          <div className="bg-white border border-[#e6dcce] rounded-3xl shadow-2xl p-6 max-w-sm w-full space-y-4 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#3b2713] font-serif">독서록 삭제 확인</h4>
                <p className="text-xs text-[#8c7355] mt-0.5">정말 이 독서록을 삭제하시겠습니까?</p>
              </div>
            </div>

            <div className="p-3.5 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] text-xs space-y-1">
              <div className="font-bold text-[#3b2713] font-serif">📖 {record.bookTitle}</div>
              <div className="text-[11px] text-[#734e2b]">
                {record.grade} {record.classNum} <strong className="text-[#3b2713]">{record.studentName}</strong> 학생
              </div>
            </div>

            <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200/80 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>삭제된 독서록은 다시 복구할 수 없습니다.</span>
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#f5ede1] text-[#593b1d] border border-[#d9ccbd] transition-colors shadow-2xs"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="px-4.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-rose-700 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>삭제하기</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
