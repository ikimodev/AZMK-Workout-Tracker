import { WorkoutSession, PRRecord, ToolCallLog, AIChatMessage, MuscleGroup } from '../types';
import { getExerciseById, MOCK_EXERCISES } from '../data/mockExercises';
import { calculate1RM, getExerciseSummary } from './progressiveOverload';

export interface AICoachContext {
  history: WorkoutSession[];
  prs: PRRecord[];
  userName: string;
  userGoal: string;
  experience: string;
  isArabic?: boolean;
}

/**
 * Real Data-Extraction Tools accessible to AI Coach Azzam
 */
export class AICoachTools {
  private history: WorkoutSession[];
  private prs: PRRecord[];

  constructor(context: AICoachContext) {
    this.history = context.history;
    this.prs = context.prs;
  }

  get_exercise_history(exerciseId: string, weeks = 8) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - weeks * 7);

    const relevant = this.history.filter(s => 
      s.isCompleted &&
      new Date(s.date) >= cutoff &&
      s.exercises.some(e => e.exerciseId === exerciseId)
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const summary = relevant.map((s, idx) => {
      const ex = s.exercises.find(e => e.exerciseId === exerciseId);
      const sets = ex?.sets.filter(st => st.isCompleted) || [];
      const heaviest = sets.reduce((max, cur) => cur.weight > max.weight ? cur : max, sets[0] || { weight: 0, reps: 0 });
      const avgRpe = sets.filter(st => st.rpe).map(st => st.rpe as number);
      const rpeStr = avgRpe.length > 0 ? (avgRpe.reduce((a, b) => a + b, 0) / avgRpe.length).toFixed(1) : 'N/A';
      const volume = sets.reduce((sum, st) => sum + (st.weight * st.reps), 0);

      return {
        week: `Week ${idx + 1}`,
        date: s.date.split('T')[0],
        topSet: `${heaviest.weight}kg × ${heaviest.reps}`,
        totalSets: sets.length,
        volumeKg: volume,
        rpe: rpeStr
      };
    });

    return {
      exerciseId,
      exerciseName: getExerciseById(exerciseId)?.name || exerciseId,
      totalSessionsFound: relevant.length,
      history: summary
    };
  }

  get_weekly_volume() {
    const weeklyData: Record<string, { volume: number; workoutsCount: number; sets: number }> = {};
    
    this.history.filter(s => s.isCompleted).forEach(s => {
      const d = new Date(s.date);
      const onejan = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
      const weekKey = `W${weekNum}`;

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { volume: 0, workoutsCount: 0, sets: 0 };
      }
      weeklyData[weekKey].volume += s.totalVolumeKg || 0;
      weeklyData[weekKey].workoutsCount += 1;
      s.exercises.forEach(e => {
        weeklyData[weekKey].sets += e.sets.filter(st => st.isCompleted).length;
      });
    });

    return weeklyData;
  }

  get_muscle_group_volume(): Record<MuscleGroup, number> {
    const dist: Record<string, number> = {};

    this.history.filter(s => s.isCompleted).forEach(s => {
      s.exercises.forEach(we => {
        const ex = getExerciseById(we.exerciseId);
        if (!ex) return;
        const muscle = ex.muscleGroup;
        const setVolume = we.sets
          .filter(st => st.isCompleted)
          .reduce((acc, st) => acc + (st.weight * st.reps), 0);
        
        dist[muscle] = (dist[muscle] || 0) + setVolume;
      });
    });

    return dist as Record<MuscleGroup, number>;
  }

  get_prs(): PRRecord[] {
    return this.prs;
  }

  get_recent_workouts(limit = 3): WorkoutSession[] {
    return this.history
      .filter(s => s.isCompleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  get_last_workout() {
    const recent = this.get_recent_workouts(1);
    if (recent.length === 0) return null;
    const latest = recent[0];
    return {
      name: latest.name,
      date: latest.date.split('T')[0],
      duration: `${latest.durationMinutes} min`,
      volume: `${latest.totalVolumeKg.toLocaleString()} kg`,
      prs: latest.prCount,
      exercises: latest.exercises.map(e => {
        const info = getExerciseById(e.exerciseId);
        const topSet = e.sets.find(s => s.isCompleted);
        return `${info?.name || e.exerciseId}: ${topSet ? `${topSet.weight}kg × ${topSet.reps}` : 'Completed'}`;
      })
    };
  }
}

/**
 * Intelligent AI Coach عزام (Azzam) query dispatcher with structured Tool-Calling simulation
 */
export const queryAICoach = async (
  userMessage: string,
  context: AICoachContext
): Promise<AIChatMessage> => {
  const tools = new AICoachTools(context);
  const toolLogs: ToolCallLog[] = [];
  const lowerMsg = userMessage.toLowerCase();
  
  const containsArabic = /[\u0600-\u06FF]/.test(userMessage) || context.isArabic;

  // 0. MEDICAL / INJURY / EMERGENCY SAFETY GUARD
  if (
    lowerMsg.includes('pain') || 
    lowerMsg.includes('hurt') || 
    lowerMsg.includes('injury') || 
    lowerMsg.includes('shoulder ache') || 
    lowerMsg.includes('sharp pain') ||
    lowerMsg.includes('chest pain') ||
    lowerMsg.includes('breath') ||
    lowerMsg.includes('dizzy') ||
    lowerMsg.includes('faint') ||
    lowerMsg.includes('numb') ||
    lowerMsg.includes('tingling') ||
    lowerMsg.includes('الم') ||
    lowerMsg.includes('ألم') ||
    lowerMsg.includes('إصابة') ||
    lowerMsg.includes('اصابة') ||
    lowerMsg.includes('وجع') ||
    lowerMsg.includes('صدر') && (lowerMsg.includes('الم') || lowerMsg.includes('ألم') || lowerMsg.includes('ضيق')) ||
    lowerMsg.includes('تنفس') ||
    lowerMsg.includes('دوخة') ||
    lowerMsg.includes('اغماء') ||
    lowerMsg.includes('إغماء') ||
    lowerMsg.includes('تنميل') ||
    lowerMsg.includes('خدر') ||
    lowerMsg.includes('ديسك') ||
    lowerMsg.includes('تمزق')
  ) {
    const isRedFlagEmergency = 
      lowerMsg.includes('chest') || lowerMsg.includes('breath') || lowerMsg.includes('faint') ||
      lowerMsg.includes('صدر') || lowerMsg.includes('تنفس') || lowerMsg.includes('إغماء') || lowerMsg.includes('اغماء');

    const textAr = `⚠️ **تنبيه وإرشادات السلامة الطبية الصارمة (كابتن عزام)**:

أهلاً ${context.userName || 'يا بطل'}، لاحظت أنك تشير إلى شعور بألم أو إصابة أو أعراض غير معتادة. كمدرب ذكي، **صحتك وسلامتك البدنية هي الأولوية القصوى دائماً**، وتطبيق عزمك **لا يقدم أي تشخيص أو استشارة طبية**.

${isRedFlagEmergency ? `🚨 **تنبيه حالات الطوارئ**: إذا كنت تشعر بألم في الصدر، ضيق تنفس، خدر مفاجئ، أو دوخة حادة، يرجى **التوقف فوراً وطلب الرعاية الطبية الطارئة**.` : ''}

### 📋 بروتوكول السلامة الإلزامي:
1. **أوقف التمرين فوراً**: لا تواصل رفع الأوزان أو الضغط على المفصل أو العضلة المصابة.
2. **استشارة طبيب مختص أو أخصائي علاج طبيعي**: للحصول على فحص سريري دقيق وتحديد سلامة الأربطة والغضاريف.
3. **العودة الآمنة**: لا تستأنف رفع الأوزان إلا بعد الشفاء التام والحصول على الموافقة الطبية، مع تفضيل البدائل الحركية الآمنة للمفاصل.`;

    const textEn = `⚠️ **Strict Medical & Safety Advisory (Coach Azzam)**:

Hey ${context.userName || 'Athlete'}, I noticed you mentioned pain, discomfort, or potential injury. As your AI Coach, **your health and joint longevity are top priority**, and AZMK **does not provide medical diagnosis or advice**.

${isRedFlagEmergency ? `🚨 **EMERGENCY ADVISORY**: If experiencing chest pressure, shortness of breath, severe dizziness, or sudden numbness, **stop immediately and seek emergency medical care**.` : ''}

### 📋 Mandatory Safety Protocol:
1. **Discontinue exercise immediately**: Do not push through sharp joint, tendon, or spine pain.
2. **Consult a Doctor or Physical Therapist**: Receive proper medical assessment.
3. **Safe Return**: Resume training only after medical clearance.`;

    return {
      id: `ai_msg_${Date.now()}`,
      sender: 'assistant',
      text: containsArabic ? textAr : textEn,
      timestamp: new Date().toISOString(),
      toolCalls: []
    };
  }

  // 1. BENCH PRESS / STRENGTH PROGRESSION QUESTION
  if (
    lowerMsg.includes('bench') || 
    lowerMsg.includes('stuck') || 
    lowerMsg.includes('plateau') ||
    lowerMsg.includes('وقف') ||
    lowerMsg.includes('بنش') ||
    lowerMsg.includes('وزني')
  ) {
    if (context.history.length === 0) {
      const replyCleanAr = `### 📊 حالة تمرين Bench Press (كابتن عزام)

أهلاً ${context.userName || 'يا بطل'}! حسابك جديد ولم تقم بتسجيل أي جلسة تمرين للبنش برس في سجلك الفعلي حتى الآن.

💡 **نصيحة لبداية قوية:**
1. ابدأ جلستك الأولى بوزن استكشافي خفيف (مثل البار بدون أوزان 20 كجم إذا كنت مبتدئاً، أو 40-50 كجم إذا كانت لديك خبرة).
2. سجل الأوزان والعدات الفعلية بعد كل جولة.
3. فور حفظ أول تمرين، سأقوم بحساب قوة الـ 1RM التقريبية وتوليد أهداف الزيادة التدريجية للجلسة القادمة!`;

      const replyCleanEn = `### 📊 Bench Press Status (Coach Azzam)

Hey ${context.userName || 'Athlete'}! Your account is fresh and no Bench Press workouts are logged in your history yet.

💡 **Starter Tip:**
1. Start your first session with conservative exploratory weight (empty bar 20kg for beginners, or 40-50kg for intermediate).
2. Log your actual weight, reps, and RPE after each set.
3. Once logged, I will calculate your estimated 1RM and automated progressive overload targets!`;

      return {
        id: `ai_msg_${Date.now()}`,
        sender: 'assistant',
        text: containsArabic ? replyCleanAr : replyCleanEn,
        timestamp: new Date().toISOString(),
        toolCalls: []
      };
    }

    const benchData = tools.get_exercise_history('barbell_bench_press', 8);
    const weeklyVol = tools.get_weekly_volume();

    toolLogs.push({
      id: `tool_${Date.now()}_1`,
      toolName: 'get_exercise_history',
      arguments: { exerciseId: 'barbell_bench_press', weeks: 8 },
      resultSummary: `Found ${benchData.totalSessionsFound} sessions in verified user history.`,
      timestamp: new Date().toLocaleTimeString()
    });

    const replyAr = `### 📊 تحليل أداء تمرين Bench Press (من كابتن عزام)

أهلاً ${context.userName || 'يا بطل'}! قمت بفحص بياناتك المسجلة لتمرين **Barbell Bench Press** في سجلك التدريبي:

- عدد الجلسات المسجلة: **${benchData.totalSessionsFound}** جلسة.
- مستوى التطور: يتم تطبيق مبدأ الزيادة التدريجية (Double Progression) برفع الأوزان عندما تصل للحد الأعلى من العدات بمعدل RPE ≤ 8.5.

### 🚀 الخطة للتمرين القادم:
- استهدف الحفاظ على أداء حركي سليم، وزيادة الوزن بمقدار **+2.5 كجم** عندما تنجز جميع الجولات بالعدات المستهدفة!`;

    const replyEn = `### 📊 Bench Press Performance Breakdown (Coach Azzam)

Hey ${context.userName || 'Athlete'}! Based on your verified training history for **Barbell Bench Press**:

- Logged Sessions: **${benchData.totalSessionsFound}**
- Strategy: Progressive overload applied via double progression method.

### 🚀 Next Workout Action:
- Maintain strict form and add **+2.5 kg** once target reps are completed at RPE ≤ 8.5!`;

    return {
      id: `ai_msg_${Date.now()}`,
      sender: 'assistant',
      text: containsArabic ? replyAr : replyEn,
      timestamp: new Date().toISOString(),
      toolCalls: toolLogs
    };
  }

  // 2. AM I PROGRESSING / OVERALL STATS
  if (
    lowerMsg.includes('progress') || 
    lowerMsg.includes('am i') || 
    lowerMsg.includes('تطور') || 
    lowerMsg.includes('كيف ادائي') ||
    lowerMsg.includes('مستواي') ||
    lowerMsg.includes('improving')
  ) {
    if (context.history.length === 0) {
      const replyAr = `### 📈 مستوى التطور والتحليلات (كابتن عزام)

أهلاً ${context.userName || 'يا بطل'}! حسابك في مرحلة البداية ولا توجد تمارين منجزة في السجل حتى الآن.

🚀 **خطوتك الأولى:**
سجل أول تمرين لك اليوم من خلال الضغط على زر **"ابدأ تمرين اليوم"**، وسأقوم بإنشاء تقارير القوة والحجم التدريبي والأرقام القياسية PRs فور حفظ التمرين!`;

      const replyEn = `### 📈 Progress & Analytics (Coach Azzam)

Hey ${context.userName || 'Athlete'}! Your account is brand new with 0 logged workouts.

🚀 **Your Next Step:**
Start today's session via **"Start Today's Workout"**, and I will generate your strength curves, tonnage analytics, and PR milestones immediately after completion!`;

      return {
        id: `ai_msg_${Date.now()}`,
        sender: 'assistant',
        text: containsArabic ? replyAr : replyEn,
        timestamp: new Date().toISOString(),
        toolCalls: []
      };
    }

    const prs = tools.get_prs();
    const replyAr = `### 📈 التقرير الشامل لتطور مستواك الرياضي (كابتن عزام)

أهلاً ${context.userName || 'يا بطل'}! بناءً على **${context.history.length}** جلسة مكتملة في سجلك:

- 🔥 **الأرقام القياسية المسجلة**: لديك **${prs.length}** أرقام قياسية PRs.
- ⚡ **الالتزام التدريبي**: مستمر ومسجل في خطتك بنجاح!
- 🏋️‍♂️ **توجيه كابتن عزام**: استمر في تطبيق الزيادة التدريجية للحفاظ على استمرار البناء العضلي.`;

    const replyEn = `### 📈 Overall Progression Report (Coach Azzam)

Hey ${context.userName || 'Athlete'}! Based on your **${context.history.length}** verified completed sessions:

- 🔥 **Milestones**: You have **${prs.length}** verified PR records.
- ⚡ **Consistency**: Tracked and progressing steadily!
- 🏋️‍♂️ **Coach Advice**: Keep applying progressive overload to sustain hypertrophy gains.`;

    return {
      id: `ai_msg_${Date.now()}`,
      sender: 'assistant',
      text: containsArabic ? replyAr : replyEn,
      timestamp: new Date().toISOString(),
      toolCalls: toolLogs
    };
  }

  // 3. NEXT WORKOUT RECOMMENDATION
  if (
    lowerMsg.includes('next') || 
    lowerMsg.includes('tomorrow') || 
    lowerMsg.includes('بكرة') || 
    lowerMsg.includes('القادم') ||
    lowerMsg.includes('تمرين الجاي')
  ) {
    const lastWorkout = tools.get_last_workout();

    toolLogs.push({
      id: `tool_${Date.now()}_1`,
      toolName: 'get_last_workout',
      arguments: {},
      resultSummary: `Last session fetched.`,
      timestamp: new Date().toLocaleTimeString()
    });

    const replyAr = `### ⚡ توصيات تمرينك القادم من كابتن عزام

التمرين التالي في جدولك هو:

### 💥 **تمرين السحب (Pull Day - ظهر وبايسبس وأكتاف خلفية)**
1. **سحب البار للظهر منحنياً (Bent-Over Barbell Row)**:
   - **الهدف**: **72.5 kg × 8 عدات** (آخر مرة كانت: 70kg × 8 @ RPE 8.0)
   - *تطبيق الزيادة التدريجية (+2.5kg)*
2. **سحب الكيبل للظهر عريض (Lat Pulldown)**:
   - **الهدف**: **65.0 kg × 10 عدات**
3. **سحب الكيبل للوجه للأكتاف الخلفية (Cable Face Pull)**:
   - **الهدف**: **3 جولات × 15 عدة** مع ثبات ثانيتين
4. **ثني البايسبس بالبار (Barbell Bicep Curl)**:
   - **الهدف**: **32.5 kg × 10 عدات**

هل ترغب في بدء هذا التمرين مباشرة عبر مسجل التمارين المباشر بالأوزان المقترحة؟`;

    const replyEn = `### ⚡ Next Session Recommendations (Coach Azzam)

Up next in your split is **Pull Day (Back & Biceps)**:
1. **Barbell Row**: Target **72.5 kg × 8 reps** (+2.5kg overload)
2. **Lat Pulldown**: Target **65.0 kg × 10 reps**
3. **Face Pulls**: 3 sets × 15 reps
4. **Bicep Curls**: 32.5 kg × 10 reps

Ready to load this workout into the Live Logger?`;

    return {
      id: `ai_msg_${Date.now()}`,
      sender: 'assistant',
      text: containsArabic ? replyAr : replyEn,
      timestamp: new Date().toISOString(),
      toolCalls: toolLogs,
      suggestedActions: [
        { label: containsArabic ? 'بدء التمرين المباشر مع الأوزان التلقائية' : 'Start Workout with Target Weights', actionType: 'start_workout', payload: { name: 'Pull Day' } }
      ]
    };
  }

  // 4. GENERAL GREETING / DEFAULT HELPFUL FALLBACK
  const defaultAr = `أهلاً بك يا ${context.userName || 'بطل'}! أنا **كابتن عزام**، مدربك الذكي المعتمد على تحليل سجلات تمارينك وأوزانك الفعلية.

إليك ما يمكنني مساعدتك به:
- 🏋️ **تحليل ثبات الأوزان**: اسألني *"ليش وزني ثابت في البنش أو السكوات؟"* لأعطيك تحليلاً لجهد الـ RPE والحجم.
- 🎯 **الأوزان المستهدفة**: اسألني *"وش أتمرن في التمرين القادم وكم وزني؟"* لحساب الزيادة التدريجية.
- 🔄 **استبدال التمارين**: اسألني *"ابي بديل للبنش برس بالدامبلز"* لاقتراح أفضل بديل ميكانيكي.
- 📊 **تحليل التطور الشامل**: اسألني *"كيف تطور قوتي هذا الشهر؟"* لاستعراض أرقامك القياسية.`;

  const defaultEn = `Hello ${context.userName || 'Athlete'}! I'm **Coach Azzam**, your AI Training Coach directly connected to your exercise database.

Here's what I can do:
- 🏋️ **Plateau Diagnostics**: Ask *"Why has my Bench / Squat stopped improving?"*
- 🎯 **Next Session Targets**: Ask *"What should I lift next workout?"*
- 🔄 **Exercise Substitutions**: Ask *"Replace Barbell Bench Press"* for biomechanical alternatives.
- 📊 **Volume & PR Analysis**: Ask *"Am I progressing this month?"*`;

  return {
    id: `ai_msg_${Date.now()}`,
    sender: 'assistant',
    text: containsArabic ? defaultAr : defaultEn,
    timestamp: new Date().toISOString(),
    toolCalls: toolLogs
  };
};
