import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ReadingFeed } from './components/ReadingFeed';
import { ReadingForm } from './components/ReadingForm';
import { ReadingKing } from './components/ReadingKing';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ReadingDetailModal } from './components/ReadingDetailModal';
import { GASGuideModal } from './components/GASGuideModal';
import { UserProfileModal } from './components/UserProfileModal';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { CertificateModal } from './components/CertificateModal';

import { ReadingRecord, GASConfig, StudentProfile, CertificateData } from './types';
import { 
  getLocalRecords, 
  saveLocalRecords, 
  getGASConfig, 
  saveGASConfig, 
  getStudentProfile, 
  saveStudentProfile, 
  saveReadingRecord, 
  fetchRecordsFromGAS, 
  deleteRecord 
} from './utils/storage';
import { SAMPLE_READING_RECORDS } from './data/sampleData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'feed' | 'king' | 'teacher'>('feed');
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [gasConfig, setGasConfig] = useState<GASConfig>({ webAppUrl: '', isAutoSyncEnabled: true });
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({ grade: '3학년', classNum: '2반', studentName: '' });

  // Modals & Active State
  const [selectedRecord, setSelectedRecord] = useState<ReadingRecord | null>(null);
  const [isGASModalOpen, setIsGASModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isTeacherAuthModalOpen, setIsTeacherAuthModalOpen] = useState<boolean>(false);
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Initial Load
  useEffect(() => {
    const loadedRecords = getLocalRecords();
    setRecords(loadedRecords);

    const loadedGAS = getGASConfig();
    setGasConfig(loadedGAS);

    const loadedProfile = getStudentProfile();
    setStudentProfile(loadedProfile);

    // If GAS URL is set, fetch latest silently on startup
    if (loadedGAS.webAppUrl && loadedGAS.webAppUrl.trim().length > 10) {
      fetchRecordsFromGAS(loadedGAS.webAppUrl).then(res => {
        if (res.success && res.records) {
          setRecords(res.records);
        }
      });
    }
  }, []);

  // Sync / Refresh Handler
  const handleRefreshData = useCallback(async () => {
    if (!gasConfig.webAppUrl || gasConfig.webAppUrl.trim().length < 10) {
      // Just reload local storage
      const loaded = getLocalRecords();
      setRecords(loaded);
      return;
    }

    setIsRefreshing(true);
    const result = await fetchRecordsFromGAS(gasConfig.webAppUrl);
    setIsRefreshing(false);

    if (result.success && result.records) {
      setRecords(result.records);
    } else if (result.error) {
      console.warn('Sync failed:', result.error);
    }
  }, [gasConfig.webAppUrl]);

  // Submit New Record Handler
  const handleSubmitRecord = async (newRec: Omit<ReadingRecord, 'id' | 'createdAt' | 'syncStatus'>) => {
    const res = await saveReadingRecord(newRec, gasConfig.webAppUrl);
    setRecords(getLocalRecords());
    return { synced: res.synced, message: res.message };
  };

  // Delete Record Handler
  const handleDeleteRecord = async (id: string) => {
    await deleteRecord(id, gasConfig.webAppUrl);
    setRecords(getLocalRecords());
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(null);
    }
  };

  // Save GAS Config
  const handleSaveGASConfig = (url: string) => {
    const updated = { ...gasConfig, webAppUrl: url.trim() };
    setGasConfig(updated);
    saveGASConfig(updated);

    if (url.trim().length > 10) {
      handleRefreshData();
    }
  };

  // Save Student Profile
  const handleSaveProfile = (profile: StudentProfile) => {
    setStudentProfile(profile);
    saveStudentProfile(profile);
  };

  // Reset Sample Data
  const handleResetSampleData = () => {
    if (window.confirm('기본 샘플 데이터로 초기화하시겠습니까? (작성한 독서록이 샘플 데이터로 교체됩니다)')) {
      saveLocalRecords(SAMPLE_READING_RECORDS);
      setRecords(SAMPLE_READING_RECORDS);
    }
  };

  const isGASConnected = Boolean(gasConfig.webAppUrl && gasConfig.webAppUrl.trim().length > 10);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#3b2713] flex flex-col font-sans selection:bg-[#8c6239] selection:text-white bg-wood-pattern">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentProfile={studentProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenGASModal={() => setIsGASModalOpen(true)}
        isGASConnected={isGASConnected}
        isTeacherMode={isTeacherMode}
        onOpenTeacherAuth={() => setIsTeacherAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'feed' && (
          <ReadingFeed
            records={records}
            studentProfile={studentProfile}
            onSelectRecord={(rec) => setSelectedRecord(rec)}
            onNavigateToForm={() => setActiveTab('form')}
            onRefreshData={handleRefreshData}
            isRefreshing={isRefreshing}
          />
        )}

        {activeTab === 'form' && (
          <ReadingForm
            studentProfile={studentProfile}
            onSubmitRecord={handleSubmitRecord}
            onNavigateToFeed={() => setActiveTab('feed')}
            isGASConnected={isGASConnected}
          />
        )}

        {activeTab === 'king' && (
          <ReadingKing
            records={records}
            onOpenCertificate={(data) => setCertificateData(data)}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboard
            records={records}
            onSelectRecord={(rec) => setSelectedRecord(rec)}
            onDeleteRecord={handleDeleteRecord}
            onResetSampleData={handleResetSampleData}
            onRefreshData={handleRefreshData}
            isRefreshing={isRefreshing}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#f4ebe1] border-t border-[#e6dcce] py-6 text-center text-xs text-[#7a6043]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong className="text-[#4a3319] font-bold">우리반 마음서점 · 전자 독서기록장</strong> · 책 내음 가득한 학급 독서 카페
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGASModalOpen(true)}
              className="hover:text-[#3b2713] transition-colors"
            >
              구글 시트 연동 방법
            </button>
            <button
              onClick={() => {
                if (isTeacherMode) {
                  setIsTeacherMode(false);
                  setActiveTab('feed');
                } else {
                  setIsTeacherAuthModalOpen(true);
                }
              }}
              className="hover:text-[#3b2713] transition-colors"
            >
              {isTeacherMode ? '교사 모드 종료' : '교사 로그인'}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReadingDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onDeleteRecord={handleDeleteRecord}
        isTeacherMode={isTeacherMode}
      />

      <GASGuideModal
        isOpen={isGASModalOpen}
        onClose={() => setIsGASModalOpen(false)}
        currentUrl={gasConfig.webAppUrl}
        onSaveUrl={handleSaveGASConfig}
        onTestConnection={async (url) => {
          const res = await fetchRecordsFromGAS(url);
          return res.success;
        }}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={studentProfile}
        onSaveProfile={handleSaveProfile}
      />

      <TeacherAuthModal
        isOpen={isTeacherAuthModalOpen}
        onClose={() => setIsTeacherAuthModalOpen(false)}
        onSuccess={() => {
          setIsTeacherMode(true);
          setActiveTab('teacher');
        }}
      />

      <CertificateModal
        data={certificateData}
        onClose={() => setCertificateData(null)}
      />

    </div>
  );
}
