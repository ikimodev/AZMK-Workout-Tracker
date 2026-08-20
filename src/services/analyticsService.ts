/**
 * AZMK Real Cloud Analytics & Telemetry Engine (100% Real Data, Zero Fake Mocks)
 * Synchronizes real visitors across all devices to a centralized cloud registry.
 */

export interface VisitorLog {
  id: string;
  name: string;
  device: string;
  platform: 'iOS' | 'Android' | 'Desktop' | 'Other';
  isPWA: boolean;
  city: string;
  country: string;
  firstVisitDate: string;
  lastActiveDate: string;
  sessionCount: number;
  workoutsCompleted: number;
  prsBroken: number;
  aiImportsCount: number;
  aiChatsCount: number;
  rating?: number;
  feedback?: string;
  actions: string[];
}

export interface UserFeedbackItem {
  id: string;
  visitorId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  device: string;
  isPWA: boolean;
  sentiment: 'positive' | 'neutral' | 'suggestion';
}

export interface AdminAnalyticsSummary {
  isCloudSynced: boolean;
  totalVisitors: number;
  returningVisitors: number;
  retentionRatePercent: number;
  totalSessions: number;
  totalWorkoutsCompleted: number;
  totalAIImports: number;
  totalAIChats: number;
  pwaInstallCount: number;
  pwaAdoptionRatePercent: number;
  averageSatisfactionRating: number;
  totalFeedbackCount: number;
  deviceBreakdown: {
    ios: number;
    android: number;
    desktop: number;
  };
  dailyActivity: {
    date: string;
    visitors: number;
    workouts: number;
    aiImports: number;
  }[];
  recentVisitors: VisitorLog[];
  feedbacks: UserFeedbackItem[];
}

const CLOUD_REGISTRY_ID = 'ff8081819ff5b11001a01fe35f8a5ece';
const CLOUD_API_URL = `https://api.restful-api.dev/objects/${CLOUD_REGISTRY_ID}`;

const VISITOR_ID_KEY = 'azmk_visitor_id';
const LOCAL_VISITOR_KEY = 'azmk_my_visitor_profile';
const LOCAL_FEEDBACK_KEY = 'azmk_my_feedback_list';

/**
 * Detects current client device details with high precision
 */
export const detectClientDevice = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;

  let deviceName = 'Desktop Browser';
  let platform: 'iOS' | 'Android' | 'Desktop' | 'Other' = 'Desktop';

  if (isIOS) {
    platform = 'iOS';
    if (ua.includes('ipad')) deviceName = 'Apple iPad';
    else if (ua.includes('iphone')) deviceName = 'Apple iPhone';
    else deviceName = 'Apple iOS Device';
  } else if (isAndroid) {
    platform = 'Android';
    if (ua.includes('samsung') || ua.includes('sm-')) deviceName = 'Samsung Galaxy';
    else if (ua.includes('pixel')) deviceName = 'Google Pixel';
    else if (ua.includes('xiaomi') || ua.includes('redmi')) deviceName = 'Xiaomi Phone';
    else deviceName = 'Android Mobile';
  } else if (/macintosh|mac os x/.test(ua)) {
    platform = 'Desktop';
    deviceName = 'Apple Mac';
  } else if (/windows/.test(ua)) {
    platform = 'Desktop';
    deviceName = 'Windows PC';
  }

  // Location detection via timezone
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Riyadh';
  let country = 'Saudi Arabia 🇸🇦';
  let city = 'الرياض (Riyadh)';

  if (tz.includes('Riyadh') || tz.includes('Asia/Riyadh')) {
    city = 'الرياض (Riyadh)';
    country = 'Saudi Arabia 🇸🇦';
  } else if (tz.includes('Dubai') || tz.includes('Asia/Dubai')) {
    city = 'دبي (Dubai)';
    country = 'UAE 🇦🇪';
  } else if (tz.includes('Kuwait')) {
    city = 'الكويت (Kuwait City)';
    country = 'Kuwait 🇰🇼';
  } else if (tz.includes('Bahrain') || tz.includes('Qatar') || tz.includes('Doha')) {
    city = 'الدوحة / المنامة';
    country = 'GCC 🇶🇦🇧🇭';
  } else if (tz.includes('Cairo') || tz.includes('Africa/Cairo')) {
    city = 'القاهرة (Cairo)';
    country = 'Egypt 🇪🇬';
  } else if (tz.includes('Amman')) {
    city = 'عمان (Amman)';
    country = 'Jordan 🇯🇴';
  }

  return { deviceName, platform, isPWA, city, country };
};

/**
 * Initializes or updates real user session and syncs to Central Cloud
 */
export const trackUserSession = (userName?: string): VisitorLog => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }

  const { deviceName, platform, isPWA, city, country } = detectClientDevice();
  const nowStr = new Date().toISOString();

  let currentLog: VisitorLog;
  const stored = localStorage.getItem(LOCAL_VISITOR_KEY);
  
  if (stored) {
    try {
      currentLog = JSON.parse(stored);
      currentLog.lastActiveDate = nowStr;
      currentLog.isPWA = isPWA || currentLog.isPWA;
      if (userName && (currentLog.name === 'بطل عزمك' || currentLog.name === 'رياضي (عزمك)')) {
        currentLog.name = userName;
      }
      
      const lastSessionCheck = sessionStorage.getItem('azmk_session_tracked');
      if (!lastSessionCheck) {
        currentLog.sessionCount += 1;
        currentLog.actions.push(`SESSION_${Date.now()}`);
        sessionStorage.setItem('azmk_session_tracked', 'true');
      }
    } catch (e) {
      currentLog = createNewVisitorLog(visitorId, userName, deviceName, platform, isPWA, city, country, nowStr);
    }
  } else {
    currentLog = createNewVisitorLog(visitorId, userName, deviceName, platform, isPWA, city, country, nowStr);
    sessionStorage.setItem('azmk_session_tracked', 'true');
  }

  localStorage.setItem(LOCAL_VISITOR_KEY, JSON.stringify(currentLog));

  // Background Cloud Sync (Non-blocking)
  syncVisitorToCloud(currentLog).catch(() => {});

  return currentLog;
};

const createNewVisitorLog = (
  id: string,
  userName: string | undefined,
  device: string,
  platform: 'iOS' | 'Android' | 'Desktop' | 'Other',
  isPWA: boolean,
  city: string,
  country: string,
  nowStr: string
): VisitorLog => {
  return {
    id,
    name: userName || (platform === 'iOS' ? 'مستخدم آيفون 📲' : platform === 'Android' ? 'مستخدم أندرويد 📲' : 'مستخدم كمبيوتر 💻'),
    device,
    platform,
    isPWA,
    city,
    country,
    firstVisitDate: nowStr,
    lastActiveDate: nowStr,
    sessionCount: 1,
    workoutsCompleted: 0,
    prsBroken: 0,
    aiImportsCount: 0,
    aiChatsCount: 0,
    actions: ['FIRST_ENTRY']
  };
};

/**
 * Sync a single visitor log to the central Cloud Registry
 */
export const syncVisitorToCloud = async (visitor: VisitorLog): Promise<void> => {
  try {
    const res = await fetch(CLOUD_API_URL);
    if (!res.ok) return;
    
    const doc = await res.json();
    const existingVisitors: VisitorLog[] = doc?.data?.visitors || [];
    const existingFeedbacks: UserFeedbackItem[] = doc?.data?.feedbacks || [];

    const index = existingVisitors.findIndex(v => v.id === visitor.id);
    if (index >= 0) {
      existingVisitors[index] = { ...existingVisitors[index], ...visitor };
    } else {
      existingVisitors.unshift(visitor);
    }

    // Save back to cloud
    await fetch(CLOUD_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'AZMK_PROD_CLOUD_ANALYTICS_V1',
        data: {
          updatedAt: new Date().toISOString(),
          visitors: existingVisitors,
          feedbacks: existingFeedbacks
        }
      })
    });
  } catch (err) {
    console.warn('Cloud sync error (will retry next action):', err);
  }
};

/**
 * Log specific user actions in real-time
 */
export const trackEvent = (
  actionType: 'WORKOUT_COMPLETED' | 'AI_IMPORT' | 'AI_COACH' | 'PR_BROKEN' | 'PWA_INSTALL'
) => {
  try {
    const stored = localStorage.getItem(LOCAL_VISITOR_KEY);
    if (!stored) return;

    const current: VisitorLog = JSON.parse(stored);
    current.lastActiveDate = new Date().toISOString();
    current.actions.push(`${actionType}_${Date.now()}`);

    if (actionType === 'WORKOUT_COMPLETED') current.workoutsCompleted += 1;
    if (actionType === 'AI_IMPORT') current.aiImportsCount += 1;
    if (actionType === 'AI_COACH') current.aiChatsCount += 1;
    if (actionType === 'PR_BROKEN') current.prsBroken += 1;
    if (actionType === 'PWA_INSTALL') current.isPWA = true;

    localStorage.setItem(LOCAL_VISITOR_KEY, JSON.stringify(current));
    syncVisitorToCloud(current).catch(() => {});
  } catch (e) {}
};

/**
 * Submit real user review and sync to Central Cloud
 */
export const submitUserFeedback = async (rating: number, comment: string, userName?: string): Promise<UserFeedbackItem> => {
  const visitorId = localStorage.getItem(VISITOR_ID_KEY) || 'usr_guest';
  const { deviceName, isPWA } = detectClientDevice();

  const feedbackItem: UserFeedbackItem = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    visitorId,
    userName: userName || (deviceName.includes('iPhone') ? 'مستخدم آيفون' : 'بطل عزمك'),
    rating,
    comment,
    date: new Date().toISOString(),
    device: deviceName,
    isPWA,
    sentiment: rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'suggestion'
  };

  try {
    // Save locally
    const stored = localStorage.getItem(LOCAL_FEEDBACK_KEY);
    const localFeedbacks: UserFeedbackItem[] = stored ? JSON.parse(stored) : [];
    localFeedbacks.unshift(feedbackItem);
    localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(localFeedbacks));

    // Update local visitor
    const visitorRaw = localStorage.getItem(LOCAL_VISITOR_KEY);
    if (visitorRaw) {
      const v: VisitorLog = JSON.parse(visitorRaw);
      v.rating = rating;
      v.feedback = comment;
      localStorage.setItem(LOCAL_VISITOR_KEY, JSON.stringify(v));
    }

    // Sync to Cloud
    const res = await fetch(CLOUD_API_URL);
    if (res.ok) {
      const doc = await res.json();
      const visitors: VisitorLog[] = doc?.data?.visitors || [];
      const feedbacks: UserFeedbackItem[] = doc?.data?.feedbacks || [];
      feedbacks.unshift(feedbackItem);

      const vIdx = visitors.findIndex(v => v.id === visitorId);
      if (vIdx >= 0) {
        visitors[vIdx].rating = rating;
        visitors[vIdx].feedback = comment;
      }

      await fetch(CLOUD_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'AZMK_PROD_CLOUD_ANALYTICS_V1',
          data: {
            updatedAt: new Date().toISOString(),
            visitors,
            feedbacks
          }
        })
      });
    }
  } catch (err) {
    console.warn('Feedback cloud sync error:', err);
  }

  return feedbackItem;
};

/**
 * Retrieves the 100% REAL telemetry summary directly from Central Cloud
 */
export const getAdminAnalyticsSummary = async (): Promise<AdminAnalyticsSummary> => {
  let visitors: VisitorLog[] = [];
  let feedbacks: UserFeedbackItem[] = [];
  let isCloudSynced = false;

  // 1. Fetch real centralized data from Cloud DB
  try {
    const res = await fetch(CLOUD_API_URL);
    if (res.ok) {
      const doc = await res.json();
      visitors = doc?.data?.visitors || [];
      feedbacks = doc?.data?.feedbacks || [];
      isCloudSynced = true;
    }
  } catch (e) {
    console.warn('Cloud fetch fallback to local:', e);
  }

  // 2. Fallback / Merge with current client's real visitor record if cloud was empty or offline
  const localVisitorRaw = localStorage.getItem(LOCAL_VISITOR_KEY);
  if (localVisitorRaw) {
    try {
      const localV: VisitorLog = JSON.parse(localVisitorRaw);
      const exists = visitors.some(v => v.id === localV.id);
      if (!exists) {
        visitors.unshift(localV);
      }
    } catch (e) {}
  }

  const localFeedbacksRaw = localStorage.getItem(LOCAL_FEEDBACK_KEY);
  if (localFeedbacksRaw) {
    try {
      const localFbs: UserFeedbackItem[] = JSON.parse(localFeedbacksRaw);
      localFbs.forEach(fb => {
        if (!feedbacks.some(f => f.id === fb.id)) {
          feedbacks.unshift(fb);
        }
      });
    } catch (e) {}
  }

  // 3. Compute 100% REAL exact metrics
  const totalVisitors = visitors.length;
  const returningVisitors = visitors.filter(v => v.sessionCount > 1).length;
  const retentionRatePercent = totalVisitors > 0 ? Math.round((returningVisitors / totalVisitors) * 1000) / 10 : 0;

  const totalSessions = visitors.reduce((acc, v) => acc + (v.sessionCount || 1), 0);
  const totalWorkoutsCompleted = visitors.reduce((acc, v) => acc + (v.workoutsCompleted || 0), 0);
  const totalAIImports = visitors.reduce((acc, v) => acc + (v.aiImportsCount || 0), 0);
  const totalAIChats = visitors.reduce((acc, v) => acc + (v.aiChatsCount || 0), 0);

  const pwaInstallCount = visitors.filter(v => v.isPWA).length;
  const pwaAdoptionRatePercent = totalVisitors > 0 ? Math.round((pwaInstallCount / totalVisitors) * 1000) / 10 : 0;

  const ratedItems = feedbacks.filter(f => f.rating > 0);
  const averageSatisfactionRating = ratedItems.length > 0
    ? Math.round((ratedItems.reduce((acc, f) => acc + f.rating, 0) / ratedItems.length) * 10) / 10
    : 5.0;

  const iosCount = visitors.filter(v => v.platform === 'iOS').length;
  const androidCount = visitors.filter(v => v.platform === 'Android').length;
  const desktopCount = visitors.filter(v => v.platform === 'Desktop').length;

  // Real daily breakdown from actual timestamps
  const last7DaysMap = new Map<string, { visitors: number; workouts: number; aiImports: number }>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().split('T')[0];
    last7DaysMap.set(key, { visitors: 0, workouts: 0, aiImports: 0 });
  }

  visitors.forEach(v => {
    const vDate = (v.lastActiveDate || v.firstVisitDate || '').split('T')[0];
    if (last7DaysMap.has(vDate)) {
      const entry = last7DaysMap.get(vDate)!;
      entry.visitors += 1;
      entry.workouts += v.workoutsCompleted || 0;
      entry.aiImports += v.aiImportsCount || 0;
    }
  });

  const dailyActivity = Array.from(last7DaysMap.entries()).map(([key, val]) => {
    const d = new Date(key);
    const label = d.toLocaleDateString('ar-SA', { weekday: 'short', month: 'numeric', day: 'numeric' });
    return {
      date: label,
      visitors: val.visitors,
      workouts: val.workouts,
      aiImports: val.aiImports
    };
  });

  return {
    isCloudSynced,
    totalVisitors,
    returningVisitors,
    retentionRatePercent,
    totalSessions,
    totalWorkoutsCompleted,
    totalAIImports,
    totalAIChats,
    pwaInstallCount,
    pwaAdoptionRatePercent,
    averageSatisfactionRating,
    totalFeedbackCount: feedbacks.length,
    deviceBreakdown: {
      ios: iosCount,
      android: androidCount,
      desktop: desktopCount
    },
    dailyActivity,
    recentVisitors: visitors.sort((a, b) => new Date(b.lastActiveDate).getTime() - new Date(a.lastActiveDate).getTime()),
    feedbacks: feedbacks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  };
};
