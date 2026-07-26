import React, { useState, useMemo } from 'react';
import { Trophy, Crown, Medal, Award, Sparkles, BookOpen, HeartHandshake, Flame, RefreshCw, BookMarked } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReadingRecord, CertificateData } from '../types';

interface ReadingKingProps {
  records: ReadingRecord[];
  onOpenCertificate: (data: CertificateData) => void;
}

export const ReadingKing: React.FC<ReadingKingProps> = ({
  records,
  onOpenCertificate
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current');

  // Launch celebratory confetti
  const handleCelebrate = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {
      // Fallback
    }
  };

  // Compute Ranking List based on selected period
  const rankings = useMemo(() => {
    const currentMonthPrefix = new Date().toISOString().substring(0, 7); // e.g., "2026-07"

    const filtered = records.filter((r) => {
      if (selectedPeriod === 'current') {
        return r.readDate && r.readDate.startsWith(currentMonthPrefix);
      }
      return true; // 'all'
    });

    const studentMap: Record<string, { studentName: string; grade: string; classNum: string; count: number; categories: Record<string, number>; recentBook: string }> = {};

    filtered.forEach((r) => {
      const key = `${r.grade}_${r.classNum}_${r.studentName}`;
      if (!studentMap[key]) {
        studentMap[key] = {
          studentName: r.studentName,
          grade: r.grade,
          classNum: r.classNum,
          count: 0,
          categories: {},
          recentBook: r.bookTitle
        };
      }
      studentMap[key].count += 1;
      const cat = r.category || '기타';
      studentMap[key].categories[cat] = (studentMap[key].categories[cat] || 0) + 1;
      studentMap[key].recentBook = r.bookTitle;
    });

    return Object.values(studentMap)
      .sort((a, b) => b.count - a.count)
      .map((item, index) => {
        // Find favorite category
        const favCategory = Object.entries(item.categories).sort((a, b) => b[1] - a[1])[0]?.[0] || '독서';
        
        let badgeTitle = '독서 열정가';
        if (index === 0) badgeTitle = '🥇 명예의 독서왕';
        else if (index === 1) badgeTitle = '🥈 탐구 열정왕';
        else if (index === 2) badgeTitle = '🥉 다독 모범왕';

        return {
          rank: index + 1,
          ...item,
          favCategory,
          badgeTitle
        };
      });
  }, [records, selectedPeriod]);

  const top1 = rankings[0];
  const top2 = rankings[1];
  const top3 = rankings[2];
  const restRankings = rankings.slice(3);

  const currentYearMonth = `${new Date().getFullYear()}년 ${new Date().getMonth() + 1}월`;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#f8f3eb] via-[#f2e7d5] to-[#ebdcc7] border border-[#d8c3a5] shadow-xs relative overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 opacity-10 text-[#593b1d] pointer-events-none">
          <BookMarked className="w-80 h-80" />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-[#734e2b] border border-amber-300 text-xs font-bold shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>우리반 명예의 전당</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3b2713] tracking-tight font-serif">
              🏆 이달의 독서왕 (Hall of Fame)
            </h2>
            <p className="text-[#6e5843] text-xs sm:text-sm max-w-xl">
              꾸준히 독서록을 작성하며 지식의 지평을 넓힌 최고 독서왕 학생들을 칭찬합니다!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white border border-[#d9ccbd] text-[#3b2713] font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#8c6239] shadow-2xs"
            >
              <option value="current">{currentYearMonth} 독서왕</option>
              <option value="all">전체 누적 독서왕</option>
            </select>

            <button
              onClick={handleCelebrate}
              className="px-4 py-2.5 bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 font-bold rounded-xl text-xs sm:text-sm shadow-sm border border-[#734e2b] transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>축하 폭죽 🎉</span>
            </button>
          </div>

        </div>
      </div>

      {/* TOP 3 Podium Stage - Clean White Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        
        {/* TOP 2 (Left) */}
        {top2 ? (
          <div className="order-2 md:order-1 p-6 bg-white border border-[#e6dcce] rounded-3xl shadow-xs flex flex-col items-center text-center space-y-4 relative overflow-hidden group hover:border-[#8c6239] transition-all">
            <div className="absolute top-3 right-3 text-2xl font-black text-[#d4c3b1] opacity-40">#2</div>
            <div className="w-16 h-16 rounded-full bg-[#f5ede1] border-2 border-[#d9ccbd] flex items-center justify-center text-[#734e2b] shadow-xs">
              <Medal className="w-8 h-8 text-[#8c6239]" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-[#f5ede1] text-[#734e2b] text-xs font-bold border border-[#d9ccbd]">
                🥈 {top2.badgeTitle}
              </span>
              <h3 className="text-xl font-bold text-[#3b2713] mt-1 font-serif">
                {top2.grade} {top2.classNum} {top2.studentName}
              </h3>
              <p className="text-xs text-[#8c7355] font-semibold">주 장르: {top2.favCategory}</p>
            </div>

            <div className="p-3 bg-[#fbf8f3] rounded-2xl w-full border border-[#e3d5c5]">
              <div className="text-2xl font-black text-[#3b2713] font-serif">{top2.count}<span className="text-xs font-normal text-[#8c7355] ml-1">권 기록</span></div>
              <p className="text-[11px] text-[#734e2b] truncate mt-1">최근: 📖 {top2.recentBook}</p>
            </div>

            <button
              onClick={() => onOpenCertificate({
                studentName: top2.studentName,
                grade: top2.grade,
                classNum: top2.classNum,
                rankTitle: '이달의 2등 독서왕 (은상)',
                bookCount: top2.count,
                issueDate: new Date().toLocaleDateString('ko-KR'),
                schoolName: '우리반 독서 교실',
                teacherName: '담임교사'
              })}
              className="w-full py-2 bg-white hover:bg-[#f5ede1] text-[#593b1d] text-xs font-bold rounded-xl border border-[#d9ccbd] transition-colors flex items-center justify-center gap-1 shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>독서 상장 수여</span>
            </button>
          </div>
        ) : (
          <div className="order-2 md:order-1 p-6 bg-white border border-[#e6dcce] rounded-3xl text-center text-[#8c7355] text-xs font-medium">
            2등 후보 집계 중...
          </div>
        )}

        {/* TOP 1 (Center - Crown Champion) */}
        {top1 ? (
          <div className="order-1 md:order-2 p-8 bg-white border-2 border-[#8c6239] rounded-3xl shadow-md flex flex-col items-center text-center space-y-4 relative overflow-hidden group scale-105">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#8c6239] via-amber-400 to-[#734e2b]"></div>
            <div className="w-20 h-20 rounded-full bg-[#f8f3eb] border-4 border-[#8c6239] flex items-center justify-center text-amber-600 shadow-sm">
              <Crown className="w-10 h-10 text-amber-600 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-4 py-1.5 rounded-full bg-amber-100 text-[#734e2b] text-xs font-extrabold border border-amber-300 shadow-2xs">
                👑 1등 최우수 독서왕
              </span>
              <h3 className="text-2xl font-extrabold text-[#3b2713] mt-2 font-serif">
                {top1.grade} {top1.classNum} <span className="text-[#8c6239]">{top1.studentName}</span>
              </h3>
              <p className="text-xs text-[#734e2b] font-semibold">선호 장르: {top1.favCategory}</p>
            </div>

            <div className="p-4 bg-[#fbf8f3] rounded-2xl w-full border border-[#e3d5c5]">
              <div className="text-3xl font-black text-[#3b2713] font-serif">{top1.count}<span className="text-xs font-normal text-[#8c7355] ml-1">권 기록 완료</span></div>
              <p className="text-xs text-[#734e2b] truncate mt-1 font-medium">최근 완독: 📖 {top1.recentBook}</p>
            </div>

            <button
              onClick={() => onOpenCertificate({
                studentName: top1.studentName,
                grade: top1.grade,
                classNum: top1.classNum,
                rankTitle: '이달의 1등 최우수 독서왕 (대상)',
                bookCount: top1.count,
                issueDate: new Date().toLocaleDateString('ko-KR'),
                schoolName: '우리반 독서 교실',
                teacherName: '담임교사'
              })}
              className="w-full py-2.5 bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 text-xs font-bold rounded-xl shadow-xs border border-[#734e2b] transition-all flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-200" />
              <span>독서 대상 상장 수여</span>
            </button>
          </div>
        ) : (
          <div className="order-1 md:order-2 p-8 bg-white border border-[#e6dcce] rounded-3xl text-center text-[#8c7355] text-xs font-medium">
            1등 독서왕 집계 중...
          </div>
        )}

        {/* TOP 3 (Right) */}
        {top3 ? (
          <div className="order-3 p-6 bg-white border border-[#e6dcce] rounded-3xl shadow-xs flex flex-col items-center text-center space-y-4 relative overflow-hidden group hover:border-[#8c6239] transition-all">
            <div className="absolute top-3 right-3 text-2xl font-black text-[#d4c3b1] opacity-40">#3</div>
            <div className="w-16 h-16 rounded-full bg-[#f5ede1] border-2 border-[#d9ccbd] flex items-center justify-center text-[#734e2b] shadow-xs">
              <Medal className="w-8 h-8 text-[#8c6239]" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-[#f5ede1] text-[#734e2b] text-xs font-bold border border-[#d9ccbd]">
                🥉 {top3.badgeTitle}
              </span>
              <h3 className="text-xl font-bold text-[#3b2713] mt-1 font-serif">
                {top3.grade} {top3.classNum} {top3.studentName}
              </h3>
              <p className="text-xs text-[#8c7355] font-semibold">주 장르: {top3.favCategory}</p>
            </div>

            <div className="p-3 bg-[#fbf8f3] rounded-2xl w-full border border-[#e3d5c5]">
              <div className="text-2xl font-black text-[#3b2713] font-serif">{top3.count}<span className="text-xs font-normal text-[#8c7355] ml-1">권 기록</span></div>
              <p className="text-[11px] text-[#734e2b] truncate mt-1">최근: 📖 {top3.recentBook}</p>
            </div>

            <button
              onClick={() => onOpenCertificate({
                studentName: top3.studentName,
                grade: top3.grade,
                classNum: top3.classNum,
                rankTitle: '이달의 3등 독서왕 (동상)',
                bookCount: top3.count,
                issueDate: new Date().toLocaleDateString('ko-KR'),
                schoolName: '우리반 독서 교실',
                teacherName: '담임교사'
              })}
              className="w-full py-2 bg-white hover:bg-[#f5ede1] text-[#593b1d] text-xs font-bold rounded-xl border border-[#d9ccbd] transition-colors flex items-center justify-center gap-1 shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>독서 상장 수여</span>
            </button>
          </div>
        ) : (
          <div className="order-3 p-6 bg-white border border-[#e6dcce] rounded-3xl text-center text-[#8c7355] text-xs font-medium">
            3등 후보 집계 중...
          </div>
        )}

      </div>

      {/* Rest Ranking List */}
      {restRankings.length > 0 && (
        <div className="p-6 bg-white border border-[#e6dcce] rounded-3xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#3b2713] flex items-center gap-2 font-serif">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>열정 독서가 순위 목록 (4위 이하)</span>
          </h3>

          <div className="divide-y divide-[#f0e6da]">
            {restRankings.map((st) => (
              <div key={`${st.grade}_${st.classNum}_${st.studentName}`} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-[#8c7355]">#{st.rank}</span>
                  <span className="font-bold text-[#3b2713]">{st.grade} {st.classNum} {st.studentName}</span>
                  <span className="text-xs text-[#8c7355] hidden sm:inline font-medium">({st.favCategory})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-[#734e2b]">{st.count}권</span>
                  <button
                    onClick={() => onOpenCertificate({
                      studentName: st.studentName,
                      grade: st.grade,
                      classNum: st.classNum,
                      rankTitle: '열정 독서 장려상',
                      bookCount: st.count,
                      issueDate: new Date().toLocaleDateString('ko-KR'),
                      schoolName: '우리반 독서 교실',
                      teacherName: '담임교사'
                    })}
                    className="p-1.5 bg-[#f5ede1] hover:bg-[#e8dbc9] text-[#593b1d] rounded-lg text-xs font-semibold border border-[#d9ccbd]"
                    title="상장 생성"
                  >
                    <Award className="w-3.5 h-3.5 text-[#8c6239]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestone Badges System Explanation */}
      <div className="p-6 bg-white border border-[#e6dcce] rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-[#734e2b] flex items-center gap-2 font-serif">
          <BookOpen className="w-4 h-4 text-[#8c6239]" />
          <span>우리반 독서 달성 배지 획득 기준</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] text-center space-y-1">
            <div className="text-xl">🌱</div>
            <div className="font-bold text-[#3b2713]">첫 걸음 배지</div>
            <p className="text-[11px] text-[#8c7355]">1권 독서록 작성 완료</p>
          </div>

          <div className="p-3.5 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] text-center space-y-1">
            <div className="text-xl">📚</div>
            <div className="font-bold text-[#3b2713]">독서 탐험가</div>
            <p className="text-[11px] text-[#8c7355]">5권 이상 독서록 작성</p>
          </div>

          <div className="p-3.5 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] text-center space-y-1">
            <div className="text-xl">🐛</div>
            <div className="font-bold text-[#3b2713]">책벌레 배지</div>
            <p className="text-[11px] text-[#8c7355]">10권 이상 독서록 작성</p>
          </div>

          <div className="p-3.5 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] text-center space-y-1">
            <div className="text-xl">👑</div>
            <div className="font-bold text-[#734e2b]">마스터 리더</div>
            <p className="text-[11px] text-[#8c7355]">20권 이상 독서록 달성</p>
          </div>
        </div>
      </div>

    </div>
  );
};
