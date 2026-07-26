import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, BookOpen, BookMarked, Star, Calendar, User, Sparkles, PlusCircle, RefreshCw, Bookmark } from 'lucide-react';
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
      <div className="p-6 bg-white border border-[#e6dcce] rounded-3xl shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#3b2713] flex items-center gap-2 font-serif">
              <BookMarked className="w-6 h-6 text-[#8c6239]" />
              <span>우리반 독서록 서가</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#734e2b] mt-1 font-medium">
              학급 친구들이 정성껏 남긴 독서 기록과 생각을 감상해 보세요. (총 <strong className="text-[#3b2713] font-bold">{filteredRecords.length}</strong>건 등록됨)
            </p>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Refresh Button */}
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="p-2.5 bg-white hover:bg-[#f5ede1] text-[#593b1d] rounded-xl border border-[#d9ccbd] transition-colors flex items-center gap-1.5 text-xs font-bold shadow-2xs"
              title="최신 독서록 새로고침"
            >
              <RefreshCw className={`w-4 h-4 text-[#8c6239] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">새로고침</span>
            </button>

            {/* Write New Log CTA */}
            <button
              onClick={onNavigateToForm}
              className="px-4 py-2.5 bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 rounded-xl font-bold text-xs sm:text-sm shadow-sm border border-[#734e2b] transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-amber-200" />
              <span>독서록 작성하기</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="pt-2 flex flex-col lg:flex-row gap-3">
          
          {/* Search Box - Pure White Background */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도서명, 지은이, 학생 이름으로 검색..."
              className="w-full bg-white border border-[#d9ccbd] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] focus:ring-1 focus:ring-[#8c6239] shadow-xs"
            />
            <Search className="w-4 h-4 text-[#8c7355] absolute left-3.5 top-3" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Only My Logs Toggle */}
            <button
              onClick={() => setOnlyMyLogs(!onlyMyLogs)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                onlyMyLogs
                  ? 'bg-[#593b1d] text-amber-50 border-[#3b2713] shadow-xs'
                  : 'bg-white text-[#6e5843] border-[#d9ccbd] hover:bg-[#f5ede1]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>내 독서록만 보기</span>
            </button>

            {/* Sort Dropdown - Pure White Background */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-[#d9ccbd] text-[#3b2713] text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#8c6239] shadow-xs"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="rating">별점 높은순</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-[#f5ede1] p-1 rounded-xl border border-[#d9ccbd]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#593b1d] text-amber-50' : 'text-[#8c7355] hover:text-[#3b2713]'
                }`}
                title="카드 그리드 뷰"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-[#593b1d] text-amber-50' : 'text-[#8c7355] hover:text-[#3b2713]'
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                selectedCategory === cat
                  ? 'bg-[#593b1d] text-amber-50 border-[#3b2713] shadow-2xs'
                  : 'bg-white text-[#6e5843] border-[#d9ccbd] hover:bg-[#f5ede1]'
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
          /* GRID VIEW - White Cards with Warm Brown Accents */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => onSelectRecord(record)}
                className="group p-5 bg-white border border-[#e6dcce] rounded-3xl hover:border-[#8c6239] hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f5ede1] text-[#734e2b] text-xs font-bold border border-[#d9ccbd]">
                      {record.category || '기타'}
                    </span>

                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span className="text-xs font-bold text-[#3b2713]">{record.rating}점</span>
                    </div>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 className="font-bold text-base text-[#3b2713] font-serif group-hover:text-[#8c6239] transition-colors line-clamp-1">
                      📖 {record.bookTitle}
                    </h3>
                    <p className="text-xs text-[#734e2b] line-clamp-1 mt-0.5 font-medium">
                      {record.author || '지은이 미상'} {record.publisher ? `· ${record.publisher}` : ''}
                    </p>
                  </div>

                  {/* Reflection Snippet - Clean White/Neutral Panel */}
                  <div className="p-3.5 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] text-[#3b2713] text-xs leading-relaxed line-clamp-3">
                    {record.reflection || record.summary || '작성된 소감이 없습니다.'}
                  </div>

                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-[#f0e6da] flex items-center justify-between text-xs text-[#734e2b]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-[#8c6239] text-amber-50 flex items-center justify-center font-bold text-[10px]">
                      {record.studentName ? record.studentName.substring(0, 1) : '학'}
                    </div>
                    <span className="font-semibold text-[#3b2713]">
                      {record.grade} {record.classNum} <strong className="text-[#8c6239]">{record.studentName}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#8c7355]">
                    <Calendar className="w-3 h-3 text-[#8c6239]" />
                    <span>{record.readDate}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* TABLE LIST VIEW - Pure White Table */
          <div className="bg-white border border-[#e6dcce] rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm text-[#3b2713]">
                <thead className="bg-[#f8f3eb] text-[#593b1d] font-bold border-b border-[#e6dcce] font-serif">
                  <tr>
                    <th className="p-4">도서명</th>
                    <th className="p-4">장르</th>
                    <th className="p-4">작성자</th>
                    <th className="p-4">별점</th>
                    <th className="p-4">읽은 날짜</th>
                    <th className="p-4">줄거리 / 소감 요약</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e6da]">
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      onClick={() => onSelectRecord(record)}
                      className="hover:bg-[#fcf8f2] cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-bold text-[#3b2713] max-w-[180px] truncate font-serif">
                        📖 {record.bookTitle}
                        <div className="text-[11px] text-[#8c7355] font-normal truncate">{record.author}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-[#f5ede1] text-[#734e2b] text-xs border border-[#d9ccbd] font-semibold">
                          {record.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-[#3b2713] whitespace-nowrap">
                        {record.grade} {record.classNum} {record.studentName}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{record.rating}점</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap text-[#8c7355] text-xs">
                        {record.readDate}
                      </td>
                      <td className="p-4 text-[#593b1d] max-w-xs truncate">
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
        /* EMPTY STATE - White Card */
        <div className="p-12 text-center bg-white border border-[#e6dcce] rounded-3xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#f5ede1] border border-[#d9ccbd] text-[#8c6239] flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3b2713] font-serif">검색 조건에 맞는 독서록이 없습니다</h3>
            <p className="text-xs text-[#8c7355] mt-1">
              {onlyMyLogs ? '아직 작성한 독서록이 없습니다. 첫 독서록을 등록해 보세요!' : '다른 도서명이나 검색어로 찾아보세요.'}
            </p>
          </div>
          <button
            onClick={onNavigateToForm}
            className="px-5 py-2.5 bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5 border border-[#734e2b]"
          >
            <PlusCircle className="w-4 h-4 text-amber-200" />
            <span>독서록 작성하러 가기</span>
          </button>
        </div>
      )}

    </div>
  );
};
