// Leaflet Maps variables
let map, editMap;
let marker, editMarker;

// Initialize Leaflet Maps (OpenStreetMap - ฟรี, สามารถคลิกเลือกตำแหน่งได้)
function initMap() {
    // Default location (Sripatum University)
    const defaultLocation = [13.7563, 100.5018];
    
    // Initialize map for add activity modal
    const mapPicker = document.getElementById('map-picker');
    if (mapPicker && typeof L !== 'undefined') {
        map = L.map(mapPicker).setView(defaultLocation, 15);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Add marker (draggable)
        marker = L.marker(defaultLocation, { draggable: true }).addTo(map);
        
        // Update lat/lng when marker is moved
        marker.on('dragend', function() {
            const position = marker.getLatLng();
            updateCoordinates(position.lat, position.lng, 'add');
        });
        
        // Update lat/lng when map is clicked
        map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            marker.setLatLng([lat, lng]);
            updateCoordinates(lat, lng, 'add');
        });
        
        // Search location button
        const pickLocationBtn = document.getElementById('pick-location-btn');
        if (pickLocationBtn) {
            pickLocationBtn.addEventListener('click', function() {
                const locationInput = document.getElementById('activity-location').value;
                if (locationInput) {
                    searchLocation(locationInput, function(lat, lng) {
                        if (lat && lng) {
                            map.setView([lat, lng], 15);
                            marker.setLatLng([lat, lng]);
                            updateCoordinates(lat, lng, 'add');
                        } else {
                            alert('ไม่พบสถานที่ที่ค้นหา');
                        }
                    });
                }
            });
        }
        
        // Update coordinates manually
        const updateCoordsBtn = document.getElementById('update-coords-btn');
        if (updateCoordsBtn) {
            updateCoordsBtn.addEventListener('click', function() {
                const lat = parseFloat(document.getElementById('activity-lat-input').value);
                const lng = parseFloat(document.getElementById('activity-lng-input').value);
                if (!isNaN(lat) && !isNaN(lng)) {
                    map.setView([lat, lng], 15);
                    marker.setLatLng([lat, lng]);
                    updateCoordinates(lat, lng, 'add');
                } else {
                    alert('กรุณากรอกพิกัดให้ถูกต้อง');
                }
            });
        }
        
        // Load existing coordinates to input fields
        const latInput = document.getElementById('activity-lat-input');
        const lngInput = document.getElementById('activity-lng-input');
        if (latInput && lngInput) {
            latInput.value = defaultLocation[0];
            lngInput.value = defaultLocation[1];
        }
    }
    
    // Initialize map for edit activity modal
    const editMapPicker = document.getElementById('edit-map-picker');
    if (editMapPicker && typeof L !== 'undefined') {
        editMap = L.map(editMapPicker).setView(defaultLocation, 15);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(editMap);
        
        // Add marker (draggable)
        editMarker = L.marker(defaultLocation, { draggable: true }).addTo(editMap);
        
        // Update lat/lng when marker is moved
        editMarker.on('dragend', function() {
            const position = editMarker.getLatLng();
            updateCoordinates(position.lat, position.lng, 'edit');
        });
        
        // Update lat/lng when map is clicked
        editMap.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            editMarker.setLatLng([lat, lng]);
            updateCoordinates(lat, lng, 'edit');
        });
        
        // Search location button
        const editPickLocationBtn = document.getElementById('edit-pick-location-btn');
        if (editPickLocationBtn) {
            editPickLocationBtn.addEventListener('click', function() {
                const locationInput = document.getElementById('edit-activity-location').value;
                if (locationInput) {
                    searchLocation(locationInput, function(lat, lng) {
                        if (lat && lng) {
                            editMap.setView([lat, lng], 15);
                            editMarker.setLatLng([lat, lng]);
                            updateCoordinates(lat, lng, 'edit');
                        } else {
                            alert('ไม่พบสถานที่ที่ค้นหา');
                        }
                    });
                }
            });
        }
        
        // Update coordinates manually
        const editUpdateCoordsBtn = document.getElementById('edit-update-coords-btn');
        if (editUpdateCoordsBtn) {
            editUpdateCoordsBtn.addEventListener('click', function() {
                const lat = parseFloat(document.getElementById('edit-activity-lat-input').value);
                const lng = parseFloat(document.getElementById('edit-activity-lng-input').value);
                if (!isNaN(lat) && !isNaN(lng)) {
                    editMap.setView([lat, lng], 15);
                    editMarker.setLatLng([lat, lng]);
                    updateCoordinates(lat, lng, 'edit');
                } else {
                    alert('กรุณากรอกพิกัดให้ถูกต้อง');
                }
            });
        }
    }
}

// Update coordinates in form fields
function updateCoordinates(lat, lng, mode) {
    if (mode === 'add') {
        document.getElementById('activity-lat').value = lat;
        document.getElementById('activity-lng').value = lng;
        const latInput = document.getElementById('activity-lat-input');
        const lngInput = document.getElementById('activity-lng-input');
        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;
    } else if (mode === 'edit') {
        document.getElementById('edit-activity-lat').value = lat;
        document.getElementById('edit-activity-lng').value = lng;
        const latInput = document.getElementById('edit-activity-lat-input');
        const lngInput = document.getElementById('edit-activity-lng-input');
        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;
    }
}

// Search location using Nominatim (OpenStreetMap geocoding - ฟรี)
function searchLocation(query, callback) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                callback(lat, lng);
            } else {
                callback(null, null);
            }
        })
        .catch(error => {
            console.error('Error searching location:', error);
            callback(null, null);
        });
}

// Image helpers
const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_DIMENSION = 1600;

function fileToOptimizedDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const originalDataUrl = reader.result;

            // Skip optimization for GIF to preserve animation
            if (file.type === 'image/gif') {
                return resolve(originalDataUrl);
            }

            const img = new Image();
            img.onload = () => {
                let { width, height } = img;

                const shouldResize = width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION;
                if (!shouldResize && file.size <= MAX_IMAGE_FILE_SIZE) {
                    return resolve(originalDataUrl);
                }

                const scale = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height, 1);
                const targetWidth = Math.floor(width * scale);
                const targetHeight = Math.floor(height * scale);

                const canvas = document.createElement('canvas');
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                const quality = outputType === 'image/png' ? 0.92 : 0.85;

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            return reject(new Error('ไม่สามารถย่อขนาดรูปภาพได้'));
                        }
                        if (blob.size > MAX_IMAGE_FILE_SIZE) {
                            return reject(new Error('ไม่สามารถลดขนาดรูปภาพให้ต่ำกว่า 5MB ได้ กรุณาเลือกรูปภาพที่เล็กกว่านี้'));
                        }
                        const reader2 = new FileReader();
                        reader2.onload = () => resolve(reader2.result);
                        reader2.onerror = reject;
                        reader2.readAsDataURL(blob);
                    },
                    outputType,
                    quality
                );
            };
            img.onerror = () => resolve(originalDataUrl);
            img.src = originalDataUrl;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function getImageFileData(fileInputId, { required = false } = {}) {
    const fileInput = document.getElementById(fileInputId);
    if (!fileInput) {
        throw new Error('ไม่พบช่องอัปโหลดรูปภาพ');
    }

    if (!fileInput.files || !fileInput.files[0]) {
        if (required) {
            throw new Error('กรุณาอัปโหลดรูปภาพกิจกรรม');
        }
        return '';
    }

    const file = fileInput.files[0];
    if (!file.type.startsWith('image/')) {
        throw new Error('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
    }

    const dataUrl = await fileToOptimizedDataURL(file);

    // Verify final size is within limit
    const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
    const approxBytes = Math.ceil(base64Length * 3 / 4);
    if (approxBytes > MAX_IMAGE_FILE_SIZE) {
        throw new Error('ไม่สามารถลดขนาดรูปภาพให้ต่ำกว่า 5MB ได้ กรุณาเลือกรูปภาพที่เล็กกว่านี้');
    }

    return dataUrl;
}

document.addEventListener('DOMContentLoaded', () => {
    // Mobile sidebar toggle functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    function openSidebar() {
        if (sidebar) sidebar.classList.add('show');
        if (sidebarOverlay) sidebarOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent body scroll when sidebar is open
    }
    
    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('show');
        if (sidebarOverlay) sidebarOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore body scroll
    }
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            openSidebar();
        });
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    // Close sidebar when clicking outside on mobile
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Close sidebar when window is resized to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
    
    // Initialize map when Leaflet is loaded
    function tryInitMap() {
        if (typeof L !== 'undefined') {
            initMap();
        } else {
            setTimeout(tryInitMap, 100);
        }
    }
    
    // Try to initialize map after a short delay
    setTimeout(tryInitMap, 500);

    // --- API Configuration (รองรับทั้ง local และ production) ---
    const API_BASE_URL = window.location.origin + '/api';

    // --- Helper Functions for API Calls ---
    async function apiCall(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Call Error:', error);
            throw error;
        }
    }

    // --- Database Connection Check ---
    let isDatabaseConnected = false;
    
    async function checkDatabaseConnection() {
        try {
            await apiCall('/activities');
            isDatabaseConnected = true;
            hideDatabaseError();
            return true;
        } catch (error) {
            isDatabaseConnected = false;
            showDatabaseError();
            return false;
        }
    }

    function showDatabaseError() {
        // ลบ error message เก่าถ้ามี
        const existingError = document.getElementById('database-error-message');
        if (existingError) {
            existingError.remove();
        }

        // สร้าง error message
        const errorDiv = document.createElement('div');
        errorDiv.id = 'database-error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #dc3545;
            color: white;
            padding: 15px 20px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-weight: 600;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i> 
            ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์และ MongoDB ทำงานอยู่
            <button onclick="location.reload()" style="margin-left: 15px; padding: 5px 15px; background: white; color: #dc3545; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">
                <i class="fas fa-sync-alt"></i> ลองใหม่
            </button>
        `;
        document.body.insertBefore(errorDiv, document.body.firstChild);

        // ซ่อนเนื้อหาหลัก
        const mainContent = document.querySelector('.main-content');
        const activityGrid = document.getElementById('activity-grid');
        if (activityGrid) {
            activityGrid.innerHTML = `
                <div style="text-align: center; padding: 50px 20px; color: #666;">
                    <i class="fas fa-database" style="font-size: 64px; color: #dc3545; margin-bottom: 20px;"></i>
                    <h2 style="color: #333; margin-bottom: 10px;">ไม่สามารถเชื่อมต่อฐานข้อมูล</h2>
                    <p style="margin-bottom: 20px;">กรุณาตรวจสอบว่า:</p>
                    <ul style="text-align: left; display: inline-block; margin: 0;">
                        <li>เซิร์ฟเวอร์ Node.js ทำงานอยู่</li>
                        <li>MongoDB ทำงานอยู่และเชื่อมต่อได้</li>
                        <li>การตั้งค่า MONGODB_URI ถูกต้อง</li>
                    </ul>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
                        <i class="fas fa-sync-alt"></i> ลองใหม่
                    </button>
                </div>
            `;
        }
    }

    function hideDatabaseError() {
        const errorDiv = document.getElementById('database-error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // ตรวจสอบการเชื่อมต่อฐานข้อมูลเมื่อโหลดหน้า
    checkDatabaseConnection();
    // ตรวจสอบทุก 10 วินาที
    setInterval(checkDatabaseConnection, 10000);

    // --- API Functions (แทนที่ localStorage) ---
        async function getActivitiesFromAPI({ includeArchived = false, showAll = false } = {}) {
            try {
                const params = new URLSearchParams();
                if (includeArchived) params.set('includeArchived', 'true');
                if (showAll) params.set('showAll', 'true');
                const query = params.toString() ? `?${params.toString()}` : '';
                return await apiCall(`/activities${query}`);
            } catch (error) {
                console.error('Error fetching activities:', error);
                return [];
            }
        }

    async function getArchivedActivitiesFromAPI() {
        try {
            return await apiCall('/activities/archived');
        } catch (error) {
            console.error('Error fetching archived activities:', error);
            return [];
        }
    }

    async function getActivityParticipants(activityTitle) {
        try {
            return await apiCall(`/participants/${encodeURIComponent(activityTitle)}`);
        } catch (error) {
            console.error('Error fetching participants:', error);
            return [];
        }
    }

    async function getHourRequests(activityTitle) {
        try {
            return await apiCall(`/hour-requests/${encodeURIComponent(activityTitle)}`);
        } catch (error) {
            console.error('Error fetching hour requests:', error);
            return [];
        }
    }

    // --- Page Navigation and Global Logic ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // เมื่อ login สำเร็จ ให้ไปที่หน้า index.html
            window.location.href = 'index.html';
        });
    }

    // --- Certificate Page Logic (certificate.html) ---
    const certStudentName = document.getElementById('cert-student-name');
    const certActivityTitle = document.getElementById('cert-activity-title');
    const certHours = document.getElementById('cert-hours');
    const certDescription = document.getElementById('cert-description');
    const certStudentSignature = document.getElementById('cert-student-signature');
    const certStudentNameThai = document.getElementById('cert-student-name-thai');
    
    if (certStudentName || certActivityTitle || certHours || certDescription) {
        // โหลดข้อมูลใบรับรองจาก localStorage
        const certificateData = JSON.parse(localStorage.getItem('spu-certificate-data') || 'null');
        
        if (certificateData) {
            // อัปเดตชื่อนักศึกษา
            if (certStudentName) {
                certStudentName.textContent = certificateData.studentName || 'ไม่ระบุชื่อ';
            }
            
            // อัปเดตชื่อในส่วนลายเซ็น
            if (certStudentSignature) {
                // แปลงชื่อเป็นตัวย่อ (เช่น John Doe -> J. Doe)
                const nameParts = (certificateData.studentName || '').split(' ');
                if (nameParts.length > 1) {
                    certStudentSignature.textContent = `${nameParts[0][0]}. ${nameParts.slice(1).join(' ')}`;
                } else {
                    certStudentSignature.textContent = certificateData.studentName || 'J. Jiewjairung';
                }
            }
            
            if (certStudentNameThai) {
                certStudentNameThai.textContent = certificateData.studentName || 'นาง จีจี้ เยี่ยวสิรุ้ง';
            }
            
            // อัปเดตชื่อกิจกรรม
            if (certActivityTitle) {
                certActivityTitle.textContent = `กิจกรรม: ${certificateData.activityTitle || 'ไม่ระบุ'}`;
            }
            
            // อัปเดตจำนวนชั่วโมง
            if (certHours) {
                const hours = certificateData.hours || 0;
                certHours.textContent = `จำนวนชั่วโมง: ${hours} ชั่วโมง`;
            }
            
            // อัปเดตคำอธิบาย
            if (certDescription) {
                certDescription.innerHTML = certificateData.description || 'This is a student development activity organized by the Faculty of Information Technology, Sripatum University. It is issued as an official certificate to confirm the student\'s eligibility for activity hour accumulation.';
            }
            
        } else {
            // ถ้าไม่มีข้อมูล ให้ใช้ข้อมูล default
            console.warn('No certificate data found in localStorage');
        }
    }
    
    // ฟังก์ชันสร้างภาพ (PNG/JPG)
    async function generateImage(format = 'png') {
        const certificateContainer = document.querySelector('.certificate-container');
        if (!certificateContainer) {
            console.error('Certificate container not found');
            alert('ไม่พบใบเกียรติบัตร');
            return;
        }
        
        // ตรวจสอบว่ามี html2canvas library หรือไม่
        if (typeof html2canvas === 'undefined') {
            alert('ไม่สามารถสร้างภาพได้ กรุณารีเฟรชหน้าเว็บ');
            return;
        }
        
        // แสดง loading
        const downloadBtn = document.getElementById('download-image-btn');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังสร้างภาพ...';
        
        try {
            // สร้าง canvas ด้วยคุณภาพสูง
            const canvas = await html2canvas(certificateContainer, {
                scale: 3, // เพิ่มความละเอียด 3 เท่า
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: certificateContainer.offsetWidth,
                height: certificateContainer.offsetHeight,
                windowWidth: certificateContainer.scrollWidth,
                windowHeight: certificateContainer.scrollHeight,
                allowTaint: false,
                removeContainer: false
            });
            
            // แปลง canvas เป็น blob
            const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
            const quality = format === 'png' ? 1.0 : 0.95;
            
            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error('ไม่สามารถสร้างไฟล์ภาพได้');
                }
                
                // สร้าง URL และดาวน์โหลด
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `certificate_${Date.now()}.${format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                // คืนค่า button
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = originalText;
                
                console.log('Image generated and downloaded successfully');
            }, mimeType, quality);
        } catch (error) {
            console.error('Error generating image:', error);
            alert('เกิดข้อผิดพลาดในการสร้างภาพ: ' + error.message);
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalText;
        }
    }
    
    // ฟังก์ชันสร้าง PDF (ปรับปรุงให้สวยงามขึ้น)
    function generatePDF() {
        const certificateContainer = document.querySelector('.certificate-container');
        if (!certificateContainer) {
            console.error('Certificate container not found');
            alert('ไม่พบใบเกียรติบัตร');
            return;
        }
        
        // ตรวจสอบว่ามี html2pdf library หรือไม่
        if (typeof html2pdf === 'undefined') {
            alert('ไม่สามารถสร้าง PDF ได้ กรุณารีเฟรชหน้าเว็บ');
            return;
        }
        
        // แสดง loading
        const downloadBtn = document.getElementById('download-pdf-btn');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังสร้าง PDF...';
        
        const opt = {
            margin: [0, 0, 0, 0],
            filename: `certificate_${Date.now()}.pdf`,
            image: { 
                type: 'jpeg', 
                quality: 0.98 
            },
            html2canvas: { 
                scale: 3, // เพิ่มความละเอียด 3 เท่า
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: certificateContainer.offsetWidth,
                height: certificateContainer.offsetHeight,
                windowWidth: certificateContainer.scrollWidth,
                windowHeight: certificateContainer.scrollHeight,
                allowTaint: false
            },
            jsPDF: { 
                unit: 'mm', 
                format: [210, 297], // A4 portrait
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // สร้าง PDF และดาวน์โหลด
        html2pdf().set(opt).from(certificateContainer).save().then(() => {
            console.log('PDF generated and downloaded successfully');
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalText;
        }).catch((error) => {
            console.error('Error generating PDF:', error);
            alert('เกิดข้อผิดพลาดในการสร้าง PDF: ' + error.message);
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalText;
        });
    }
    
    // Event listeners สำหรับปุ่ม
    const downloadImageBtn = document.getElementById('download-image-btn');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    
    if (downloadImageBtn) {
        downloadImageBtn.addEventListener('click', () => {
            generateImage('png');
        });
    }
    
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            generatePDF();
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // ล้างข้อมูลชั่วโมงที่เก็บไว้
            localStorage.removeItem('currentTotalHours');
            localStorage.removeItem('activityHoursToAdd');
            // กลับไปหน้า login หลัก
            window.location.href = '../../login.html';
        });
    }

    // --- Dashboard Page Logic (index.html) ---
    const activityGrid = document.querySelector('.activity-grid');
    const contentViews = {
        dashboard: document.getElementById('dashboard-view'),
        reports: document.getElementById('reports-view'),
        students: document.getElementById('students-view')
    };
    const dashboardActionsContainer = document.getElementById('dashboard-actions');
    const pageTitleEl = document.getElementById('page-title');
    const globalSearchInput = document.getElementById('global-search');
    const navLinks = document.querySelectorAll('.sidebar-menu a[data-view]');

    const reportsTableBody = document.getElementById('reports-table-body');
    const reportsSummaryText = document.getElementById('reports-summary-text');
    const reportsTotalActivities = document.getElementById('reports-total-activities');
    const reportsTotalHours = document.getElementById('reports-total-hours');
    const reportsTotalParticipants = document.getElementById('reports-total-participants');

    const studentsTableBody = document.getElementById('students-table-body');
    const studentsTotalCountEl = document.getElementById('students-total-count');
    const studentsTotalHoursEl = document.getElementById('students-total-hours');
    const studentsTotalActivitiesEl = document.getElementById('students-total-activities');

    const studentDetailModal = document.getElementById('student-detail-modal');
    const closeStudentDetailModalBtn = document.getElementById('close-student-detail-modal');
    const studentDetailName = document.getElementById('student-detail-name');
    const studentDetailInfo = document.getElementById('student-detail-info');
    const studentDetailTableBody = document.getElementById('student-detail-table-body');

    let currentView = 'dashboard';
    let reportsDataCache = [];
    let studentsSummaryCache = [];
    let reportsLoading = false;
    let studentsLoading = false;

    function switchView(view) {
        if (!contentViews[view]) return;
        currentView = view;
        Object.entries(contentViews).forEach(([key, section]) => {
            if (section) section.classList.toggle('active', key === view);
        });
        navLinks.forEach(link => {
            const isActive = link.dataset.view === view;
            link.classList.toggle('active', isActive);
        });
        if (dashboardActionsContainer) {
            dashboardActionsContainer.style.display = view === 'dashboard' ? 'flex' : 'none';
        }
        if (pageTitleEl) {
            if (view === 'reports') pageTitleEl.textContent = 'รายงานกิจกรรม';
            else if (view === 'students') pageTitleEl.textContent = 'รายชื่อนักศึกษา';
            else pageTitleEl.textContent = 'จัดการกิจกรรม';
        }
        if (globalSearchInput) {
            if (view === 'reports') globalSearchInput.placeholder = 'ค้นหาชื่อกิจกรรมในรายงาน...';
            else if (view === 'students') globalSearchInput.placeholder = 'ค้นหาชื่อหรือรหัสนักศึกษา...';
            else globalSearchInput.placeholder = 'ค้นหากิจกรรม...';
            globalSearchInput.value = '';
        }
        if (view === 'reports') {
            renderReportsView();
        } else if (view === 'students') {
            renderStudentsView();
        }
    }

    function filterActivityCards(keyword = '') {
        if (!activityGrid) return;
        const cards = activityGrid.querySelectorAll('.activity-card');
        if (!cards.length) return;
        const normalized = keyword.toLowerCase();
        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const matches = !normalized || title.includes(normalized);
            card.style.display = matches ? 'flex' : 'none';
        });
    }

    if (navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const view = link.dataset.view;
                if (view) {
                    switchView(view);
                }
            });
        });
    }

    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', (event) => {
            const keyword = event.target.value.trim().toLowerCase();
            if (currentView === 'reports') {
                filterReportsTable(keyword);
            } else if (currentView === 'students') {
                filterStudentsTable(keyword);
            } else {
                filterActivityCards(keyword);
            }
        });
    }

    if (closeStudentDetailModalBtn && studentDetailModal) {
        closeStudentDetailModalBtn.addEventListener('click', hideStudentDetailModal);
        window.addEventListener('click', (event) => {
            if (event.target === studentDetailModal) {
                hideStudentDetailModal();
            }
        });
    }

    switchView('dashboard');

    if (activityGrid) {
        
        // --- Function to render all activities to the grid ---
        async function renderActivities() {
            activityGrid.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> กำลังโหลดข้อมูล...</div>';
            
            // ตรวจสอบการเชื่อมต่อฐานข้อมูลก่อน
            if (!isDatabaseConnected) {
                await checkDatabaseConnection();
                if (!isDatabaseConnected) {
                    return; // showDatabaseError() จะแสดงข้อความแล้ว
                }
            }
            
            try {
                const activities = await getActivitiesFromAPI();
                activityGrid.innerHTML = ''; // Clear the grid first

                // รอข้อมูล participants และ hour requests สำหรับทุกกิจกรรม
                for (const activity of activities) {
                    // Get participants count for this activity
                    const participants = await getActivityParticipants(activity.title);
                    const participantsCount = participants.length;
                    const maxSlots = parseInt(activity.slots, 10);
                    const progressPercent = maxSlots > 0 ? (participantsCount / maxSlots) * 100 : 0;

                    // Get hour requests
                    const requests = await getHourRequests(activity.title);
                    const pendingRequests = requests.filter(r => r.status === 'pending').length;

                    let buttonHTML;
                    // ไม่มี pending activity ในฐานข้อมูลแล้ว ใช้เฉพาะปุ่มปกติ
                    buttonHTML = `
                        <div class="card-actions" style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center;">
                            <button class="view-participants-btn" data-title="${activity.title}" title="ดูรายชื่อผู้เข้าร่วม">
                                <i class="fas fa-users"></i> <span class="btn-text">ดูรายชื่อ</span> <span class="btn-badge">${participantsCount}/${maxSlots}</span>
                            </button>
                            <button class="view-hour-requests-btn" data-title="${activity.title}" title="ดูการยื่นรับเวลา">
                                <i class="fas fa-clock"></i> <span class="btn-text">การยื่นรับเวลา</span>${pendingRequests > 0 ? `<span class="btn-badge">${pendingRequests}</span>` : ''}
                            </button>
                            <button class="edit-activity-btn" data-title="${activity.title}" title="แก้ไขกิจกรรม">
                                <i class="fas fa-edit"></i> <span class="btn-text">แก้ไข</span>
                            </button>
                            <button class="archive-activity-btn" data-title="${activity.title}" title="เก็บลงคลัง">
                                <i class="fas fa-archive"></i> <span class="btn-text">เก็บลงคลัง</span>
                            </button>
                        </div>
                    `;

                    // Format date for display
                    let dateDisplay = 'ยังไม่กำหนด';
                    if (activity.date) {
                        const dateObj = new Date(activity.date + 'T00:00:00');
                        const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                                          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
                        dateDisplay = `${dateObj.getDate()} ${thaiMonths[dateObj.getMonth()]} ${dateObj.getFullYear() + 543}`;
                        if (activity.time) {
                            const [hours, minutes] = activity.time.split(':');
                            dateDisplay += ` เวลา ${hours}:${minutes} น.`;
                        }
                    }

                    const cardHTML = `
                    <div class="activity-card">
                        <div class="card-image-container"><img src="${activity.imgUrl || ''}" alt="${activity.title}" class="card-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22225%22%3E%3Crect width=%22400%22 height=%22225%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3Eไม่มีรูปภาพ%3C/text%3E%3C/svg%3E';"></div>
                        <div class="progress-container">
                            <div class="progress-text">${participantsCount}/${activity.slots}</div>
                            <div class="progress-bar-bg">
                                <div class="progress-bar" style="width: ${progressPercent}%;"></div>
                            </div>
                        </div>
                        <div class="card-content">
                            <h3>${activity.title}</h3>
                            <p>${activity.desc || 'เป็นกิจกรรมสะสมชั่วโมงเพื่อให้อาจารย์และเพื่อนนักศึกษารับรู้ในทุกด้าน'}</p>
                            <p class="activity-date-display" style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">
                                <i class="fas fa-calendar-alt"></i> ${dateDisplay}
                            </p>
                            <p class="activity-hours-display" style="color: #666; font-size: 0.9rem; margin-top: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-clock"></i> <span class="hours" data-hours="${activity.hours}">${activity.hours || 4} hours</span>
                            </p>
                        </div>
                        <div class="card-footer">
                            ${buttonHTML}
                        </div>
                    </div>`;
                    activityGrid.insertAdjacentHTML('beforeend', cardHTML);
                }
            } catch (error) {
                console.error('Error rendering activities:', error);
                activityGrid.innerHTML = `
                    <div style="text-align: center; padding: 50px 20px; color: #dc3545;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
                        <h3>เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
                        <p>${error.message}</p>
                        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            <i class="fas fa-sync-alt"></i> ลองใหม่
                        </button>
                    </div>
                `;
            }
        }
        
        // Initial render when the page loads
        renderActivities();
        
        // --- Archive Activity Function ---
        async function archiveActivity(activityTitle) {
            if (!confirm(`คุณต้องการเก็บกิจกรรม "${activityTitle}" ลงคลังหรือไม่?`)) {
                return;
            }
            
            try {
                await apiCall(`/activities/${encodeURIComponent(activityTitle)}/archive`, {
                    method: 'POST'
                });
                
                // Refresh activities list
                await renderActivities();
                
                alert('เก็บกิจกรรมลงคลังเรียบร้อยแล้ว');
            } catch (error) {
                console.error('Error archiving activity:', error);
                alert('เกิดข้อผิดพลาดในการเก็บกิจกรรมลงคลัง: ' + error.message);
            }
        }

        // --- New Activity Modal Logic ---
        const modal = document.getElementById('add-activity-modal');
        const addActivityBtn = document.getElementById('add-activity-btn');
        const closeBtn = modal.querySelector('.close-btn');
        const addActivityForm = document.getElementById('add-activity-form');

        if (addActivityBtn) {
            addActivityBtn.addEventListener('click', () => modal.style.display = 'flex');
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.style.display = 'none');
        }
        if (modal) {
            window.addEventListener('click', (event) => {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // --- View Archived Activities ---
        const viewArchivedBtn = document.getElementById('view-archived-btn');
        const archivedModal = document.getElementById('archived-modal');
        const closeArchivedModal = document.getElementById('close-archived-modal');
        const closeArchivedBtn = document.getElementById('close-archived-btn');
        const archivedList = document.getElementById('archived-list');
        const archivedCount = document.getElementById('archived-count');
        
        async function showArchivedModal() {
            try {
                const archived = await getArchivedActivitiesFromAPI();
                archivedCount.textContent = archived.length;
            
                archivedList.innerHTML = '';
            
                if (archived.length === 0) {
                    archivedList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">ยังไม่มีกิจกรรมที่เก็บไว้</p>';
                } else {
                    archived.forEach((activity, index) => {
                    const archivedItem = document.createElement('div');
                    archivedItem.className = 'archived-item';
                    archivedItem.style.cssText = `
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        padding: 1rem;
                        margin-bottom: 1rem;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    `;
                    
                    let dateDisplay = 'ยังไม่กำหนด';
                    if (activity.date) {
                        const dateObj = new Date(activity.date + 'T00:00:00');
                        const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                                          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
                        dateDisplay = `${dateObj.getDate()} ${thaiMonths[dateObj.getMonth()]} ${dateObj.getFullYear() + 543}`;
                        if (activity.time) {
                            const [hours, minutes] = activity.time.split(':');
                            dateDisplay += ` เวลา ${hours}:${minutes} น.`;
                        }
                    }
                    
                    archivedItem.innerHTML = `
                        <div style="flex: 1;">
                            <h3 style="margin: 0 0 0.5rem 0; color: #333;">${activity.title}</h3>
                            <p style="margin: 0.25rem 0; color: #666; font-size: 0.9rem;">${activity.desc || ''}</p>
                            <p style="margin: 0.25rem 0; color: #999; font-size: 0.85rem;">
                                <i class="fas fa-calendar-alt"></i> ${dateDisplay}
                            </p>
                            <p style="margin: 0.25rem 0; color: #999; font-size: 0.85rem;">
                                <i class="fas fa-archive"></i> เก็บเมื่อ: ${activity.archivedDate || 'ไม่ระบุ'}
                            </p>
                            <p style="margin: 0.25rem 0; color: #666; font-size: 0.9rem;">
                                <i class="fas fa-clock"></i> ${activity.hours || 0} ชั่วโมง
                            </p>
                        </div>
                        <div style="display: flex; gap: 0.5rem; margin-left: 1rem;">
                            <button class="restore-activity-btn" data-title="${activity.title}">
                                <i class="fas fa-undo"></i> คืนค่า
                            </button>
                        </div>
                    `;
                    archivedList.appendChild(archivedItem);
                });
                }
                
                archivedModal.style.display = 'flex';
            } catch (error) {
                console.error('Error loading archived activities:', error);
                archivedList.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #dc3545;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>เกิดข้อผิดพลาดในการโหลดข้อมูล: ${error.message}</p>
                    </div>
                `;
            }
        }
        
        function hideArchivedModal() {
            archivedModal.style.display = 'none';
        }
        
        if (viewArchivedBtn) {
            viewArchivedBtn.addEventListener('click', showArchivedModal);
        }
        if (closeArchivedModal) {
            closeArchivedModal.addEventListener('click', hideArchivedModal);
        }
        if (closeArchivedBtn) {
            closeArchivedBtn.addEventListener('click', hideArchivedModal);
        }
        if (archivedModal) {
            window.addEventListener('click', (event) => {
                if (event.target == archivedModal) {
                    hideArchivedModal();
                }
            });
        }
        
        // Event delegation for restore button
        if (archivedList) {
            archivedList.addEventListener('click', (e) => {
                if (e.target.matches('.restore-activity-btn') || e.target.closest('.restore-activity-btn')) {
                    const btn = e.target.matches('.restore-activity-btn') ? e.target : e.target.closest('.restore-activity-btn');
                    const activityTitle = btn.dataset.title;
                    restoreActivity(activityTitle);
                }
            });
        }
        
        async function restoreActivity(activityTitle) {
            if (!confirm(`คุณต้องการคืนค่ากิจกรรม "${activityTitle}" กลับมาหรือไม่?`)) {
                return;
            }
            
            try {
                await apiCall(`/activities/${encodeURIComponent(activityTitle)}/restore`, {
                    method: 'POST'
                });
                
                // Refresh
                await renderActivities();
                await showArchivedModal();
                
                alert('คืนค่ากิจกรรมเรียบร้อยแล้ว');
            } catch (error) {
                console.error('Error restoring activity:', error);
                alert('เกิดข้อผิดพลาดในการคืนค่ากิจกรรม: ' + error.message);
            }
        }

        addActivityForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Create a new activity object
            let imageValue = '';
            try {
                imageValue = await getImageFileData('activity-image-file', { required: true });
            } catch (error) {
                alert(error.message);
                return;
            }

            const newActivity = {
                title: document.getElementById('activity-title').value,
                desc: document.getElementById('activity-desc').value,
                imgUrl: imageValue,
                formLink: document.getElementById('activity-form-link').value,
                hours: parseInt(document.getElementById('activity-hours').value) || 0,
                slots: parseInt(document.getElementById('activity-slots').value) || 10,
                date: document.getElementById('activity-date').value,
                time: document.getElementById('activity-time').value,
                location: document.getElementById('activity-location').value,
                lat: parseFloat(document.getElementById('activity-lat').value) || null,
                lng: parseFloat(document.getElementById('activity-lng').value) || null
            };

            try {
                // ส่งข้อมูลไปยัง API - ตารางข้อมูลจะถูกสร้างอัตโนมัติในฐานข้อมูล
                await apiCall('/activities', {
                    method: 'POST',
                    body: JSON.stringify(newActivity)
                });

                // Re-render all activities to display the new one
                await renderActivities();
                
                modal.style.display = 'none';
                addActivityForm.reset();
                const addImageFileInput = document.getElementById('activity-image-file');
                if (addImageFileInput) {
                    addImageFileInput.value = '';
                }
                
                alert('เพิ่มกิจกรรมสำเร็จ');
            } catch (error) {
                console.error('Error creating activity:', error);
                alert('เกิดข้อผิดพลาดในการเพิ่มกิจกรรม: ' + error.message);
            }
        });

        // --- Participants Modal Logic ---
        const participantsModal = document.getElementById('participants-modal');
        const closeParticipantsModal = document.getElementById('close-participants-modal');
        const closeParticipantsBtn = document.getElementById('close-participants-btn');
        const participantsList = document.getElementById('participants-list');
        const participantsModalTitle = document.getElementById('participants-modal-title');
        const participantsCount = document.getElementById('participants-count');
        const maxSlots = document.getElementById('max-slots');

        async function showParticipantsModal(activityTitle) {
            try {
                // Get activity info
                const activity = await apiCall(`/activities/${encodeURIComponent(activityTitle)}`);
                if (!activity) {
                    alert('ไม่พบกิจกรรม');
                    return;
                }

                const participants = await getActivityParticipants(activityTitle);
                
                // Update modal title and counts
                participantsModalTitle.textContent = `รายชื่อผู้เข้าร่วม: ${activityTitle}`;
                participantsCount.textContent = participants.length;
                maxSlots.textContent = activity.slots;

            // Clear and populate participants list
            participantsList.innerHTML = '';
            
            if (participants.length === 0) {
                participantsList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">ยังไม่มีผู้เข้าร่วมกิจกรรม</p>';
            } else {
                participants.forEach((participant, index) => {
                    const participantItem = document.createElement('div');
                    participantItem.className = 'participant-item';
                    participantItem.innerHTML = `
                        <div class="participant-number">${index + 1}</div>
                        <div class="participant-info">
                            <div class="participant-name">${participant.studentName || participant.name || 'ไม่ระบุชื่อ'}</div>
                            <div class="participant-details">
                                <span class="participant-id">รหัสนักศึกษา: ${participant.studentId || 'ไม่ระบุ'}</span>
                                <span class="participant-date">วันที่ลงทะเบียน: ${participant.registrationDate || 'ไม่ระบุ'}</span>
                            </div>
                        </div>
                    `;
                    participantsList.appendChild(participantItem);
                });
            }

                participantsModal.style.display = 'flex';
            } catch (error) {
                console.error('Error loading participants:', error);
                alert('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้เข้าร่วม: ' + error.message);
            }
        }

        function hideParticipantsModal() {
            participantsModal.style.display = 'none';
        }

        if (closeParticipantsModal) {
            closeParticipantsModal.addEventListener('click', hideParticipantsModal);
        }
        if (closeParticipantsBtn) {
            closeParticipantsBtn.addEventListener('click', hideParticipantsModal);
        }
        window.addEventListener('click', (event) => {
            if (event.target == participantsModal) {
                hideParticipantsModal();
            }
        });

        // --- Hour Requests Modal Logic ---
        const hourRequestsModal = document.getElementById('hour-requests-modal');
        const closeHourRequestsModal = document.getElementById('close-hour-requests-modal');
        const closeHourRequestsBtn = document.getElementById('close-hour-requests-btn');
        const hourRequestsList = document.getElementById('hour-requests-list');
        const hourRequestsModalTitle = document.getElementById('hour-requests-modal-title');
        const hourRequestsCount = document.getElementById('hour-requests-count');

        async function showHourRequestsModal(activityTitle) {
            try {
                // Get activity info
                const activity = await apiCall(`/activities/${encodeURIComponent(activityTitle)}`);
                if (!activity) {
                    alert('ไม่พบกิจกรรม');
                    return;
                }

                const requests = await getHourRequests(activityTitle);
            
                // Update modal title and count
                hourRequestsModalTitle.textContent = `การยื่นรับเวลากิจกรรม: ${activityTitle}`;
                hourRequestsCount.textContent = requests.length;

                // Clear and populate requests list
                hourRequestsList.innerHTML = '';
                
                if (requests.length === 0) {
                    hourRequestsList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">ยังไม่มีการยื่นรับเวลา</p>';
            } else {
                requests.forEach((request, index) => {
                    const requestItem = document.createElement('div');
                    requestItem.className = 'participant-item';
                    
                    let statusBadge = '';
                    let actionButtons = '';
                    
                    if (request.status === 'pending') {
                        statusBadge = '<span style="background: #ffc107; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 0.85em;">รอรับเรื่อง</span>';
                        actionButtons = `
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                <button class="approve-request-btn" data-activity-title="${activityTitle}" data-student-id="${request.studentId}">
                                    <i class="fas fa-check"></i> อนุมัติ
                                </button>
                                <button class="reject-request-btn" data-activity-title="${activityTitle}" data-student-id="${request.studentId}">
                                    <i class="fas fa-times"></i> ไม่อนุมัติ
                                </button>
                            </div>
                        `;
                    } else if (request.status === 'approved') {
                        statusBadge = '<span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85em;">อนุมัติแล้ว</span>';
                        actionButtons = `
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                <button class="unapprove-request-btn" data-activity-title="${activityTitle}" data-student-id="${request.studentId}" data-current-status="approved">
                                    <i class="fas fa-undo"></i> ยกเลิกการอนุมัติ
                                </button>
                            </div>
                        `;
                    } else if (request.status === 'rejected') {
                        statusBadge = '<span style="background: #dc3545; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85em;">ไม่อนุมัติ</span>';
                        actionButtons = `
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                                <button class="unapprove-request-btn" data-activity-title="${activityTitle}" data-student-id="${request.studentId}" data-current-status="rejected">
                                    <i class="fas fa-undo"></i> ยกเลิกการไม่อนุมัติ
                                </button>
                            </div>
                        `;
                    }
                    
                    requestItem.innerHTML = `
                        <div class="participant-number">${index + 1}</div>
                        <div class="participant-info" style="flex: 1;">
                            <div class="participant-name">${request.studentName || 'ไม่ระบุชื่อ'}</div>
                            <div class="participant-details">
                                <span class="participant-id">รหัสนักศึกษา: ${request.studentId || 'ไม่ระบุ'}</span>
                                <span class="participant-date">วันที่ยื่น: ${request.requestDate || 'ไม่ระบุ'}</span>
                                <span style="margin-left: 10px;">จำนวนชั่วโมง: <strong>${request.hours || 0} ชั่วโมง</strong></span>
                            </div>
                            <div style="margin-top: 0.5rem;">
                                ${statusBadge}
                                ${actionButtons}
                            </div>
                        </div>
                    `;
                    hourRequestsList.appendChild(requestItem);
                });
            }

                hourRequestsModal.style.display = 'flex';
            } catch (error) {
                console.error('Error loading hour requests:', error);
                alert('เกิดข้อผิดพลาดในการโหลดข้อมูลการยื่นรับเวลา: ' + error.message);
            }
        }

        function hideHourRequestsModal() {
            hourRequestsModal.style.display = 'none';
        }

        async function approveHourRequest(activityTitle, studentId) {
            try {
                // Get the request ID from the database
                const requests = await getHourRequests(activityTitle);
                const request = requests.find(r => r.studentId === studentId && r.status === 'pending');
                
                if (!request || !request._id) {
                    alert('ไม่พบข้อมูลการยื่นรับเวลา');
                    return;
                }
                
                await apiCall(`/hour-requests/${request._id}/approve`, {
                    method: 'POST'
                });
                
                // Refresh modal
                await showHourRequestsModal(activityTitle);
                
                // Refresh activities list to update badge
                await renderActivities();
                
                alert('อนุมัติการยื่นรับเวลาเรียบร้อยแล้ว');
            } catch (error) {
                console.error('Error approving hour request:', error);
                alert('เกิดข้อผิดพลาดในการอนุมัติ: ' + error.message);
            }
        }

        async function rejectHourRequest(activityTitle, studentId, { allowUndo = false } = {}) {
            if (!allowUndo && !confirm('คุณต้องการไม่อนุมัติการยื่นรับเวลานี้หรือไม่?')) {
                return;
            }
            
            try {
                const requests = await getHourRequests(activityTitle);
                const request = requests.find(r => r.studentId === studentId && r.status === 'pending');
                
                if (!request || !request._id) {
                    alert('ไม่พบข้อมูลการยื่นรับเวลา');
                    return;
                }
                
                await apiCall(`/hour-requests/${request._id}/reject`, {
                    method: 'POST'
                });
                
                await showHourRequestsModal(activityTitle);
                await renderActivities();
                
                if (!allowUndo) {
                    alert('ไม่อนุมัติการยื่นรับเวลาเรียบร้อยแล้ว');
                }
            } catch (error) {
                console.error('Error rejecting hour request:', error);
                alert('เกิดข้อผิดพลาดในการไม่อนุมัติ: ' + error.message);
            }
        }

        async function resetHourRequestStatus(activityTitle, studentId, currentStatus) {
            const message =
                currentStatus === 'approved'
                    ? 'คุณต้องการยกเลิกการอนุมัติและเปลี่ยนสถานะเป็นรอรับเรื่องหรือไม่?'
                    : 'คุณต้องการยกเลิกการไม่อนุมัติและเปลี่ยนสถานะเป็นรอรับเรื่องหรือไม่?';
            if (!confirm(message)) {
                return;
            }
            
            try {
                const requests = await getHourRequests(activityTitle);
                const request = requests.find(r => r.studentId === studentId && r.status === currentStatus);
                
                if (!request || !request._id) {
                    alert('ไม่พบข้อมูลการยื่นรับเวลา');
                    return;
                }
                
                await apiCall(`/hour-requests/${request._id}/reset`, {
                    method: 'POST'
                });
                
                await showHourRequestsModal(activityTitle);
                await renderActivities();
                
                alert('เปลี่ยนสถานะกลับเป็นรอรับเรื่องเรียบร้อยแล้ว');
            } catch (error) {
                console.error('Error resetting hour request status:', error);
                alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ: ' + error.message);
            }
        }

        if (closeHourRequestsModal) {
            closeHourRequestsModal.addEventListener('click', hideHourRequestsModal);
        }
        if (closeHourRequestsBtn) {
            closeHourRequestsBtn.addEventListener('click', hideHourRequestsModal);
        }
        window.addEventListener('click', (event) => {
            if (event.target == hourRequestsModal) {
                hideHourRequestsModal();
            }
        });
        
        // Event delegation for approve/reject buttons inside the modal
        if (hourRequestsModal) {
            hourRequestsModal.addEventListener('click', (e) => {
                console.log('Modal click event:', e.target, e.target.className);
                
                // Handle approve button click
                if (e.target.matches('.approve-request-btn') || e.target.closest('.approve-request-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const btn = e.target.matches('.approve-request-btn') ? e.target : e.target.closest('.approve-request-btn');
                    const activityTitle = btn.getAttribute('data-activity-title');
                    const studentId = btn.getAttribute('data-student-id');
                    console.log('Approve button clicked:', activityTitle, studentId);
                    if (activityTitle && studentId) {
                        approveHourRequest(activityTitle, studentId);
                    } else {
                        console.error('Missing data attributes:', { activityTitle, studentId });
                    }
                    return false;
                }
                
                // Handle reject button click
                if (e.target.matches('.reject-request-btn') || e.target.closest('.reject-request-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const btn = e.target.matches('.reject-request-btn') ? e.target : e.target.closest('.reject-request-btn');
                    const activityTitle = btn.getAttribute('data-activity-title');
                    const studentId = btn.getAttribute('data-student-id');
                    if (activityTitle && studentId) {
                        rejectHourRequest(activityTitle, studentId);
                    } else {
                        console.error('Missing data attributes:', { activityTitle, studentId });
                    }
                    return false;
                }

                if (e.target.matches('.unapprove-request-btn') || e.target.closest('.unapprove-request-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const btn = e.target.matches('.unapprove-request-btn') ? e.target : e.target.closest('.unapprove-request-btn');
                    const activityTitle = btn.getAttribute('data-activity-title');
                    const studentId = btn.getAttribute('data-student-id');
                    const currentStatus = btn.getAttribute('data-current-status');
                    if (activityTitle && studentId && currentStatus) {
                        resetHourRequestStatus(activityTitle, studentId, currentStatus);
                    } else {
                        console.error('Missing data attributes for reset:', { activityTitle, studentId, currentStatus });
                    }
                    return false;
                }
            });
        }

        // --- Edit Activity Modal Logic ---
        const editActivityModal = document.getElementById('edit-activity-modal');
        const closeEditModal = document.getElementById('close-edit-modal');
        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        const editActivityForm = document.getElementById('edit-activity-form');

        async function showEditActivityModal(activityTitle) {
            try {
                const activity = await apiCall(`/activities/${encodeURIComponent(activityTitle)}`);
                
                if (!activity) {
                    alert('ไม่พบกิจกรรม');
                    return;
                }

            // Fill form with current activity data
            document.getElementById('edit-activity-title').value = activity.title;
            document.getElementById('edit-activity-desc').value = activity.desc;
            const editImageNote = document.getElementById('edit-image-note');
            if (editImageNote) {
                editImageNote.textContent = activity.imgUrl
                    ? 'ขณะนี้ใช้รูปกิจกรรมเดิมอยู่ หากต้องการเปลี่ยนให้เลือกไฟล์ใหม่'
                    : 'ยังไม่มีรูปกิจกรรม กรุณาอัปโหลดไฟล์ใหม่';
            }
            const editImageFileInput = document.getElementById('edit-activity-image-file');
            if (editImageFileInput) {
                editImageFileInput.value = '';
            }
            document.getElementById('edit-activity-form-link').value = activity.formLink || '';
            document.getElementById('edit-activity-hours').value = activity.hours;
            document.getElementById('edit-activity-slots').value = activity.slots;
            document.getElementById('edit-activity-date').value = activity.date || '';
            document.getElementById('edit-activity-time').value = activity.time || '';
            document.getElementById('edit-activity-location').value = activity.location || '';
            document.getElementById('edit-activity-lat').value = activity.lat || '';
            document.getElementById('edit-activity-lng').value = activity.lng || '';
            document.getElementById('edit-activity-original-title').value = activity.title;
            const editCurrentImg = document.getElementById('edit-activity-current-img');
            if (editCurrentImg) {
                editCurrentImg.value = activity.imgUrl || '';
            }

            // Update map if lat/lng exists
            if (activity.lat && activity.lng && editMap) {
                const lat = parseFloat(activity.lat);
                const lng = parseFloat(activity.lng);
                editMap.setView([lat, lng], 15);
                if (editMarker) {
                    editMarker.setLatLng([lat, lng]);
                }
                document.getElementById('edit-activity-lat-input').value = lat;
                document.getElementById('edit-activity-lng-input').value = lng;
            }

                editActivityModal.style.display = 'flex';
            } catch (error) {
                console.error('Error loading activity for edit:', error);
                alert('เกิดข้อผิดพลาดในการโหลดข้อมูลกิจกรรม: ' + error.message);
            }
        }

        function hideEditActivityModal() {
            editActivityModal.style.display = 'none';
            editActivityForm.reset();
        }

        if (closeEditModal) {
            closeEditModal.addEventListener('click', hideEditActivityModal);
        }
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', hideEditActivityModal);
        }
        window.addEventListener('click', (event) => {
            if (event.target == editActivityModal) {
                hideEditActivityModal();
            }
        });

        // Handle delete activity
        const deleteActivityBtn = document.getElementById('delete-activity-btn');
        if (deleteActivityBtn) {
            deleteActivityBtn.addEventListener('click', async () => {
                const originalTitle = document.getElementById('edit-activity-original-title').value;
                
                if (!originalTitle) {
                    alert('ไม่พบกิจกรรมที่ต้องการลบ');
                    return;
                }

                // Confirmation dialog
                const confirmMessage = `คุณแน่ใจหรือไม่ว่าต้องการลบกิจกรรม "${originalTitle}"?\n\nการลบนี้จะลบข้อมูลทั้งหมดรวมถึงรายชื่อผู้เข้าร่วมด้วย\n\nกด "ตกลง" เพื่อยืนยันการลบ หรือ "ยกเลิก" เพื่อยกเลิก`;
                
                if (!confirm(confirmMessage)) {
                    return; // User cancelled
                }

                try {
                    // Delete activity via API (this will also delete related participants and hour requests on the server)
                    await apiCall(`/activities/${encodeURIComponent(originalTitle)}`, {
                        method: 'DELETE'
                    });

                    // Re-render activities
                    await renderActivities();
                    
                    // Close modal
                    hideEditActivityModal();
                    
                    alert('ลบกิจกรรมสำเร็จ');
                } catch (error) {
                    console.error('Error deleting activity:', error);
                    alert('เกิดข้อผิดพลาดในการลบกิจกรรม: ' + error.message);
                }
            });
        }

        // Handle edit form submission
        if (editActivityForm) {
            editActivityForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const originalTitle = document.getElementById('edit-activity-original-title').value;
                const newTitle = document.getElementById('edit-activity-title').value;

                let imageValue = '';
                try {
                    imageValue = await getImageFileData('edit-activity-image-file');
                } catch (error) {
                    alert(error.message);
                    return;
                }

                if (!imageValue) {
                    const currentImg = document.getElementById('edit-activity-current-img');
                    imageValue = currentImg ? currentImg.value : '';
                }

                if (!imageValue) {
                    alert('กรุณาอัปโหลดรูปภาพกิจกรรม');
                    return;
                }

                // Update activity data
                const updatedActivity = {
                    title: newTitle,
                    desc: document.getElementById('edit-activity-desc').value,
                    imgUrl: imageValue,
                    formLink: document.getElementById('edit-activity-form-link').value,
                    hours: parseInt(document.getElementById('edit-activity-hours').value) || 0,
                    slots: parseInt(document.getElementById('edit-activity-slots').value) || 10,
                    date: document.getElementById('edit-activity-date').value,
                    time: document.getElementById('edit-activity-time').value,
                    location: document.getElementById('edit-activity-location').value,
                    lat: parseFloat(document.getElementById('edit-activity-lat').value) || null,
                    lng: parseFloat(document.getElementById('edit-activity-lng').value) || null
                };

                try {
                    await apiCall(`/activities/${encodeURIComponent(originalTitle)}`, {
                        method: 'PUT',
                        body: JSON.stringify(updatedActivity)
                    });

                    await renderActivities();
                    hideEditActivityModal();
                    
                    alert('แก้ไขข้อมูลกิจกรรมสำเร็จ');
                } catch (error) {
                    console.error('Error updating activity:', error);
                    alert('เกิดข้อผิดพลาดในการแก้ไขกิจกรรม: ' + error.message);
                }
            });
        }

        // --- Event Delegation for buttons on activity cards ---
        activityGrid.addEventListener('click', async (e) => {
            const title = e.target.closest('[data-title]')?.dataset.title || e.target.dataset.title;

            // Handle "View Participants" click
            if (e.target.matches('.view-participants-btn') || e.target.closest('.view-participants-btn')) {
                const btn = e.target.matches('.view-participants-btn') ? e.target : e.target.closest('.view-participants-btn');
                const activityTitle = btn.dataset.title;
                showParticipantsModal(activityTitle);
            }

            // Handle "View Hour Requests" click
            if (e.target.matches('.view-hour-requests-btn') || e.target.closest('.view-hour-requests-btn')) {
                const btn = e.target.matches('.view-hour-requests-btn') ? e.target : e.target.closest('.view-hour-requests-btn');
                const activityTitle = btn.dataset.title;
                showHourRequestsModal(activityTitle);
            }

            // Handle "Edit Activity" click
            if (e.target.matches('.edit-activity-btn') || e.target.closest('.edit-activity-btn')) {
                const btn = e.target.matches('.edit-activity-btn') ? e.target : e.target.closest('.edit-activity-btn');
                const activityTitle = btn.dataset.title;
                showEditActivityModal(activityTitle);
            }
            
            // Handle "Archive Activity" click
            if (e.target.matches('.archive-activity-btn') || e.target.closest('.archive-activity-btn')) {
                const btn = e.target.matches('.archive-activity-btn') ? e.target : e.target.closest('.archive-activity-btn');
                const activityTitle = btn.dataset.title;
                archiveActivity(activityTitle);
            }
            
            // Handle "Confirm Completion" click (removed - no longer using localStorage for pending activities)
            // This functionality should be handled through the database if needed
        });
    }

    async function renderReportsView(force = false) {
        if (!contentViews.reports || !reportsTableBody) return;
        if (reportsLoading) return;
        if (reportsDataCache.length && !force) {
            updateReportsSummary(reportsDataCache);
            updateReportsTable(reportsDataCache);
            return;
        }
        reportsLoading = true;
        reportsTableBody.innerHTML = '<tr><td colspan="6" class="table-placeholder">กำลังโหลดรายงาน...</td></tr>';
        try {
            const activities = await getActivitiesFromAPI({ includeArchived: true, showAll: true });
            const participantsList = await Promise.all(
                activities.map(activity => getActivityParticipants(activity.title))
            );
            reportsDataCache = activities.map((activity, index) => {
                const participantCount = participantsList[index]?.length || 0;
                return {
                    id: activity._id || activity.title,
                    title: activity.title,
                    dateDisplay: formatDateDisplay(activity.date, activity.time),
                    hours: activity.hours || 0,
                    slots: activity.slots || 0,
                    participants: participantCount,
                    status: activity.isArchived ? 'เก็บไว้' : 'เปิดรับ'
                };
            });
            updateReportsSummary(reportsDataCache);
            updateReportsTable(reportsDataCache);
            if (reportsSummaryText) {
                reportsSummaryText.textContent = `อัปเดตล่าสุด: ${new Date().toLocaleString('th-TH')}`;
            }
        } catch (error) {
            console.error('Error loading reports:', error);
            reportsTableBody.innerHTML = `<tr><td colspan="6" class="table-placeholder">${error.message}</td></tr>`;
        } finally {
            reportsLoading = false;
        }
    }

    function updateReportsSummary(rows = []) {
        const totalActivities = rows.length;
        const totalHours = rows.reduce((sum, row) => sum + (row.hours || 0), 0);
        const totalParticipants = rows.reduce((sum, row) => sum + (row.participants || 0), 0);
        if (reportsTotalActivities) reportsTotalActivities.textContent = totalActivities;
        if (reportsTotalHours) reportsTotalHours.textContent = totalHours;
        if (reportsTotalParticipants) reportsTotalParticipants.textContent = totalParticipants;
    }

    function updateReportsTable(rows = []) {
        if (!reportsTableBody) return;
        if (!rows.length) {
            reportsTableBody.innerHTML = '<tr><td colspan="6" class="table-placeholder">ไม่พบรายการกิจกรรม</td></tr>';
            return;
        }
        reportsTableBody.innerHTML = rows.map(row => `
            <tr>
                <td>${row.title}</td>
                <td>${row.dateDisplay || '-'}</td>
                <td>${row.hours || 0}</td>
                <td>${row.slots || '-'}</td>
                <td>${row.participants}</td>
                <td><span class="badge ${row.status === 'เปิดรับ' ? 'badge-success' : 'badge-warning'}">${row.status}</span></td>
            </tr>
        `).join('');
    }

    function filterReportsTable(keyword = '') {
        if (!reportsDataCache.length) return;
        const normalized = keyword.toLowerCase();
        const filtered = reportsDataCache.filter(row =>
            row.title.toLowerCase().includes(normalized)
        );
        updateReportsTable(filtered);
    }

    async function renderStudentsView(force = false) {
        if (!contentViews.students || !studentsTableBody) return;
        if (studentsLoading) return;
        if (studentsSummaryCache.length && !force) {
            updateStudentsSummaryCards(studentsSummaryCache);
            updateStudentsTable(studentsSummaryCache);
            return;
        }
        studentsLoading = true;
        studentsTableBody.innerHTML = '<tr><td colspan="6" class="table-placeholder">กำลังโหลดรายชื่อนักศึกษา...</td></tr>';
        try {
            const summary = await apiCall('/students/summary');
            studentsSummaryCache = summary;
            updateStudentsSummaryCards(summary);
            updateStudentsTable(summary);
        } catch (error) {
            console.error('Error loading students:', error);
            studentsTableBody.innerHTML = `<tr><td colspan="6" class="table-placeholder">${error.message}</td></tr>`;
        } finally {
            studentsLoading = false;
        }
    }

    function updateStudentsSummaryCards(data = []) {
        const totalStudents = data.length;
        const totalHours = data.reduce((sum, item) => sum + (item.totalHours || 0), 0);
        const totalActivities = data.reduce((sum, item) => sum + (item.activityCount || 0), 0);
        if (studentsTotalCountEl) studentsTotalCountEl.textContent = totalStudents;
        if (studentsTotalHoursEl) studentsTotalHoursEl.textContent = totalHours;
        if (studentsTotalActivitiesEl) studentsTotalActivitiesEl.textContent = totalActivities;
    }

    function updateStudentsTable(data = []) {
        if (!studentsTableBody) return;
        if (!data.length) {
            studentsTableBody.innerHTML = '<tr><td colspan="6" class="table-placeholder">ไม่พบนักศึกษา</td></tr>';
            return;
        }
        studentsTableBody.innerHTML = data.map(student => `
            <tr>
                <td>
                    <div class="student-name">${student.name}</div>
                    <small>${student.faculty || '-'} • ${student.major || '-'}</small>
                </td>
                <td>${student.studentId}</td>
                <td><span class="badge ${getScholarshipBadgeClass(student.scholarshipType)}">${student.scholarshipType || 'ทั่วไป'}</span></td>
                <td>${student.totalHours || 0} ชม.</td>
                <td>${student.activityCount || 0} ครั้ง</td>
                <td>
                    <button class="students-detail-btn" data-student-id="${student.studentId}">
                        <i class="fas fa-eye"></i> รายละเอียด
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function filterStudentsTable(keyword = '') {
        if (!studentsSummaryCache.length) return;
        const normalized = keyword.toLowerCase();
        const filtered = studentsSummaryCache.filter(student =>
            student.name.toLowerCase().includes(normalized) ||
            student.studentId.toLowerCase().includes(normalized)
        );
        updateStudentsTable(filtered);
    }

    if (studentsTableBody) {
        studentsTableBody.addEventListener('click', (event) => {
            const btn = event.target.closest('.students-detail-btn');
            if (btn) {
                showStudentDetail(btn.dataset.studentId);
            }
        });
    }

    function showStudentDetail(studentId) {
        if (!studentDetailModal) return;
        const student = studentsSummaryCache.find(item => item.studentId === studentId);
        if (!student) return;
        if (studentDetailName) studentDetailName.textContent = student.name;
        if (studentDetailInfo) {
            studentDetailInfo.textContent = `รหัสนักศึกษา: ${student.studentId} • สถานะทุน: ${student.scholarshipType || 'ทั่วไป'}`;
        }
        if (studentDetailTableBody) {
            if (!student.activities || !student.activities.length) {
                studentDetailTableBody.innerHTML = '<tr><td colspan="3" class="table-placeholder">ยังไม่มีกิจกรรมที่เข้าร่วม</td></tr>';
            } else {
                studentDetailTableBody.innerHTML = student.activities.map(activity => `
                    <tr>
                        <td>${activity.title}</td>
                        <td>${activity.hours || 0} ชม.</td>
                        <td>${formatDateDisplay(activity.date, activity.time) || '-'}</td>
                    </tr>
                `).join('');
            }
        }
        studentDetailModal.style.display = 'flex';
    }

    function hideStudentDetailModal() {
        if (studentDetailModal) {
            studentDetailModal.style.display = 'none';
        }
    }

    function getScholarshipBadgeClass(type = '') {
        if (!type) return 'badge-primary';
        const normalized = type.toLowerCase();
        if (normalized.includes('กยศ')) return 'badge-warning';
        if (normalized.includes('ทุน')) return 'badge-success';
        return 'badge-primary';
    }

    function formatDateDisplay(dateStr, timeStr) {
        if (!dateStr) return '';
        try {
            const dateObj = new Date(`${dateStr}T00:00:00`);
            if (Number.isNaN(dateObj.getTime())) return dateStr;
            const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
            const dateText = `${dateObj.getDate()} ${thaiMonths[dateObj.getMonth()]} ${dateObj.getFullYear() + 543}`;
            if (timeStr) {
                return `${dateText} เวลา ${timeStr}`;
            }
            return dateText;
        } catch (error) {
            return dateStr;
        }
    }

    // --- Details Page Logic (details.html) ---
    // Removed localStorage usage - details page should use API if needed
    const submitCompletionBtn = document.getElementById('submit-completion-btn');
    if (submitCompletionBtn) {
        // This functionality should be implemented using API if needed
        console.warn('Details page logic needs to be updated to use API instead of localStorage');
    }

    // --- Form Link Editing Logic (details.html) ---
    // Removed localStorage usage - form link editing should use API
    const editLinkBtn = document.getElementById('edit-link-btn');
    if (editLinkBtn) {
        // This functionality should be implemented using API if needed
        console.warn('Form link editing logic needs to be updated to use API instead of localStorage');
    }

});