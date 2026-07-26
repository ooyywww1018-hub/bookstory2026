import React, { useState, useMemo } from 'react';
import { Trophy, Crown, Medal, Award, Sparkles, BookOpen, HeartHandshake, Flame, RefreshCw } from 'lucide-react';
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
      
      {/* Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-amber-500/30 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>우리반 명예의 전당</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              🏆 이달의 독서왕 (Hall of Fame)
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              꾸준히 독서록을 작성하며 지식의 지평을 넓힌 최고 독서왕 학생들을 칭찬합니다!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-slate-800 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 focus:outline-none"
            >
              <option value="current">{currentYearMonth} 독서왕</option>
              <option value="all">전체 누적 독서왕</option>
            </select>

            <button
              onClick={handleCelebrate}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>축하 폭죽 🎉</span>
            </button>
          </div>

        </div>
      </div>

      {/* TOP 3 Podium Stage */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        
        {/* TOP 2 (Left) */}
        {top2 ? (
          <div className="order-2 md:order-1 p-6 bg-slate-900/90 border border-slate-400/30 rounded-3xl shadow-xl flex flex-col items-center text-center space-y-4 relative overflow-hidden group hover:border-slate-300 transition-all">
            <div className="absolute top-3 right-3 text-2xl font-black text-slate-400 opacity-20">#2</div>
            <div className="w-16 h-16 rounded-full bg-slate-700/50 border-2 border-slate-300 flex items-center justify-center text-slate-200 shadow-lg">
              <Medal className="w-8 h-8 text-slate-300" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
                🥈 {top2.badgeTitle}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {top2.grade} {top2.classNum} {top2.studentName}
              </h3>
              <p className="text-xs text-slate-400">주 장르: {top2.favCategory}</p>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl w-full border border-slate-800">
              <div className="text-2xl font-black text-slate-200">{top2.count}<span className="text-xs font-normal text-slate-400 ml-1">권 기록</span></div>
              <p className="text-[11px] text-slate-400 truncate mt-1">최근: {top2.recentBook}</p>
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
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-slate-300" />
              <span>독서 상장 수여</span>
            </button>
          </div>
        ) : (
          <div className="order-2 md:order-1 p-6 bg-slate-900/40 border border-slate-800 rounded-3xl text-center text-slate-500 text-xs">
            2등 후보 집계 중...
          </div>
        )}

        {/* TOP 1 (Center - Crown Champion) */}
        {top1 ? (
          <div className="order-1 md:order-2 p-8 bg-gradient-to-b from-amber-950/90 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl shadow-amber-500/10 flex flex-col items-center text-center space-y-4 relative overflow-hidden group scale-105">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500"></div>
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-4 border-amber-400 flex items-center justify-center text-amber-300 shadow-xl shadow-amber-500/20">
              <Crown className="w-10 h-10 text-amber-300 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/40 shadow-md">
                👑 1등 최우수 독서왕
              </span>
              <h3 className="text-2xl font-black text-white mt-2">
                {top1.grade} {top1.classNum} <span className="text-amber-300">{top1.studentName}</span>
              </h3>
              <p className="text-xs text-amber-200/80">선호 장르: {top1.favCategory}</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl w-full border border-amber-500/30">
              <div className="text-3xl font-black text-amber-400">{top1.count}<span className="text-xs font-normal text-slate-300 ml-1">권 기록 완료</span></div>
              <p className="text-xs text-slate-300 truncate mt-1">최근 완독: {top1.recentBook}</p>
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
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>독서 대상 상장 수여</span>
            </button>
          </div>
        ) : (
          <div className="order-1 md:order-2 p-8 bg-slate-900/40 border border-slate-800 rounded-3xl text-center text-slate-500 text-xs">
            1등 독서왕 집계 중...
          </div>
        )}

        {/* TOP 3 (Right) */}
        {top3 ? (
          <div className="order-3 p-6 bg-slate-900/90 border border-amber-700/30 rounded-3xl shadow-xl flex flex-col items-center text-center space-y-4 relative overflow-hidden group hover:border-amber-600/50 transition-all">
            <div className="absolute top-3 right-3 text-2xl font-black text-amber-700 opacity-20">#3</div>
            <div className="w-16 h-16 rounded-full bg-amber-950/40 border-2 border-amber-600 flex items-center justify-center text-amber-400 shadow-lg">
              <Medal className="w-8 h-8 text-amber-500" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 text-xs font-bold border border-amber-700/50">
                🥉 {top3.badgeTitle}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {top3.grade} {top3.classNum} {top3.studentName}
              </h3>
              <p className="text-xs text-slate-400">주 장르: {top3.favCategory}</p>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-2xl w-full border border-slate-800">
              <div className="text-2xl font-black text-amber-300">{top3.count}<span className="text-xs font-normal text-slate-400 ml-1">권 기록</span></div>
              <p className="text-[11px] text-slate-400 truncate mt-1">최근: {top3.recentBook}</p>
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
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>독서 상장 수여</span>
            </button>
          </div>
        ) : (
          <div className="order-3 p-6 bg-slate-900/40 border border-slate-800 rounded-3xl text-center text-slate-500 text-xs">
            3등 후보 집계 중...
          </div>
        )}

      </div>

      {/* Rest Ranking List */}
      {restRankings.length > 0 && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>열정 독서가 순위 목록 (4위 이하)</span>
          </h3>

          <div className="divide-y divide-slate-800/60">
            {restRankings.map((st) => (
              <div key={`${st.grade}_${st.classNum}_${st.studentName}`} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-slate-500">#{st.rank}</span>
                  <span className="font-semibold text-white">{st.grade} {st.classNum} {st.studentName}</span>
                  <span className="text-xs text-slate-400 hidden sm:inline">({st.favCategory})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-indigo-300">{st.count}권</span>
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
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                    title="상장 생성"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestone Badges System Explanation */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>우리반 독서 달성 배지 획득 기준</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
            <div className="text-lg">🌱</div>
            <div className="font-bold text-white">첫 걸음 배지</div>
            <p className="text-[11px] text-slate-400">1권 독서록 작성 완료</p>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
            <div className="text-lg">📚</div>
            <div className="font-bold text-white">독서 탐험가</div>
            <p className="text-[11px] text-slate-400">5권 이상 독서록 작성</p>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
            <div className="text-lg">🐛</div>
            <div className="font-bold text-white">책벌레 배지</div>
            <p className="text-[11px] text-slate-400">10권 이상 독서록 작성</p>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
            <div className="text-lg">👑</div>
            <div className="font-bold text-amber-300">마스터 리더</div>
            <p className="text-[11px] text-slate-400">20권 이상 독서록 달성</p>
          </div>
        </div>
      </div>

    </div>
  );
};
