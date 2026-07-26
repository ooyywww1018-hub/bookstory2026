import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Download, Trash2, Search, Filter, BookOpen, Star, 
  Users, Calendar, FileSpreadsheet, RefreshCw, Eye, Sparkles, CheckCircle2, Shield, BookMarked, AlertCircle
} from 'lucide-react';
import { ReadingRecord, TeacherStats } from '../types';
import { calculateTeacherStats, exportToCSV } from '../utils/storage';

interface TeacherDashboardProps {
  records: ReadingRecord[];
  onSelectRecord: (record: ReadingRecord) => void;
  onDeleteRecord: (id: string) => void;
  onResetSampleData: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onResetSampleData,
  onRefreshData,
  isRefreshing
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('전체');
  const [selectedClass, setSelectedClass] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');
  const [recordToDelete, setRecordToDelete] = useState<ReadingRecord | null>(null);

  // Filtered records according to teacher filter choices
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedGrade !== '전체' && r.grade !== selectedGrade) return false;
      if (selectedClass !== '전체' && r.classNum !== selectedClass) return false;
      if (categoryFilter !== '전체' && r.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mTitle = r.bookTitle.toLowerCase().includes(q);
        const mStudent = r.studentName.toLowerCase().includes(q);
        const mAuthor = (r.author || '').toLowerCase().includes(q);
        if (!mTitle && !mStudent && !mAuthor) return false;
      }
      return true;
    });
  }, [records, selectedGrade, selectedClass, categoryFilter, searchQuery]);

  // Compute stats on filtered list
  const stats: TeacherStats = useMemo(() => {
    return calculateTeacherStats(filteredRecords);
  }, [filteredRecords]);

  // Export CSV handler
  const handleExportCSV = () => {
    const filename = `우리반_독서기록_${selectedGrade !== '전체' ? selectedGrade : '전체'}_${selectedClass !== '전체' ? selectedClass : '전체'}`;
    exportToCSV(filteredRecords, filename);
  };

  const maxTrendCount = Math.max(...stats.monthlyTrend.map(t => t.count), 1);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Dashboard Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#f8f3eb] via-[#f2e7d5] to-[#ebdcc7] border border-[#d8c3a5] shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 text-[#593b1d] pointer-events-none">
          <BookMarked className="w-80 h-80" />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5ede1] text-[#734e2b] border border-[#d9ccbd] text-xs font-bold shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>교사 전용 대시보드</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3b2713] tracking-tight font-serif">
              학급 독서 현황 종합 분석 대시보드
            </h2>
            <p className="text-[#6e5843] text-xs sm:text-sm">
              학생들의 독서 통계를 확인하고 원본 데이터를 엑셀(CSV)로 편리하게 다운로드하세요.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 bg-white hover:bg-[#f5ede1] text-[#593b1d] rounded-xl text-xs font-bold border border-[#d9ccbd] transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RefreshCw className={`w-4 h-4 text-[#8c6239] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-[#8c6239] hover:bg-[#734e2b] text-amber-50 rounded-xl text-xs font-bold shadow-xs border border-[#734e2b] transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-200" />
              <span>엑셀/CSV 다운로드</span>
            </button>
          </div>
        </div>

        {/* Grade / Class Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-[#d8c3a5]/60 flex flex-wrap items-center gap-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#593b1d]">학년 필터:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-white border border-[#d9ccbd] text-[#3b2713] text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#8c6239] shadow-2xs"
            >
              <option value="전체">전체 학년</option>
              {['1학년', '2학년', '3학년', '4학년', '5학년', '6학년', '중1', '중2', '중3', '고1', '고2', '고3'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#593b1d]">반 필터:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-[#d9ccbd] text-[#3b2713] text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#8c6239] shadow-2xs"
            >
              <option value="전체">전체 반</option>
              {Array.from({ length: 15 }, (_, i) => `${i + 1}반`).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={onResetSampleData}
            className="ml-auto text-xs text-[#8c7355] hover:text-rose-600 underline font-semibold"
          >
            기본 샘플 데이터로 리셋
          </button>
        </div>
      </div>

      {/* KPI Stats Cards (4 Column Grid) - Clean White Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white border border-[#e6dcce] rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-[#8c7355] font-bold">총 누적 독서 권수</div>
            <div className="text-2xl font-black text-[#3b2713] mt-1 font-serif">
              {stats.totalBooks}<span className="text-xs font-normal text-[#8c7355] ml-1">권</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#f5ede1] border border-[#d9ccbd] text-[#734e2b] flex items-center justify-center shadow-2xs">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white border border-[#e6dcce] rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-[#8c7355] font-bold">이번 달 독서 권수</div>
            <div className="text-2xl font-black text-[#8c6239] mt-1 font-serif">
              {stats.monthlyBooks}<span className="text-xs font-normal text-[#8c7355] ml-1">권</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#f5ede1] border border-[#d9ccbd] text-[#8c6239] flex items-center justify-center shadow-2xs">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white border border-[#e6dcce] rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-[#8c7355] font-bold">독서 참여 학생 수</div>
            <div className="text-2xl font-black text-[#734e2b] mt-1 font-serif">
              {stats.uniqueStudentsCount}<span className="text-xs font-normal text-[#8c7355] ml-1">명</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#f5ede1] border border-[#d9ccbd] text-[#734e2b] flex items-center justify-center shadow-2xs">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white border border-[#e6dcce] rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-[#8c7355] font-bold">평균 도서 만족도</div>
            <div className="text-2xl font-black text-[#3b2713] mt-1 flex items-center gap-1 font-serif">
              <span>{stats.averageRating}</span>
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#f5ede1] border border-[#d9ccbd] text-[#734e2b] flex items-center justify-center shadow-2xs">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Visual Analytics Section (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Distribution Chart */}
        <div className="p-6 bg-white border border-[#e6dcce] rounded-3xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#3b2713] flex items-center gap-2 font-serif">
            <BookOpen className="w-5 h-5 text-[#8c6239]" />
            <span>장르/카테고리별 독서 비중</span>
          </h3>

          {stats.topCategories.length > 0 ? (
            <div className="space-y-3 pt-2">
              {stats.topCategories.map((item, idx) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between text-xs text-[#593b1d]">
                    <span className="font-bold">{item.category}</span>
                    <span className="font-semibold">{item.count}권 ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-[#fbf8f3] h-3 rounded-full overflow-hidden border border-[#e3d5c5]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0 ? 'bg-[#8c6239]' :
                        idx === 1 ? 'bg-[#a37952]' :
                        idx === 2 ? 'bg-[#b8936d]' :
                        idx === 3 ? 'bg-[#cfae8b]' : 'bg-[#d9ccbd]'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#aa9580] py-8 text-center">데이터가 없습니다.</div>
          )}
        </div>

        {/* Monthly Trend SVG Bar Chart */}
        <div className="p-6 bg-white border border-[#e6dcce] rounded-3xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#3b2713] flex items-center gap-2 font-serif">
            <Calendar className="w-5 h-5 text-[#8c6239]" />
            <span>최근 6개월 독서 추이</span>
          </h3>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {stats.monthlyTrend.map((m) => {
              const heightPercent = maxTrendCount > 0 ? Math.round((m.count / maxTrendCount) * 100) : 10;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-[#593b1d] opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.count}권
                  </span>
                  <div className="w-full bg-[#fbf8f3] rounded-t-xl h-full flex items-end p-1 border border-[#e3d5c5]">
                    <div
                      className="w-full bg-gradient-to-t from-[#8c6239] to-[#b8936d] rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${Math.max(heightPercent, 8)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-[#8c7355]">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Raw Records Management Data Table */}
      <div className="p-6 bg-white border border-[#e6dcce] rounded-3xl shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#3b2713] flex items-center gap-2 font-serif">
              <FileSpreadsheet className="w-5 h-5 text-[#8c6239]" />
              <span>학생 독서록 상세 데이터 관리 (총 {filteredRecords.length}건)</span>
            </h3>
            <p className="text-xs text-[#8c7355] mt-0.5">
              학생이 제출한 전체 독서록의 상세 내용을 확인하거나 관리할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="도서명, 이름 검색..."
                className="w-full bg-white border border-[#d9ccbd] rounded-xl pl-9 pr-3 py-2 text-xs text-[#3b2713] placeholder-[#aa9580] focus:outline-none focus:border-[#8c6239] shadow-2xs"
              />
              <Search className="w-3.5 h-3.5 text-[#8c7355] absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar border border-[#e6dcce] rounded-2xl">
          <table className="w-full text-left text-xs text-[#3b2713]">
            <thead className="bg-[#f8f3eb] text-[#593b1d] font-bold border-b border-[#e6dcce] font-serif">
              <tr>
                <th className="p-3">작성자</th>
                <th className="p-3">도서명</th>
                <th className="p-3">저자/출판사</th>
                <th className="p-3">장르</th>
                <th className="p-3">별점</th>
                <th className="p-3">읽은 날짜</th>
                <th className="p-3">줄거리/소감 요약</th>
                <th className="p-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e6da]">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-[#fcf8f2] transition-colors">
                    <td className="p-3 font-semibold text-[#3b2713] whitespace-nowrap">
                      {r.grade} {r.classNum} <strong className="text-[#8c6239]">{r.studentName}</strong>
                    </td>
                    <td className="p-3 font-bold text-[#3b2713] max-w-[150px] truncate font-serif">
                      📖 {r.bookTitle}
                    </td>
                    <td className="p-3 text-[#8c7355] max-w-[120px] truncate">
                      {r.author || '-'}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#f5ede1] text-[#734e2b] border border-[#d9ccbd] text-[11px] font-semibold">
                        {r.category}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{r.rating}</span>
                      </div>
                    </td>
                    <td className="p-3 text-[#8c7355] whitespace-nowrap">
                      {r.readDate}
                    </td>
                    <td className="p-3 text-[#593b1d] max-w-xs truncate">
                      {r.reflection || r.summary}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectRecord(r)}
                          className="p-1.5 bg-[#f5ede1] hover:bg-[#eadecc] text-[#734e2b] rounded-lg transition-colors border border-[#d9ccbd]"
                          title="상세보기"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRecordToDelete(r)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors border border-rose-200"
                          title="삭제하기"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#aa9580]">
                    조건에 해당하는 독서록 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Delete Confirmation Modal for Teacher */}
      {recordToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in print:hidden">
          <div className="bg-white border border-[#e6dcce] rounded-3xl shadow-2xl p-6 max-w-sm w-full space-y-4 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#3b2713] font-serif">독서록 삭제 확인</h4>
                <p className="text-xs text-[#8c7355] mt-0.5">선택한 독서 기록을 삭제하시겠습니까?</p>
              </div>
            </div>

            <div className="p-3.5 bg-[#fbf8f3] rounded-2xl border border-[#e3d5c5] text-xs space-y-1">
              <div className="font-bold text-[#3b2713] font-serif">📖 {recordToDelete.bookTitle}</div>
              <div className="text-[11px] text-[#734e2b]">
                {recordToDelete.grade} {recordToDelete.classNum} <strong className="text-[#3b2713]">{recordToDelete.studentName}</strong> 학생
              </div>
            </div>

            <p className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200/80 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>삭제된 독서 기록은 구글 시트 및 로컬 저장소에서 모두 제거됩니다.</span>
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#f5ede1] text-[#593b1d] border border-[#d9ccbd] transition-colors shadow-2xs"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteRecord(recordToDelete.id);
                  setRecordToDelete(null);
                }}
                className="px-4.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-rose-700 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>정말 삭제하기</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
