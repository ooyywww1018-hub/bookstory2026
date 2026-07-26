import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, BookOpen, Star, Calendar, User, Sparkles, PlusCircle, RefreshCw } from 'lucide-react';
import { ReadingRecord, BookCategory, StudentProfile } from '../types';

interface ReadingFeedProps {
  records: ReadingRecord[];
  studentProfile: StudentProfile;
  onSelectRecord: (record: ReadingRecord) => void;
  onNavigateToForm: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

const CATEGORIES: ('전체' | BookCategory)[] = [
  '전체',
  '문학/소설',
  '인문/교양',
  '과학/자연',
  '역사/사회',
  '예술/체육',
  '만화/동화',
  '기타'
];

export const ReadingFeed: React.FC<ReadingFeedProps> = ({
  records,
  studentProfile,
  onSelectRecord,
  onNavigateToForm,
  onRefreshData,
  isRefreshing
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'전체' | BookCategory>('전체');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [onlyMyLogs, setOnlyMyLogs] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'rating'>('latest');

  // Filtering & Sorting logic
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        // My logs filter
        if (onlyMyLogs && studentProfile.studentName) {
          if (rec.studentName !== studentProfile.studentName) return false;
        }

        // Category filter
        if (selectedCategory !== '전체' && rec.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = rec.bookTitle.toLowerCase().includes(q);
          const matchAuthor = (rec.author || '').toLowerCase().includes(q);
          const matchStudent = rec.studentName.toLowerCase().includes(q);
          const matchSummary = (rec.summary || '').toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchStudent && !matchSummary) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.readDate || b.createdAt).getTime() - new Date(a.readDate || a.createdAt).getTime();
        } else if (sortBy === 'oldest') {
          return new Date(a.readDate || a.createdAt).getTime() - new Date(b.readDate || b.createdAt).getTime();
        } else if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      });
  }, [records, onlyMyLogs, studentProfile, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Feed Top Controls Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <span>우리반 독서록 피드</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              학급 친구들이 함께 읽은 다양한 생각과 느낌을 감상해 보세요. (총 <strong className="text-indigo-300 font-bold">{filteredRecords.length}</strong>건)
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Refresh Button */}
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="최신 독서록 새로고침"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">새로고침</span>
            </button>

            {/* Write New Log CTA */}
            <button
              onClick={onNavigateToForm}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>독서록 작성하기</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="pt-2 flex flex-col lg:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도서명, 지은이, 학생 이름으로 검색..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Only My Logs Toggle */}
            <button
              onClick={() => setOnlyMyLogs(!onlyMyLogs)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                onlyMyLogs
                  ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>내 독서록만 보기</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="rating">별점 높은순</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="카드 그리드 뷰"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="목록 리스트 뷰"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Main Grid or List View */}
      {filteredRecords.length > 0 ? (
        viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => onSelectRecord(record)}
                className="group p-5 bg-slate-900 border border-slate-800/90 rounded-3xl hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
                      {record.category || '기타'}
                    </span>

                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-200">{record.rating}</span>
                    </div>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {record.bookTitle}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {record.author || '지은이 미상'} {record.publisher ? `· ${record.publisher}` : ''}
                    </p>
                  </div>

                  {/* Reflection Snippet */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-slate-300 text-xs leading-relaxed line-clamp-3">
                    {record.reflection || record.summary || '작성된 소감이 없습니다.'}
                  </div>

                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                      {record.studentName ? record.studentName.substring(0, 1) : '학'}
                    </div>
                    <span className="font-medium text-slate-300">
                      {record.grade} {record.classNum} <strong className="text-slate-100">{record.studentName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{record.readDate}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* TABLE LIST VIEW */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">도서명</th>
                    <th className="p-4">장르</th>
                    <th className="p-4">작성자</th>
                    <th className="p-4">별점</th>
                    <th className="p-4">읽은 날짜</th>
                    <th className="p-4">줄거리 / 소감 요약</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      onClick={() => onSelectRecord(record)}
                      className="hover:bg-slate-850 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-bold text-white max-w-[180px] truncate">
                        {record.bookTitle}
                        <div className="text-[11px] text-slate-400 font-normal truncate">{record.author}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20">
                          {record.category}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-200 whitespace-nowrap">
                        {record.grade} {record.classNum} {record.studentName}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{record.rating}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap text-slate-400 text-xs">
                        {record.readDate}
                      </td>
                      <td className="p-4 text-slate-400 max-w-xs truncate">
                        {record.reflection || record.summary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* EMPTY STATE */
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">검색 조건에 맞는 독서록이 없습니다.</h3>
            <p className="text-xs text-slate-400 mt-1">
              {onlyMyLogs ? '아직 작성한 독서록이 없습니다. 첫 독서록을 등록해 보세요!' : '다른 도서명이나 검색어로 찾아보세요.'}
            </p>
          </div>
          <button
            onClick={onNavigateToForm}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>독서록 작성하러 가기</span>
          </button>
        </div>
      )}

    </div>
  );
};
