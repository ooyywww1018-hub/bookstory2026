export interface ReadingRecord {
  id: string;
  createdAt: string;
  grade: string;        // 学年 (예: "3학년", "3")
  classNum: string;     // 班 (예: "2반", "2")
  studentName: string;  // 학생 이름
  bookTitle: string;    // 도서명
  author: string;       // 지은이
  publisher: string;    // 출판사
  category: BookCategory; // 장르 / 카테고리
  rating: number;       // 별점 (1~5)
  readDate: string;     // 읽은 날짜 (YYYY-MM-DD)
  summary: string;      // 줄거리
  reflection: string;   // 감상 및 소감
  syncStatus?: 'synced' | 'pending';
}

export type BookCategory = 
  | '문학/소설'
  | '인문/교양'
  | '과학/자연'
  | '역사/사회'
  | '예술/체육'
  | '만화/동화'
  | '기타';

export interface StudentProfile {
  grade: string;
  classNum: string;
  studentName: string;
}

export interface GASConfig {
  webAppUrl: string;
  lastSyncedAt?: string;
  isAutoSyncEnabled: boolean;
}

export interface TeacherStats {
  totalBooks: number;
  monthlyBooks: number;
  averageRating: number;
  uniqueStudentsCount: number;
  topCategories: { category: string; count: number; percentage: number }[];
  monthlyTrend: { month: string; count: number }[];
  topReaders: { studentName: string; grade: string; classNum: string; count: number }[];
}

export interface FilterOptions {
  searchQuery: string;
  grade: string;
  classNum: string;
  category: string;
  ratingFilter: number; // 0 for all
  sortBy: 'date-desc' | 'date-asc' | 'rating-desc' | 'name-asc';
  studentName: string;
}

export interface ReadingKingWinner {
  rank: 1 | 2 | 3;
  studentName: string;
  grade: string;
  classNum: string;
  bookCount: number;
  badgeTitle: string;
  favoriteCategory: string;
  recentBook: string;
}

export interface CertificateData {
  studentName: string;
  grade: string;
  classNum: string;
  rankTitle: string;
  bookCount: number;
  issueDate: string;
  schoolName: string;
  teacherName: string;
}
