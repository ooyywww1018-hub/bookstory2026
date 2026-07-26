import React, { useState, useEffect, useMemo } from 'react';
import { BestsellerBook } from '../types';
import { 
  BookOpen, 
  Search, 
  RefreshCw, 
  Award, 
  Filter, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  PenTool, 
  BookMarked,
  ExternalLink,
  Flame
} from 'lucide-react';

interface BestsellerListProps {
  onSelectBookForReading: (book: { title: string; author: string; publisher: string; category: string }) => void;
}

const BESTSELLER_URL = 'https://script.google.com/macros/s/AKfycbwrrL-qXGoZ7ZkYgR4jOSADT3Dppw8DzgGyk3JZM2k3TnAQV8TG2PPE97v1_LI_lojb/exec';

export const BestsellerList: React.FC<BestsellerListProps> = ({ onSelectBookForReading }) => {
  const [books, setBooks] = useState<BestsellerBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [expandedRanks, setExpandedRanks] = useState<Record<number, boolean>>({});

  // Fetch Bestseller Data
  const fetchBestsellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BESTSELLER_URL);
      if (!response.ok) {
        throw new Error(`서버 응답 오류 (상태 코드: ${response.status})`);
      }
      const json = await response.json();
      
      if (json.status === 'success' && Array.isArray(json.data)) {
        setBooks(json.data);
      } else if (Array.isArray(json)) {
        setBooks(json);
      } else {
        throw new Error('예스24 베스트셀러 데이터를 불러오지 못했습니다.');
      }
    } catch (err: any) {
      console.error('Error fetching bestsellers:', err);
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestsellers();
  }, []);

  // Unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    books.forEach((b) => {
      if (b.category && b.category.trim()) {
        cats.add(b.category.trim());
      }
    });
    return ['전체', ...Array.from(cats).sort()];
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Category filter
      if (selectedCategory !== '전체' && book.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = book.title?.toLowerCase().includes(query);
        const matchesAuthor = book.author?.toLowerCase().includes(query);
        const matchesPublisher = book.publisher?.toLowerCase().includes(query);
        const matchesCategory = book.category?.toLowerCase().includes(query);
        const matchesDesc = book.description?.toLowerCase().includes(query);
        return matchesTitle || matchesAuthor || matchesPublisher || matchesCategory || matchesDesc;
      }
      return true;
    });
  }, [books, selectedCategory, searchQuery]);

  // Toggle Description expansion
  const toggleExpand = (rank: number) => {
    setExpandedRanks((prev) => ({
      ...prev,
      [rank]: !prev[rank]
    }));
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Top Banner - Bookstore Concept Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f8f3eb] via-[#f2e7d5] to-[#ebdcc7] border border-[#d8c3a5] p-6 sm:p-8 shadow-sm">
        {/* Subtle decorative background icons */}
        <div className="absolute -right-8 -bottom-8 opacity-10 text-[#593b1d] pointer-events-none">
          <BookMarked className="w-64 h-64" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-[#734e2b] border border-amber-300 text-xs font-bold shadow-xs">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>YES24 실시간 도서 차트</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3b2713] tracking-tight font-serif">
              예스24 베스트셀러 서가 📚
            </h2>
            <p className="text-[#6e5843] text-xs sm:text-sm max-w-2xl leading-relaxed">
              지금 독자들에게 가장 사랑받는 도서들을 살펴보고, 마음에 드는 책을 골라 나만의 독서록을 작성해보세요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/80 backdrop-blur-sm border border-[#d9ccbd] px-4 py-3 rounded-2xl text-center shadow-xs">
              <div className="text-[11px] text-[#8c7355] font-semibold">총 수집 도서</div>
              <div className="text-xl font-bold text-[#3b2713] font-serif">{books.length}권</div>
            </div>

            <button
              onClick={fetchBestsellers}
              disabled={loading}
              className="px-4 py-3 bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 border border-[#734e2b]"
            >
              <RefreshCw className={`w-4 h-4 text-amber-200 ${loading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="mt-6 pt-6 border-t border-[#d8c3a5]/70 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Category Tabs (Desktop & Tablet) */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-2 lg:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#593b1d] text-amber-50 shadow-sm border border-[#3b2713]'
                      : 'bg-white/80 hover:bg-white text-[#6e5843] border border-[#d9ccbd]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box & Dropdown */}
          <div className="flex items-center gap-2">
            {/* Category Dropdown (Mobile View Extra / Quick Selector) */}
            <div className="relative sm:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-[#d9ccbd] rounded-xl px-3 py-2 text-xs font-bold text-[#3b2713] pr-8 focus:outline-none focus:border-[#8c6239]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-[#8c7355] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-[#8c7355] absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="도서명, 저자, 출판사, 키워드 검색..."
                className="w-full bg-white border border-[#d9ccbd] rounded-xl pl-9 pr-3 py-2 text-xs text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] focus:ring-1 focus:ring-[#8c6239] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#aa9580] hover:text-[#3b2713]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        /* Loading Skeleton Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-6 bg-white border border-[#e6dcce] rounded-3xl shadow-sm animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-16 h-6 bg-[#f2e7d5] rounded-full"></div>
                <div className="w-20 h-5 bg-[#f2e7d5] rounded-md"></div>
              </div>
              <div className="h-6 bg-[#f2e7d5] rounded-md w-3/4"></div>
              <div className="h-4 bg-[#f2e7d5] rounded-md w-1/2"></div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-[#f2e7d5] rounded-md w-full"></div>
                <div className="h-3 bg-[#f2e7d5] rounded-md w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State Notice */
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl space-y-4">
          <p className="text-sm font-bold text-rose-800">{error}</p>
          <button
            onClick={fetchBestsellers}
            className="px-4 py-2 bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-rose-800 transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      ) : filteredBooks.length === 0 ? (
        /* Empty Search / Category Filter Result */
        <div className="p-12 text-center bg-white border border-[#e6dcce] rounded-3xl space-y-3">
          <BookOpen className="w-10 h-10 text-[#aa9580] mx-auto" />
          <h3 className="text-base font-bold text-[#3b2713] font-serif">검색 결과가 없습니다</h3>
          <p className="text-xs text-[#8c7355]">
            '{searchQuery || selectedCategory}' 조건에 맞는 도서를 찾지 못했습니다. 다른 키워드로 검색해보세요.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('전체');
            }}
            className="mt-2 text-xs font-bold text-[#8c6239] hover:underline"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        /* Bestseller Book Cards Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#8c7355] font-semibold px-1">
            <span>
              선택된 카테고리: <strong className="text-[#3b2713]">{selectedCategory}</strong> ({filteredBooks.length}권 출력)
            </span>
            {searchQuery && (
              <span>
                검색어: '<span className="text-[#8c6239] font-bold">{searchQuery}</span>'
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => {
              const isExpanded = Boolean(expandedRanks[book.rank]);
              const isTop3 = book.rank <= 3;

              return (
                <div
                  key={`${book.rank}-${book.title}`}
                  className={`group relative p-6 rounded-3xl bg-white border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${
                    isTop3
                      ? 'border-[#d8c3a5] shadow-md bg-gradient-to-b from-[#fdfbf7] to-white'
                      : 'border-[#e6dcce] shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Top Badge Row */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {/* Rank Badge */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs ${
                            book.rank === 1
                              ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                              : book.rank === 2
                              ? 'bg-slate-400 text-white'
                              : book.rank === 3
                              ? 'bg-amber-700 text-amber-100'
                              : 'bg-[#f4ebe1] text-[#734e2b] border border-[#d9ccbd]'
                          }`}
                        >
                          {book.rank === 1 && '🥇 1위'}
                          {book.rank === 2 && '🥈 2위'}
                          {book.rank === 3 && '🥉 3위'}
                          {book.rank > 3 && `${book.rank}위`}
                        </span>

                        {book.category && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f5ede1] text-[#734e2b] border border-[#e3d5c5]">
                            {book.category}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-[#aa9580] font-medium">YES24</span>
                    </div>

                    {/* Book Title */}
                    <h3 className="text-lg font-bold text-[#3b2713] font-serif leading-snug group-hover:text-[#8c6239] transition-colors">
                      {book.title}
                    </h3>

                    {/* Author & Publisher */}
                    <div className="mt-1.5 text-xs text-[#6e5843] flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      {book.author && <span className="font-semibold">{book.author}</span>}
                      {book.author && book.publisher && <span className="text-[#c7b299]">·</span>}
                      {book.publisher && <span className="text-[#8c7355]">{book.publisher}</span>}
                    </div>

                    {/* Description */}
                    {book.description && (
                      <div className="mt-3 pt-3 border-t border-[#f0e6da]">
                        <p
                          className={`text-xs text-[#593b1d] leading-relaxed ${
                            !isExpanded ? 'line-clamp-3' : ''
                          }`}
                        >
                          {book.description}
                        </p>
                        {book.description.length > 80 && (
                          <button
                            onClick={() => toggleExpand(book.rank)}
                            className="mt-1 text-[11px] font-bold text-[#8c6239] hover:underline flex items-center gap-1"
                          >
                            <span>{isExpanded ? '접기' : '더보기'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-5 pt-4 border-t border-[#f0e6da] flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        onSelectBookForReading({
                          title: book.title,
                          author: book.author || '',
                          publisher: book.publisher || '',
                          category: book.category || '문학/소설'
                        })
                      }
                      className="w-full py-2.5 px-4 bg-[#f5ede1] hover:bg-[#8c6239] text-[#593b1d] hover:text-white rounded-xl text-xs font-bold border border-[#d9ccbd] transition-all flex items-center justify-center gap-2 shadow-2xs group/btn"
                    >
                      <PenTool className="w-3.5 h-3.5 text-[#8c6239] group-hover/btn:text-white transition-colors" />
                      <span>이 책으로 독서록 쓰기</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
