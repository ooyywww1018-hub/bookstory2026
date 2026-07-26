import { ReadingRecord, GASConfig, StudentProfile, TeacherStats, BookCategory } from '../types';
import { SAMPLE_READING_RECORDS } from '../data/sampleData';

const LOCAL_STORAGE_KEY_RECORDS = 'reading_log_records_v1';
const LOCAL_STORAGE_KEY_GAS = 'reading_log_gas_config_v1';
const LOCAL_STORAGE_KEY_PROFILE = 'reading_log_student_profile_v1';
const LOCAL_STORAGE_KEY_TEACHER_PASS = 'reading_log_teacher_pass_v1';

// Default GAS Configuration
export const getGASConfig = (): GASConfig => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_GAS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse GAS Config from localStorage', e);
  }
  return {
    webAppUrl: '',
    isAutoSyncEnabled: true
  };
};

export const saveGASConfig = (config: GASConfig): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY_GAS, JSON.stringify(config));
};

// Teacher Password Management (Default: 1234)
export const getTeacherPassword = (): string => {
  return localStorage.getItem(LOCAL_STORAGE_KEY_TEACHER_PASS) || '1234';
};

export const saveTeacherPassword = (newPass: string): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY_TEACHER_PASS, newPass);
};

// Student Saved Profile
export const getStudentProfile = (): StudentProfile => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return {
    grade: '3학년',
    classNum: '2반',
    studentName: ''
  };
};

export const saveStudentProfile = (profile: StudentProfile): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
};

// Local Records Management
export const getLocalRecords = (): ReadingRecord[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_RECORDS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading records from localStorage', e);
  }
  // If empty, initialize with sample data
  localStorage.setItem(LOCAL_STORAGE_KEY_RECORDS, JSON.stringify(SAMPLE_READING_RECORDS));
  return SAMPLE_READING_RECORDS;
};

export const saveLocalRecords = (records: ReadingRecord[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY_RECORDS, JSON.stringify(records));
};

// Save new record
export const saveReadingRecord = async (
  newRecord: Omit<ReadingRecord, 'id' | 'createdAt' | 'syncStatus'>,
  gasUrl: string
): Promise<{ record: ReadingRecord; synced: boolean; message: string }> => {
  const fullRecord: ReadingRecord = {
    ...newRecord,
    id: `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    syncStatus: 'pending'
  };

  const records = getLocalRecords();
  let synced = false;
  let message = '로컬에 임시 저장되었습니다.';

  if (gasUrl && gasUrl.trim().length > 10) {
    try {
      // Send to Google Apps Script via POST (no-cors or standard JSON if supported)
      const response = await fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // GAS prefers plain text or standard body to bypass CORS preflight
        },
        body: JSON.stringify(fullRecord)
      });

      if (response.ok) {
        const resData = await response.json().catch(() => null);
        if (!resData || resData.status === 'success') {
          fullRecord.syncStatus = 'synced';
          synced = true;
          message = '구글 시트와 연동되어 등록되었습니다.';
        }
      } else {
        // If no-cors mode is needed
        fullRecord.syncStatus = 'synced'; // Assumed dispatched
        synced = true;
        message = '구글 앱스 스크립트로 전송되었습니다.';
      }
    } catch (e) {
      console.warn('GAS submission failed, saving locally for later sync:', e);
      fullRecord.syncStatus = 'pending';
      message = '네트워크 문제로 로컬에 우선 저장되었습니다. 나중에 구글 시트와 동기화됩니다.';
    }
  }

  // Prepend to list
  const updatedRecords = [fullRecord, ...records];
  saveLocalRecords(updatedRecords);

  return { record: fullRecord, synced, message };
};

// Fetch latest from GAS
export const fetchRecordsFromGAS = async (gasUrl: string): Promise<{ success: boolean; records?: ReadingRecord[]; error?: string }> => {
  if (!gasUrl || gasUrl.trim().length < 10) {
    return { success: false, error: '구글 앱스 스크립트 URL이 설정되지 않았습니다.' };
  }

  try {
    const response = await fetch(gasUrl, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const json = await response.json();
    if (json.status === 'success' && Array.isArray(json.data)) {
      const formatted: ReadingRecord[] = json.data.map((item: any, idx: number) => ({
        id: item.id || `GAS-${idx}-${Date.now()}`,
        createdAt: item.createdAt || new Date().toISOString(),
        grade: String(item.grade || '3학년'),
        classNum: String(item.classNum || '2반'),
        studentName: String(item.studentName || '학생'),
        bookTitle: String(item.bookTitle || '무제'),
        author: String(item.author || '-'),
        publisher: String(item.publisher || '-'),
        category: (item.category as BookCategory) || '기타',
        rating: Number(item.rating) || 5,
        readDate: String(item.readDate || new Date().toISOString().substring(0, 10)),
        summary: String(item.summary || ''),
        reflection: String(item.reflection || ''),
        syncStatus: 'synced'
      }));

      saveLocalRecords(formatted);
      return { success: true, records: formatted };
    } else {
      return { success: false, error: json.message || '데이터 구조 응답 오류' };
    }
  } catch (e: any) {
    console.error('Failed to fetch from GAS:', e);
    return { success: false, error: e.message || '구글 시트 연동 데이터 불러오기 실패' };
  }
};

// Delete record locally and sync deletion to GAS if configured
export const deleteRecord = async (id: string, gasUrl: string): Promise<boolean> => {
  const records = getLocalRecords();
  const filtered = records.filter(r => r.id !== id);
  saveLocalRecords(filtered);

  if (gasUrl && gasUrl.trim().length > 10) {
    try {
      await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'delete', id })
      });
    } catch (e) {
      console.warn('Failed to dispatch delete to GAS:', e);
    }
  }

  return true;
};

// Export to CSV with UTF-8 BOM for Microsoft Excel compatibility
export const exportToCSV = (records: ReadingRecord[], filenamePrefix: string = '우리반_독서기록'): void => {
  if (records.length === 0) {
    alert('다운로드할 독서 기록 데이터가 없습니다.');
    return;
  }

  const headers = [
    '등록ID',
    '등록일시',
    '학년',
    '반',
    '학생 이름',
    '도서명',
    '지은이',
    '출판사',
    '장르/카테고리',
    '별점(5점만점)',
    '독서 날짜',
    '줄거리',
    '독후감 및 소감'
  ];

  const rows = records.map(r => [
    r.id,
    r.createdAt ? new Date(r.createdAt).toLocaleString('ko-KR') : '',
    r.grade,
    r.classNum,
    r.studentName,
    `"${(r.bookTitle || '').replace(/"/g, '""')}"`,
    `"${(r.author || '').replace(/"/g, '""')}"`,
    `"${(r.publisher || '').replace(/"/g, '""')}"`,
    r.category,
    r.rating,
    r.readDate,
    `"${(r.summary || '').replace(/"/g, '""')}"`,
    `"${(r.reflection || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  // Add UTF-8 BOM (\uFEFF)
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const today = new Date().toISOString().substring(0, 10);
  link.href = url;
  link.setAttribute('download', `${filenamePrefix}_${today}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Calculate Statistics for Teacher Dashboard
export const calculateTeacherStats = (records: ReadingRecord[]): TeacherStats => {
  const totalBooks = records.length;

  const currentMonthStr = new Date().toISOString().substring(0, 7); // e.g. "2026-07"
  const monthlyBooks = records.filter(r => r.readDate && r.readDate.startsWith(currentMonthStr)).length;

  const totalRating = records.reduce((acc, curr) => acc + (curr.rating || 5), 0);
  const averageRating = totalBooks > 0 ? Number((totalRating / totalBooks).toFixed(1)) : 0;

  const uniqueStudents = new Set(records.map(r => `${r.grade}-${r.classNum}-${r.studentName}`));
  const uniqueStudentsCount = uniqueStudents.size;

  // Category Distribution
  const categoryCounts: Record<string, number> = {};
  records.forEach(r => {
    const cat = r.category || '기타';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category,
      count,
      percentage: totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Student ranking
  const studentMap: Record<string, { studentName: string; grade: string; classNum: string; count: number }> = {};
  records.forEach(r => {
    const key = `${r.grade}_${r.classNum}_${r.studentName}`;
    if (!studentMap[key]) {
      studentMap[key] = {
        studentName: r.studentName,
        grade: r.grade,
        classNum: r.classNum,
        count: 0
      };
    }
    studentMap[key].count += 1;
  });

  const topReaders = Object.values(studentMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Monthly Trend (Last 6 Months)
  const monthlyTrendMap: Record<string, number> = {};
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyTrendMap[mStr] = 0;
  }

  records.forEach(r => {
    if (r.readDate && r.readDate.length >= 7) {
      const mKey = r.readDate.substring(0, 7);
      if (monthlyTrendMap[mKey] !== undefined) {
        monthlyTrendMap[mKey] += 1;
      }
    }
  });

  const monthlyTrend = Object.entries(monthlyTrendMap).map(([month, count]) => ({
    month: `${parseInt(month.substring(5, 7))}월`,
    count
  }));

  return {
    totalBooks,
    monthlyBooks,
    averageRating,
    uniqueStudentsCount,
    topCategories,
    monthlyTrend,
    topReaders
  };
};
