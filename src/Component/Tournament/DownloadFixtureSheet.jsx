import React, { useState } from 'react';
import { checkRoles } from '../../utils/roleCheck';
import { ADMIN_ROLES } from '../../Constant/Roles';
import axiosInstance from '../../Services/axios';

const DownloadFixtureSheet = ({ isHybrid = false, tournamentId, categoryId, fixture }) => {
  const name = isHybrid ? 'Download Event Details' : 'Download Event Details';
  const stageId = fixture?.bracketData?.stage?.[0]?.id;
  const fixtureId = fixture?._id;
  const platform = useSelector((state) => state.websToNative.platform);
  const [downloadError, setDownloadError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSingleSheetDownload = async () => {
    if (tournamentId && categoryId && fixtureId && stageId !== undefined && stageId !== null) {
      setDownloadError('');
      setDownloading(true);
      try {
        const baseURL = import.meta.env.VITE_BASE_URL;
        const ENDPOINT = checkRoles(ADMIN_ROLES)
          ? `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stage/${stageId}/export-fixture`
          : `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/${fixtureId}/stage/${stageId}/export-fixture`;

        const url = `${baseURL}${ENDPOINT}`;
        const response = await axiosInstance.get(url, {
          responseType: 'blob',
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        });

        await triggerExcelDownload(response);
      } catch (err) {
        console.error('❌ Excel Download Error:', err);
        setDownloadError(err.response?.data?.message || err.message || 'Download failed');
      } finally {
        setDownloading(false);
        setShowModal(false);
      }
    } else {
      console.log('❌ Missing required IDs for Excel download');
    }
  };

  const handleAllRoundsDownload = async () => {
    if (tournamentId && categoryId && stageId !== undefined && stageId !== null) {
      setDownloadError('');
      setDownloading(true);
      try {
        const baseURL = import.meta.env.VITE_BASE_URL;
        const ENDPOINT = checkRoles(ADMIN_ROLES)
          ? `/users/admin/tournaments/${tournamentId}/categories/${categoryId}/fixtures/stage/${stageId}/export-fixtures`
          : `/users/tournament-owner/tournaments/${tournamentId}/categories/${categoryId}/fixtures/stage/${stageId}/export-fixtures`;

        const url = `${baseURL}${ENDPOINT}`;
        const response = await axiosInstance.get(url, {
          responseType: 'blob',
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        });

        await triggerExcelDownload(response);
      } catch (err) {
        console.error('❌ Excel Download Error (All Rounds):', err);
        setDownloadError(err.response?.data?.message || err.message || 'Download failed');
      } finally {
        setDownloading(false);
        setShowModal(false);
      }
    } else {
      console.log('❌ Missing IDs for All Rounds Excel download');
    }
  };

  const triggerExcelDownload = async (response) => {
    const contentType = response.headers['content-type'];
    if (
      contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
      contentType.includes('application/vnd.ms-excel')
    ) {
      const blob = new Blob([response.data], { type: contentType });
      let filename = 'fixture_sheet.xlsx';
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/"/g, '').trim();
      }
  
      const androidPlatform =
        typeof window !== 'undefined' &&
        /android/i.test(navigator.userAgent) &&
        typeof window.WTN !== 'undefined' &&
        typeof window.WTN.downloadFile === 'function';
  
      if (platform==="android") {
        try {
          const blobUrl = window.URL.createObjectURL(blob);
          await window.WTN.downloadFile(blobUrl, filename);
          return;
        } catch (err) {
          console.warn('WebToNative download failed, falling back to browser download:', err);
        }
      }
  
      // Default browser fallback
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      throw new Error('File is not an Excel sheet');
    }
  };
  

  return (
    <div>
      {isHybrid ? (
        <div>
          <button
            className="bg-[#1570EF] text-white rounded-lg px-3 py-2"
            onClick={() => setShowModal(true)}
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download Event Details'}
          </button>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                <h2 className="text-lg font-semibold mb-4">Select Round</h2>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAllRoundsDownload}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={downloading}
                  >
                    {downloading ? 'Downloading...' : 'All Rounds'}
                  </button>
                  <button
                    onClick={handleSingleSheetDownload}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={downloading}
                  >
                    {downloading ? 'Downloading...' : 'Current Round'}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-sm text-gray-500 mt-2 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            className="bg-[#1570EF] text-white rounded-lg px-3 py-2"
            onClick={handleSingleSheetDownload}
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download Event Details'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadFixtureSheet;
