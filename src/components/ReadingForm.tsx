import React, { useState, useEffect } from 'react';
import { BookOpen, Star, Send, Sparkles, HelpCircle, CheckCircle2, Bookmark, Lightbulb, AlertCircle, BookMarked } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookCategory, ReadingRecord, StudentProfile } from '../types';

interface ReadingFormProps {
  studentProfile: StudentProfile;
  onSubmitRecord: (record: Omit<ReadingRecord, 'id' | 'createdAt' | 'syncStatus'>) => Promise<{ synced: boolean; message: string }>;
  onNavigateToFeed: () => void;
  isGASConnected: boolean;
  initialBookInfo?: { title: string; author: string; publisher: string; category: string } | null;
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

const REFLECTION_PROMPTS = [
  '💡 가장 인상 깊었던 장면이나 문장:',
  '🔍 책을 읽고 새롭게 깨달은 점:',
  '💌 주인공이나 작가에게 전하고 싶은 말:',
  '👍 이 책을 다른 친구들에게 추천하는 이유:'
];

export const ReadingForm: React.FC<ReadingFormProps> = ({
  studentProfile,
  onSubmitRecord,
  onNavigateToFeed,
  isGASConnected,
  initialBookInfo
}) => {
  const [grade, setGrade] = useState(studentProfile.grade || '3학년');
  const [classNum, setClassNum] = useState(studentProfile.classNum || '2반');
  const [studentName, setStudentName] = useState(studentProfile.studentName || '');
  
  const [bookTitle, setBookTitle] = useState(initialBookInfo?.title || '');
  const [author, setAuthor] = useState(initialBookInfo?.author || '');
  const [publisher, setPublisher] = useState(initialBookInfo?.publisher || '');
  const [category, setCategory] = useState<BookCategory>(
    (initialBookInfo?.category && CATEGORIES.includes(initialBookInfo.category as any)
      ? initialBookInfo.category
      : '문학/소설') as BookCategory
  );
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [readDate, setReadDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [summary, setSummary] = useState('');
  const [reflection, setReflection] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (initialBookInfo) {
      if (initialBookInfo.title) setBookTitle(initialBookInfo.title);
      if (initialBookInfo.author) setAuthor(initialBookInfo.author);
      if (initialBookInfo.publisher) setPublisher(initialBookInfo.publisher);
      if (initialBookInfo.category && CATEGORIES.includes(initialBookInfo.category as any)) {
        setCategory(initialBookInfo.category as BookCategory);
      }
    }
  }, [initialBookInfo]);

  // Keep synced if profile changes
  useEffect(() => {
    if (studentProfile.studentName) {
      setGrade(studentProfile.grade);
      setClassNum(studentProfile.classNum);
      setStudentName(studentProfile.studentName);
    }
  }, [studentProfile]);

  const handleAddPrompt = (promptText: string) => {
    if (reflection.includes(promptText)) return;
    setReflection(prev => (prev ? `${prev}\n\n${promptText} ` : `${promptText} `));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      alert('학생 이름을 입력해 주세요.');
      return;
    }
    if (!bookTitle.trim()) {
      alert('도서명을 입력해 주세요.');
      return;
    }
    if (!summary.trim() || summary.trim().length < 10) {
      alert('줄거리를 최소 10자 이상 작성해 주세요.');
      return;
    }
    if (!reflection.trim() || reflection.trim().length < 10) {
      alert('독후감 소감을 최소 10자 이상 작성해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitFeedback(null);

    try {
      const result = await onSubmitRecord({
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
      });

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback silently if canvas context is restricted
      }

      setSubmitFeedback({
        type: 'success',
        message: result.message || '독서록이 등록되었습니다!'
      });

      // Reset form fields
      setBookTitle('');
      setAuthor('');
      setPublisher('');
      setSummary('');
      setReflection('');

      // Auto redirect to feed after 1.8 seconds
      setTimeout(() => {
        onNavigateToFeed();
      }, 1800);

    } catch (err: any) {
      setSubmitFeedback({
        type: 'error',
        message: err.message || '등록 중 오류가 발생했습니다. 다시 시도해 주세요.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#f8f3eb] via-[#f2e7d5] to-[#ebdcc7] border border-[#d8c3a5] shadow-xs relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 text-[#593b1d] pointer-events-none">
          <BookMarked className="w-56 h-56" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#734e2b] border border-amber-300 text-xs font-bold mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>오늘의 생각 더하기</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3b2713] tracking-tight font-serif">
              책 한 권의 감동을 독서록에 담아보세요 📖
            </h2>
            <p className="text-[#6e5843] text-xs sm:text-sm mt-1">
              읽은 책의 줄거리와 나만의 솔직한 느낌을 기록하면 우리반 친구들과 생각을 나눌 수 있어요.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {!isGASConnected && (
              <span className="text-xs bg-white text-[#734e2b] border border-[#d9ccbd] px-3 py-1.5 rounded-xl font-bold shadow-2xs">
                💾 로컬 저장소 모드
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Form Box - Clean White Card */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 bg-white border border-[#e6dcce] rounded-3xl shadow-xs space-y-8">
        
        {/* Section 1: Student Metadata */}
        <div>
          <h3 className="text-sm font-bold text-[#734e2b] uppercase tracking-wider mb-4 flex items-center gap-2 font-serif">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8c6239]"></span>
            1. 작성자 정보
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5]">
            <div>
              <label className="block text-xs font-bold text-[#593b1d] mb-1.5">학년</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#3b2713] focus:outline-none focus:border-[#8c6239] shadow-2xs"
              >
                {['1학년', '2학년', '3학년', '4학년', '5학년', '6학년', '중1', '중2', '중3', '고1', '고2', '고3'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#593b1d] mb-1.5">반</label>
              <select
                value={classNum}
                onChange={(e) => setClassNum(e.target.value)}
                className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#3b2713] focus:outline-none focus:border-[#8c6239] shadow-2xs"
              >
                {Array.from({ length: 15 }, (_, i) => `${i + 1}반`).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#593b1d] mb-1.5">학생 이름 *</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="예: 김민준"
                className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3.5 py-2.5 text-sm text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] focus:ring-1 focus:ring-[#8c6239] shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Book Info */}
        <div>
          <h3 className="text-sm font-bold text-[#734e2b] uppercase tracking-wider mb-4 flex items-center gap-2 font-serif">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8c6239]"></span>
            2. 도서 기본 정보
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#593b1d] mb-1.5">도서명 (책 제목) *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="예: 아몬드, 어린 왕자, 마당을 나온 암탉..."
                  className="w-full bg-white border border-[#d9ccbd] rounded-xl pl-10 pr-4 py-3 text-sm text-[#3b2713] font-medium placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] focus:ring-1 focus:ring-[#8c6239] shadow-2xs"
                />
                <BookOpen className="w-4 h-4 text-[#8c7355] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#593b1d] mb-1.5">지은이 (저자)</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="예: 손원평"
                  className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3.5 py-2.5 text-sm text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] focus:ring-1 focus:ring-[#8c6239] shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#593b1d] mb-1.5">출판사</label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  placeholder="예: 창비"
                  className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3.5 py-2.5 text-sm text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] focus:ring-1 focus:ring-[#8c6239] shadow-2xs"
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-[#593b1d] mb-2">도서 장르/카테고리</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      category === cat
                        ? 'bg-[#593b1d] text-amber-50 border-[#3b2713] shadow-xs'
                        : 'bg-white text-[#6e5843] border-[#d9ccbd] hover:bg-[#f5ede1]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#593b1d] mb-1.5">
                  나의 추천 별점: <strong className="text-amber-600 font-bold">{rating}점</strong>
                </label>
                <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-[#d9ccbd] w-fit shadow-2xs">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-[#d4c3b1]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#593b1d] mb-1.5">읽은 날짜</label>
                <input
                  type="date"
                  value={readDate}
                  onChange={(e) => setReadDate(e.target.value)}
                  className="w-full bg-white border border-[#d9ccbd] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#3b2713] focus:outline-none focus:border-[#8c6239] shadow-2xs"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#734e2b] uppercase tracking-wider flex items-center gap-2 font-serif">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8c6239]"></span>
              3. 책의 줄거리 요약 *
            </h3>
            <span className="text-xs text-[#8c7355] font-semibold">
              {summary.length}자 (최소 10자 권장)
            </span>
          </div>

          <textarea
            required
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="책의 핵심 내용이나 줄거리를 간단히 간추려 작성해 보세요."
            className="w-full bg-white border border-[#d9ccbd] rounded-2xl p-4 text-sm text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] focus:ring-1 focus:ring-[#8c6239] custom-scrollbar leading-relaxed shadow-2xs"
          ></textarea>
        </div>

        {/* Section 4: Reflection & Prompts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#734e2b] uppercase tracking-wider flex items-center gap-2 font-serif">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8c6239]"></span>
              4. 나의 생각과 느낌 (독후감) *
            </h3>
            <span className="text-xs text-[#8c7355] font-semibold">
              {reflection.length}자 (최소 10자 권장)
            </span>
          </div>

          {/* Quick Helper Prompts */}
          <div className="mb-3 p-3.5 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-[#734e2b] font-bold">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>작성 도우미 (클릭 시 가이드 문구가 추가됩니다)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {REFLECTION_PROMPTS.map((prompt, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleAddPrompt(prompt)}
                  className="px-2.5 py-1 bg-white hover:bg-[#f5ede1] border border-[#d9ccbd] rounded-lg text-xs font-semibold text-[#593b1d] transition-colors shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <textarea
            required
            rows={5}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="책을 읽고 느낀 점, 깨달은 점, 주인공에게 하고 싶은 말 등을 자율적으로 작성해 주세요."
            className="w-full bg-white border border-[#d9ccbd] rounded-2xl p-4 text-sm text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] focus:ring-1 focus:ring-[#8c6239] custom-scrollbar leading-relaxed shadow-2xs"
          ></textarea>
        </div>

        {/* Feedback Alert */}
        {submitFeedback && (
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold ${
              submitFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            {submitFeedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{submitFeedback.message}</span>
          </div>
        )}

        {/* Form Actions */}
        <div className="pt-4 border-t border-[#f0e6da] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8c7355] font-medium">
            * 제출 후에도 교사 및 학생 본인이 등록된 독서록을 확인할 수 있습니다.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 font-bold rounded-xl shadow-sm border border-[#734e2b] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>전송 중...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-amber-200" />
                <span>독서록 등록하기</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
