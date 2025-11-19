document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = window.location.origin + '/api';
  const ongoingListEl = document.getElementById('ongoing-list');
  const completedListEl = document.getElementById('completed-list');
  const certificateListEl = document.getElementById('certificate-list');
  const loadingCard = document.getElementById('history-loading');
  const errorCard = document.getElementById('history-error');
  const retryBtn = document.getElementById('history-retry-btn');
  const tabButtons = document.querySelectorAll('.history-tab-button');
  const certificateRecords = new Map();

  const studentInfo = JSON.parse(localStorage.getItem('spu-student-info') || '{}');
  const studentId = studentInfo.studentId || localStorage.getItem('studentId');

  if (!studentId) {
    showError('ไม่พบข้อมูลนักศึกษา กรุณาเข้าสู่ระบบอีกครั้ง');
    return;
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', loadHistory);
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      switchTab(btn, targetId);
    });
  });

  if (certificateListEl) {
    certificateListEl.addEventListener('click', (event) => {
      const btn = event.target.closest('.view-certificate-btn');
      if (!btn) return;
      const certKey = btn.getAttribute('data-cert-key');
      if (certKey) {
        openCertificateFromKey(certKey);
      }
    });
  }

  loadHistory();

  async function loadHistory() {
    showLoading();
    try {
      const [activities, hourRequests, participationRecords] = await Promise.all([
        apiCall('/activities?includeArchived=true'),
        apiCall(`/hour-requests/student/${encodeURIComponent(studentId)}`).catch(() => []),
        apiCall(`/participants/student/${encodeURIComponent(studentId)}`).catch(() => []),
      ]);

      const requestsMap = buildRequestMap(hourRequests);
      const participationMap = buildParticipationMap(participationRecords);

      const { ongoingActivities, completedActivities, certificateActivities } =
        categorizeActivities(activities, participationMap, requestsMap);

      renderHistoryList(ongoingListEl, ongoingActivities, 'ยังไม่มีกิจกรรมที่กำลังเข้าร่วม');
      renderHistoryList(completedListEl, completedActivities, 'ยังไม่มีกิจกรรมที่สำเร็จแล้ว');
      renderCertificateList(
        certificateListEl,
        certificateActivities,
        'ยังไม่มีใบเกียรติบัตรที่พร้อมให้ดาวน์โหลด'
      );
      hideLoading();
    } catch (error) {
      console.error('Error loading history:', error);
      showError('เกิดข้อผิดพลาดในการโหลดข้อมูลกิจกรรม');
    }
  }

  function switchTab(activeButton, targetId) {
    tabButtons.forEach((btn) => {
      btn.classList.toggle('active', btn === activeButton);
      btn.setAttribute('aria-selected', btn === activeButton ? 'true' : 'false');
    });

    document.querySelectorAll('.history-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === targetId);
    });
  }

  function buildRequestMap(requests) {
    const map = new Map();
    if (Array.isArray(requests)) {
      requests.forEach((request) => {
        map.set(request.activityTitle, request);
      });
    }
    return map;
  }

  function buildParticipationMap(records) {
    const map = new Map();
    if (Array.isArray(records)) {
      records.forEach((record) => {
        if (record && record.activityTitle) {
          map.set(record.activityTitle, record);
        }
      });
    }
    return map;
  }

  function categorizeActivities(activities, participationMap, requestsMap) {
    const ongoingActivities = [];
    const completedActivities = [];
    const certificateActivities = [];

    activities.forEach((activity) => {
      const participation = participationMap.get(activity.title);
      if (!participation) {
        return;
      }

      const request = requestsMap.get(activity.title);
      const isApproved = request?.status === 'approved';

      if (isApproved) {
        completedActivities.push({ activity, request, participation });
        certificateActivities.push({ activity, request, participation });
      }

      if (!isApproved) {
        ongoingActivities.push({ activity, request, participation });
      }
    });

    return { ongoingActivities, completedActivities, certificateActivities };
  }

  function buildEventDate(activity) {
    if (!activity.date) {
      return null;
    }
    const dateString = activity.time ? `${activity.date}T${activity.time}` : `${activity.date}T00:00`;
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function renderHistoryList(container, items, emptyMessage) {
    if (!container) return;
    container.innerHTML = '';

    if (!items.length) {
      container.appendChild(createEmptyState(emptyMessage));
      return;
    }

    items
      .sort((a, b) => {
        const dateA = buildEventDate(a.activity)?.getTime() || 0;
        const dateB = buildEventDate(b.activity)?.getTime() || 0;
        return dateB - dateA;
      })
      .forEach(({ activity, request, participation }) => {
        container.appendChild(createHistoryCard(activity, request, participation));
      });
  }

  function renderCertificateList(container, items, emptyMessage) {
    if (!container) return;
    container.innerHTML = '';
    certificateRecords.clear();

    if (!items.length) {
      container.appendChild(createEmptyState(emptyMessage));
      return;
    }

    items
      .sort((a, b) => {
        const dateA = buildEventDate(a.activity)?.getTime() || 0;
        const dateB = buildEventDate(b.activity)?.getTime() || 0;
        return dateB - dateA;
      })
      .forEach(({ activity, request }) => {
        const certKey = buildCertificateKey(activity, request);
        certificateRecords.set(certKey, { activity, request });
        container.appendChild(createCertificateCard(activity, request, certKey));
      });
  }

  function createHistoryCard(activity, request, participation) {
    const card = document.createElement('article');
    card.className = 'history-card';

    const statusBadge = createStatusBadge(request);
    const dateText = formatDate(activity.date, activity.time);
    const hoursText = activity.hours ? `${activity.hours} ชั่วโมง` : 'ไม่ระบุ';
    const joinDateText = participation?.registrationDate
      ? `เข้าร่วมเมื่อ ${participation.registrationDate}`
      : '';

    card.innerHTML = `
      <div class="history-card-header">
        <div>
          <p class="history-card-title">${activity.title || 'กิจกรรมไม่ระบุชื่อ'}</p>
          <p class="history-card-subtitle">${activity.desc || ''}</p>
        </div>
        ${statusBadge}
      </div>
      <div class="history-metas">
        ${
          dateText
            ? `<p class="history-meta-line"><i class="fas fa-calendar-alt"></i>${dateText}</p>`
            : ''
        }
        <p class="history-meta-line"><i class="fas fa-clock"></i>${hoursText}</p>
        ${
          activity.location
            ? `<p class="history-meta-line"><i class="fas fa-map-marker-alt"></i>${activity.location}</p>`
            : ''
        }
        ${
          joinDateText
            ? `<p class="history-meta-line"><i class="fas fa-user-check"></i>${joinDateText}</p>`
            : ''
        }
      </div>
      <div class="history-card-actions">
        <a class="secondary-link" href="activity.html?title=${encodeURIComponent(
          activity.title
        )}">
          ดูรายละเอียด
        </a>
        ${
          activity.formLink
            ? `<a class="primary-link" href="${activity.formLink}" target="_blank" rel="noopener">ไปที่ฟอร์ม</a>`
            : `<a class="primary-link" href="activity.html?title=${encodeURIComponent(
                activity.title
              )}">รายละเอียดเพิ่มเติม</a>`
        }
      </div>
    `;

    return card;
  }

  function createCertificateCard(activity, request, certKey) {
    const card = document.createElement('article');
    card.className = 'history-card';

    const dateText = formatDate(activity.date, activity.time);
    const approvedDate = request?.approvedDate
      ? `ออกให้เมื่อ ${request.approvedDate}`
      : 'รอข้อมูลวันที่อนุมัติ';
    const hoursText = request?.hours || activity.hours || 0;

    card.innerHTML = `
      <div class="history-card-header">
        <div>
          <p class="history-card-title">${activity.title || 'กิจกรรมไม่ระบุชื่อ'}</p>
          <p class="history-card-subtitle">พร้อมดาวน์โหลดใบเกียรติบัตร</p>
        </div>
        <span class="history-status-badge status-approved">อนุมัติแล้ว</span>
      </div>
      <div class="history-metas">
        ${dateText ? `<p class="history-meta-line"><i class="fas fa-calendar-alt"></i>${dateText}</p>` : ''}
        <p class="history-meta-line"><i class="fas fa-certificate"></i>${approvedDate}</p>
        <p class="history-meta-line"><i class="fas fa-clock"></i>${hoursText} ชั่วโมง</p>
      </div>
      <div class="history-card-actions">
        <a class="secondary-link" href="activity.html?title=${encodeURIComponent(activity.title)}">
          ดูรายละเอียด
        </a>
        <button class="view-certificate-btn" type="button" data-cert-key="${certKey}">
          ดูใบเกียรติบัตร
        </button>
      </div>
    `;

    return card;
  }

  function buildCertificateKey(activity, request) {
    const base = activity.title || 'activity';
    const requestId = request?._id || request?.approvedDate || 'no-id';
    return `${base}__${requestId}`;
  }

  function openCertificateFromKey(certKey) {
    const entry = certificateRecords.get(certKey);
    if (!entry) {
      console.warn('Certificate entry not found', certKey);
      return;
    }
    const { activity, request } = entry;
    const certificateData = {
      studentName: studentInfo.name || 'ไม่ระบุชื่อ',
      studentId: studentId || '-',
      activityTitle: activity.title || 'กิจกรรมไม่ระบุชื่อ',
      hours: request?.hours || activity.hours || 0,
      requestDate: request?.requestDate || '',
      approvedDate: request?.approvedDate || '',
      description:
        activity.desc ||
        "This is a student development activity organized by the Faculty of Information Technology, Sripatum University. It is issued as an official certificate to confirm the student's eligibility for activity hour accumulation."
    };

    localStorage.setItem('spu-certificate-data', JSON.stringify(certificateData));
    window.location.href = '../admin/main/certificate.html';
  }

  function createStatusBadge(request) {
    if (!request) {
      return '<span class="history-status-badge status-pending">ยังไม่ยื่นรับเวลา</span>';
    }
    const status = request.status || 'pending';
    if (status === 'approved') {
      return '<span class="history-status-badge status-approved">อนุมัติแล้ว</span>';
    }
    if (status === 'rejected') {
      return '<span class="history-status-badge status-rejected">ไม่อนุมัติ</span>';
    }
    return '<span class="history-status-badge status-pending">รอการอนุมัติ</span>';
  }

  function createEmptyState(message) {
    const empty = document.createElement('div');
    empty.className = 'history-empty-state';
    empty.innerHTML = `
      <i class="fas fa-folder-open"></i>
      <p>${message}</p>
    `;
    return empty;
  }

  function formatDate(dateStr, timeStr) {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr + 'T00:00:00');
    if (Number.isNaN(dateObj.getTime())) return '';
    const thaiMonths = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ];
    let text = `${dateObj.getDate()} ${thaiMonths[dateObj.getMonth()]} ${
      dateObj.getFullYear() + 543
    }`;
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':');
      text += ` เวลา ${hours}:${minutes} น.`;
    }
    return text;
  }

  async function apiCall(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  function showLoading() {
    loadingCard?.classList.remove('hidden');
    errorCard?.classList.add('hidden');
  }

  function hideLoading() {
    loadingCard?.classList.add('hidden');
  }

  function showError(message) {
    hideLoading();
    if (errorCard) {
      errorCard.classList.remove('hidden');
      const paragraph = errorCard.querySelector('p');
      if (paragraph) {
        paragraph.textContent = message;
      }
    }
  }
});

