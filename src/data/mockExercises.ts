import { Exercise, MuscleGroup, Equipment, MovementPattern } from '../types';

export const MOCK_EXERCISES: Exercise[] = [
  // ==========================================
  // CHEST (الصدر)
  // ==========================================
  {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Barbell',
    movementPattern: 'Horizontal Push',
    difficulty: 'Intermediate',
    instructions: 'Retract scapulae, maintain slight arch, lower bar to mid-chest with controlled tempo, push explosively driving through feet.',
    instructionsAr: 'ضم لوحي الكتف للخلف، حافظ على انحناء طبيعي أسفل الظهر، انزل بالبار إلى منتصف الصدر بتحكم ثم ادفع بقوة مع تثبيت القدمين بالأرض.',
    defaultSets: 4,
    defaultReps: 8,
    alternatives: ['dumbbell_bench_press', 'smith_bench_press', 'machine_chest_press', 'push_ups'],
    youtubeQuery: 'Barbell Bench Press proper form'
  },
  {
    id: 'smith_bench_press',
    name: 'Smith Machine Bench Press',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Smith Machine',
    movementPattern: 'Horizontal Push',
    difficulty: 'Beginner',
    instructions: 'Position bench centered under bar. Stable fixed path allows pushing close to muscular failure safely.',
    instructionsAr: 'ضع المقعد في المنتصف تحت البار. المسار الثابت للجهاز يتيح لك الوصول للفشل العضلي بأمان واستقرار عالي.',
    defaultSets: 3,
    defaultReps: 8,
    alternatives: ['barbell_bench_press', 'dumbbell_bench_press', 'machine_chest_press'],
    youtubeQuery: 'Smith Machine Bench Press form'
  },
  {
    id: 'incline_dumbbell_press',
    name: 'Incline Dumbbell Press',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbell',
    movementPattern: 'Horizontal Push',
    difficulty: 'Intermediate',
    instructions: 'Set bench to 30 degrees. Lower dumbbells till elbows reach 90 degrees with a deep stretch in upper pecs, press up and slightly inward.',
    instructionsAr: 'اضبط المقعد بزاوية 30 درجة. انزل بالدامبلز حتى تشعر بإطالة عميقة في أعلى الصدر بزاوية 90 للكوع، ثم ادفع للأعلى وللداخل قليلاً.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['incline_barbell_press', 'incline_smith_press', 'cable_chest_fly'],
    youtubeQuery: 'Incline Dumbbell Press proper form'
  },
  {
    id: 'dumbbell_bench_press',
    name: 'Dumbbell Bench Press',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Dumbbell',
    movementPattern: 'Horizontal Push',
    difficulty: 'Beginner',
    instructions: 'Allows greater range of motion and joint freedom. Press dumbbells up over chest without clanging them together.',
    instructionsAr: 'يوفر مدى حركي واسع ومريح للمفاصل. ادفع الدامبلز للأعلى فوق الصدر بدون تصادم الأوزان عند القمة.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['barbell_bench_press', 'machine_chest_press', 'smith_bench_press'],
    youtubeQuery: 'Dumbbell Bench Press proper form'
  },
  {
    id: 'incline_barbell_press',
    name: 'Incline Barbell Press',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Shoulders', 'Triceps'],
    equipment: 'Barbell',
    movementPattern: 'Horizontal Push',
    difficulty: 'Intermediate',
    instructions: 'Set bench to 30-45 degrees. Lower bar toward upper clavicle area and press straight up.',
    instructionsAr: 'اضبط المقعد بزاوية 30-45 درجة. انزل بالبار نحو أعلى عظمة الترقوة وادفع عمودياً لأعلى بتحكم كامل.',
    defaultSets: 3,
    defaultReps: 8,
    alternatives: ['incline_dumbbell_press', 'incline_smith_press'],
    youtubeQuery: 'Incline Barbell Press form'
  },
  {
    id: 'incline_smith_press',
    name: 'Incline Smith Machine Press',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Shoulders', 'Triceps'],
    equipment: 'Smith Machine',
    movementPattern: 'Horizontal Push',
    difficulty: 'Beginner',
    instructions: 'Target upper pectorals with fixed stability. Lower controlled to upper chest and push up.',
    instructionsAr: 'يركز على الصدر العلوي بأمان وثبات عالي. انزل بتحكم لأعلى الصدر ثم ادفع للأعلى.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['incline_dumbbell_press', 'incline_barbell_press'],
    youtubeQuery: 'Incline Smith Machine Press form'
  },
  {
    id: 'decline_bench_press',
    name: 'Decline Bench Press',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Triceps'],
    equipment: 'Barbell',
    movementPattern: 'Horizontal Push',
    difficulty: 'Intermediate',
    instructions: 'Lie on decline bench, lower bar to lower sternum and press up explosively.',
    instructionsAr: 'استلقِ على بنش مائل لأسفل، انزل بالبار إلى أسفل الصدر ثم ادفع للأعلى.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['chest_dips', 'cable_chest_fly'],
    youtubeQuery: 'Decline Bench Press form'
  },
  {
    id: 'machine_chest_press',
    name: 'Machine Chest Press',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Machine',
    movementPattern: 'Horizontal Push',
    difficulty: 'Beginner',
    instructions: 'Adjust seat height so handles align with mid-chest. Keep shoulders pinned back and drive handles forward.',
    instructionsAr: 'اضبط ارتفاع المقعد لتكون المقابض بمحاذاة منتصف الصدر. ثبّت الكتفين للخلف وادفع للأمام.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['barbell_bench_press', 'dumbbell_bench_press', 'smith_bench_press'],
    youtubeQuery: 'Machine Chest Press proper form'
  },
  {
    id: 'cable_chest_fly',
    name: 'Cable Chest Fly',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Cable',
    movementPattern: 'Isolation Push',
    difficulty: 'Beginner',
    instructions: 'Set pulleys at chest height. Keep a slight elbow bend, hug around a big tree and squeeze pecs at center.',
    instructionsAr: 'اضبط البكرات على مستوى الصدر. مع ثني بسيط للكوع، ضم اليدين وكأنك تعانق شجرة كبيرة مع عصر الصدر في المنتصف.',
    defaultSets: 3,
    defaultReps: 15,
    alternatives: ['pec_deck_fly', 'incline_dumbbell_press'],
    youtubeQuery: 'Cable Chest Fly form'
  },
  {
    id: 'pec_deck_fly',
    name: 'Pec Deck Machine Fly',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Machine',
    movementPattern: 'Isolation Push',
    difficulty: 'Beginner',
    instructions: 'Keep elbows slightly bent and shoulders depressed. Squeeze pads together for a 1-second hold at peak contraction.',
    instructionsAr: 'حافظ على ثني بسيط في الكوعين، ضم المقابض واعصر عضلة الصدر بقوة مع ثبات لمدة ثانية في أقصى انقباض.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['cable_chest_fly', 'dumbbell_bench_press'],
    youtubeQuery: 'Pec Deck Fly proper form'
  },
  {
    id: 'push_ups',
    name: 'Push Ups',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Triceps', 'Core', 'Shoulders'],
    equipment: 'Bodyweight',
    movementPattern: 'Horizontal Push',
    difficulty: 'Beginner',
    instructions: 'Maintain rigid plank posture. Lower chest to floor with elbows 45 degrees, push fully up.',
    instructionsAr: 'حافظ على استقامة الجسم كلوح الخشب. انزل بالصدر للأرض مع زاوية 45 درجة للكوع ثم ادفع للأعلى بالكامل.',
    defaultSets: 3,
    defaultReps: 15,
    alternatives: ['barbell_bench_press', 'machine_chest_press'],
    youtubeQuery: 'Push Ups proper form calisthenics'
  },
  {
    id: 'chest_dips',
    name: 'Chest Dips',
    muscleGroup: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Bodyweight',
    movementPattern: 'Horizontal Push',
    difficulty: 'Intermediate',
    instructions: 'Lean torso forward 30 degrees, flare elbows slightly, descend until shoulders feel a safe stretch, press up.',
    instructionsAr: 'مل بجذعك للأمام 30 درجة، انزل حتى تشعر بإطالة آمنة في أسفل الصدر والكتف، ثم ادفع للأعلى بقوة.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['cable_chest_fly', 'barbell_bench_press'],
    youtubeQuery: 'Chest Dips proper form'
  },

  // ==========================================
  // BACK (الظهر)
  // ==========================================
  {
    id: 'pull_ups',
    name: 'Pull-Ups',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps', 'Forearms', 'Core'],
    equipment: 'Bodyweight',
    movementPattern: 'Vertical Pull',
    difficulty: 'Intermediate',
    instructions: 'Full dead-hang at bottom, engage scapulae and pull chin smoothly over the bar without excessive swinging.',
    instructionsAr: 'ابدأ من النزول الكامل، فعّل لوحي الظهر أولاً ثم اسحب جسمك بسلاسة حتى تعبر الذقن فوق العقلة بدون مرجحة.',
    defaultSets: 3,
    defaultReps: 8,
    alternatives: ['lat_pulldown', 'chin_ups', 'assisted_pull_ups'],
    youtubeQuery: 'Pull Ups proper form'
  },
  {
    id: 'chin_ups',
    name: 'Chin-Ups',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps', 'Forearms'],
    equipment: 'Bodyweight',
    movementPattern: 'Vertical Pull',
    difficulty: 'Intermediate',
    instructions: 'Underhand supinated grip. Pull until chin clears bar focusing on lats and biceps contraction.',
    instructionsAr: 'قبضة مقلوبة (راحة اليد لجهتك)، اسحب جسمك حتى تعبر الذقن فوق البار مع التركيز على المجنص والبايسبس.',
    defaultSets: 3,
    defaultReps: 8,
    alternatives: ['pull_ups', 'lat_pulldown'],
    youtubeQuery: 'Chin Ups proper form'
  },
  {
    id: 'assisted_pull_ups',
    name: 'Assisted Pull-Ups',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps', 'Forearms'],
    equipment: 'Machine',
    movementPattern: 'Vertical Pull',
    difficulty: 'Beginner',
    instructions: 'Kneel or stand on the counterbalance pad. Build vertical pulling strength with controlled tempo.',
    instructionsAr: 'استخدم منصة المساعدة لضبط الوزن المناسب وبناء قوة السحب العمودي بتكرارات نظيفة.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['lat_pulldown', 'pull_ups'],
    youtubeQuery: 'Assisted Pull Ups Machine form'
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps', 'Shoulders'],
    equipment: 'Cable',
    movementPattern: 'Vertical Pull',
    difficulty: 'Beginner',
    instructions: 'Grip slightly wider than shoulders. Lean back slightly, pull bar down towards upper chest while driving elbows into pockets.',
    instructionsAr: 'أمسك البار بمسافة أوسع قليلاً من الكتفين، اسحب البار نحو أعلى الصدر مع توجيه الكوعين لأسفل وللداخل باتجاه الجيوب.',
    defaultSets: 4,
    defaultReps: 10,
    alternatives: ['pull_ups', 'close_grip_pulldown'],
    youtubeQuery: 'Lat Pulldown proper form'
  },
  {
    id: 'close_grip_pulldown',
    name: 'Close-Grip Lat Pulldown',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps'],
    equipment: 'Cable',
    movementPattern: 'Vertical Pull',
    difficulty: 'Beginner',
    instructions: 'Use V-bar attachment. Pull handle down to upper chest, squeeze lower lats.',
    instructionsAr: 'استخدم مقبض V، اسحب المقبض لأسفل الصدر واعصر أسفل عضلات الظهر.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['lat_pulldown', 'seated_cable_row'],
    youtubeQuery: 'Close Grip Lat Pulldown form'
  },
  {
    id: 'seated_cable_row',
    name: 'Seated Cable Row',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps', 'Forearms'],
    equipment: 'Cable',
    movementPattern: 'Horizontal Pull',
    difficulty: 'Beginner',
    instructions: 'Sit tall with neutral spine. Pull handle to lower ribcage, squeeze shoulder blades together for 1s, stretch back under control.',
    instructionsAr: 'اجلس باستقامة، اسحب المقبض لأسفل القفص الصدري واعصر لوحي الظهر لثانية واحدة، ثم ارجع للأمام بتحكم وإطالة.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['barbell_row', 'chest_supported_tbar_row', 'single_arm_dumbbell_row'],
    youtubeQuery: 'Seated Cable Row form'
  },
  {
    id: 'barbell_row',
    name: 'Bent-Over Barbell Row',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps', 'Forearms', 'Core'],
    equipment: 'Barbell',
    movementPattern: 'Horizontal Pull',
    difficulty: 'Intermediate',
    instructions: 'Hinge hips to 45 degrees with neutral spine. Pull bar towards lower abdomen/belly button, driving elbows back.',
    instructionsAr: 'اثنِ الحوض بزاوية 45 درجة مع ظهر مستقيم تماماً. اسحب البار باتجاه أسفل البطن وادفع الكوعين للخلف لأقصى مدى.',
    defaultSets: 4,
    defaultReps: 8,
    alternatives: ['chest_supported_tbar_row', 'seated_cable_row', 'single_arm_dumbbell_row'],
    youtubeQuery: 'Barbell Bent Over Row form'
  },
  {
    id: 'chest_supported_tbar_row',
    name: 'Chest-Supported T-Bar Row',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps', 'Shoulders'],
    equipment: 'Machine',
    movementPattern: 'Horizontal Pull',
    difficulty: 'Beginner',
    instructions: 'Chest firmly against pad eliminates lower back fatigue. Focus purely on driving elbows up and squeezing upper/mid back.',
    instructionsAr: 'تثبيت الصدر على الوسادة يريح أسفل الظهر تماماً. ركز على قيادة الحركة بالكوعين وعصر عضلات منتصف الظهر.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['barbell_row', 'seated_cable_row'],
    youtubeQuery: 'Chest Supported T Bar Row form'
  },
  {
    id: 'single_arm_dumbbell_row',
    name: 'Single-Arm Dumbbell Row',
    muscleGroup: 'Back',
    secondaryMuscles: ['Biceps', 'Core'],
    equipment: 'Dumbbell',
    movementPattern: 'Horizontal Pull',
    difficulty: 'Intermediate',
    instructions: 'Support on bench with hand and knee. Pull dumbbell towards hip pocket, stretching lat fully at bottom.',
    instructionsAr: 'ارتكز باليد والركبة على المقعد، اسحب الدامبل باتجاه الجيب الخلفي مع إطالة كاملة لعضلة الظهر في النزول.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['seated_cable_row', 'barbell_row'],
    youtubeQuery: 'Single Arm Dumbbell Row proper form'
  },
  {
    id: 'barbell_deadlift',
    name: 'Conventional Barbell Deadlift',
    muscleGroup: 'Back',
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Core', 'Forearms'],
    equipment: 'Barbell',
    movementPattern: 'Hip Hinge',
    difficulty: 'Advanced',
    instructions: 'Bar over mid-foot, hinge hips back, grip bar outside shins, lock lats, push floor away through mid-foot and stand tall.',
    instructionsAr: 'البار فوق منتصف القدم، ادفع الحوض للخلف، ثبت عضلات المجنص والظهر، ادفع الأرض بقدميك واستقم بصلابة.',
    defaultSets: 3,
    defaultReps: 5,
    alternatives: ['romanian_deadlift', 'barbell_row'],
    youtubeQuery: 'Conventional Deadlift proper form'
  },
  {
    id: 'straight_arm_cable_pulldown',
    name: 'Straight-Arm Cable Pulldown',
    muscleGroup: 'Back',
    secondaryMuscles: ['Core', 'Triceps'],
    equipment: 'Cable',
    movementPattern: 'Isolation Pull',
    difficulty: 'Beginner',
    instructions: 'Slight bend in elbows, hinge forward slightly. Pull rope/bar down in an arc to thighs using pure lat contraction.',
    instructionsAr: 'مع ثني طفيف في الكوع وميلان خفيف للأمام، اسحب البار بنصف دائرة نحو الفخذين بعصر مباشر للمجنص.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['lat_pulldown', 'pull_ups'],
    youtubeQuery: 'Straight Arm Lat Pulldown form'
  },

  // ==========================================
  // SHOULDERS (الأكتاف والترابيس)
  // ==========================================
  {
    id: 'seated_dumbbell_shoulder_press',
    name: 'Dumbbell Overhead Press',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Triceps', 'Chest'],
    equipment: 'Dumbbell',
    movementPattern: 'Vertical Push',
    difficulty: 'Beginner',
    instructions: 'Sit on high-incline bench or stand tall. Press dumbbells overhead until arms are extended without banging weights.',
    instructionsAr: 'اجلس على مقعد مائل للأعلى. ادفع الدامبلز للأعلى فوق الرأس مع التحكم الكامل دون تصادم الأوزان.',
    defaultSets: 3,
    defaultReps: 8,
    alternatives: ['overhead_barbell_press', 'smith_overhead_press'],
    youtubeQuery: 'Seated Dumbbell Shoulder Press form'
  },
  {
    id: 'overhead_barbell_press',
    name: 'Overhead Barbell Press (OHP)',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Triceps', 'Core', 'Chest'],
    equipment: 'Barbell',
    movementPattern: 'Vertical Push',
    difficulty: 'Intermediate',
    instructions: 'Stand tall with glutes and core braced. Press bar directly upwards in a straight vertical path.',
    instructionsAr: 'قف باستقامة مع شد البطن والمؤخرة. ادفع البار عمودياً في مسار مستقيم للأعلى.',
    defaultSets: 4,
    defaultReps: 6,
    alternatives: ['seated_dumbbell_shoulder_press', 'smith_overhead_press'],
    youtubeQuery: 'Overhead Press OHP proper form'
  },
  {
    id: 'smith_overhead_press',
    name: 'Smith Machine Shoulder Press',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Triceps'],
    equipment: 'Smith Machine',
    movementPattern: 'Vertical Push',
    difficulty: 'Beginner',
    instructions: 'Press bar overhead in fixed guided path. Isolates anterior deltoids safely.',
    instructionsAr: 'ادفع البار فوق الرأس في المسار الثابت للجهاز. يعزل الكتف الأمامي بأمان عالي.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['seated_dumbbell_shoulder_press', 'overhead_barbell_press'],
    youtubeQuery: 'Smith Machine Shoulder Press form'
  },
  {
    id: 'dumbbell_lateral_raise',
    name: 'Dumbbell Lateral Raise',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Traps'],
    equipment: 'Dumbbell',
    movementPattern: 'Isolation Push',
    difficulty: 'Beginner',
    instructions: 'Lead with elbows in the scapular plane (30 degrees forward). Raise to parallel, pause briefly, control descent.',
    instructionsAr: 'قد الحركة بالكوعين للأعلى بزاوية 30 درجة للأمام قليلاً. ارفع لمستوى الكتف واثبت لحظة ثم انزل بتحكم.',
    defaultSets: 4,
    defaultReps: 15,
    alternatives: ['cable_lateral_raise', 'machine_lateral_raise'],
    youtubeQuery: 'Dumbbell Lateral Raise proper form'
  },
  {
    id: 'cable_lateral_raise',
    name: 'Cable Lateral Raise',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Traps'],
    equipment: 'Cable',
    movementPattern: 'Isolation Push',
    difficulty: 'Beginner',
    instructions: 'Provides constant tension throughout whole range. Set pulley at knee/wrist height and raise smoothly.',
    instructionsAr: 'يوفر توتراً عضلياً مستمراً طوال الحركة. اضبط البكرة على مستوى الركبة وارفع الكيبل بسلاسة وثبات.',
    defaultSets: 3,
    defaultReps: 15,
    alternatives: ['dumbbell_lateral_raise', 'machine_lateral_raise'],
    youtubeQuery: 'Cable Lateral Raise form'
  },
  {
    id: 'face_pulls',
    name: 'Face Pull',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Back', 'Traps'],
    equipment: 'Cable',
    movementPattern: 'Horizontal Pull',
    difficulty: 'Beginner',
    instructions: 'Attach rope at eye level. Pull rope to bridge of nose while externally rotating shoulders and squeezing rear delts/upper back.',
    instructionsAr: 'ثبت الحبل بمستوى العين، اسحب الحبل نحو الأنف مع تدوير اليدين والكتف للخارج لعصر الكتف الخلفي وأعلى الظهر.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['reverse_pec_deck', 'dumbbell_rear_delt_fly'],
    youtubeQuery: 'Face Pulls proper form'
  },
  {
    id: 'reverse_pec_deck',
    name: 'Reverse Pec Deck (Rear Delts)',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Back', 'Traps'],
    equipment: 'Machine',
    movementPattern: 'Isolation Pull',
    difficulty: 'Beginner',
    instructions: 'Chest against pad, arms extended with slight elbow bend. Pull handles outward and backward squeezing rear deltoids.',
    instructionsAr: 'الصدر ملاصق للمقعد، اسحب المقابض للخارج والخلف مع ثني خفيف للكوع لعزل الكتف الخلفي بدقة.',
    defaultSets: 3,
    defaultReps: 15,
    alternatives: ['face_pulls', 'dumbbell_rear_delt_fly'],
    youtubeQuery: 'Reverse Pec Deck Fly form'
  },
  {
    id: 'dumbbell_rear_delt_fly',
    name: 'Dumbbell Rear Delt Fly',
    muscleGroup: 'Shoulders',
    secondaryMuscles: ['Traps', 'Back'],
    equipment: 'Dumbbell',
    movementPattern: 'Isolation Pull',
    difficulty: 'Beginner',
    instructions: 'Hinge forward at hips. Raise dumbbells out to sides squeezing rear delts.',
    instructionsAr: 'انحنِ بالجذع للأمام، ارفع الدامبلز للجانبين بعصر مباشر للكتف الخلفي.',
    defaultSets: 3,
    defaultReps: 15,
    alternatives: ['face_pulls', 'reverse_pec_deck'],
    youtubeQuery: 'Rear Delt Dumbbell Fly form'
  },
  {
    id: 'dumbbell_shrugs',
    name: 'Dumbbell Shrugs',
    muscleGroup: 'Traps',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Dumbbell',
    movementPattern: 'Isolation Pull',
    difficulty: 'Beginner',
    instructions: 'Hold heavy dumbbells at sides. Shrug shoulders straight up toward ears, squeeze at peak for 1s.',
    instructionsAr: 'احمل الدامبلز بجانبيك، ارفع الكتفين مباشرة للأعلى نحو الأذنين واعصر الترابيس لثانية في القمة.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['barbell_shrugs'],
    youtubeQuery: 'Dumbbell Shrugs proper form'
  },

  // ==========================================
  // LEGS / QUADS / GLUTES / HAMSTRINGS
  // ==========================================
  {
    id: 'barbell_back_squat',
    name: 'Barbell Back Squat',
    muscleGroup: 'Quads',
    secondaryMuscles: ['Glutes', 'Hamstrings', 'Core', 'Calves'],
    equipment: 'Barbell',
    movementPattern: 'Squat',
    difficulty: 'Advanced',
    instructions: 'Bar resting on upper traps/rear delts, feet shoulder width. Break at hips and knees, descend below parallel, drive up.',
    instructionsAr: 'البار مستقر على عضلات الترابيس، القدمين بعرض الكتف، انزل بثني الحوض والركبتين حتى يوازي الفخذ الأرض ثم ادفع بقوة.',
    defaultSets: 4,
    defaultReps: 6,
    alternatives: ['leg_press', 'hack_squat', 'front_squat', 'goblet_squat'],
    youtubeQuery: 'Barbell Back Squat proper form'
  },
  {
    id: 'leg_press',
    name: 'Leg Press (45 Degree)',
    muscleGroup: 'Quads',
    secondaryMuscles: ['Glutes', 'Hamstrings'],
    equipment: 'Machine',
    movementPattern: 'Squat',
    difficulty: 'Beginner',
    instructions: 'Place feet mid-platform. Lower sled until knees reach 90 degrees without lower back rounding off pad. Drive through midfoot.',
    instructionsAr: 'ضع القدمين في منتصف اللوح، انزل بالوزن حتى زاوية 90 درجة للركبة دون رفع أسفل الظهر عن المقعد، ثم ادفع للأعلى.',
    defaultSets: 4,
    defaultReps: 10,
    alternatives: ['barbell_back_squat', 'hack_squat', 'goblet_squat'],
    youtubeQuery: 'Leg Press proper form'
  },
  {
    id: 'hack_squat',
    name: 'Machine Hack Squat',
    muscleGroup: 'Quads',
    secondaryMuscles: ['Glutes'],
    equipment: 'Machine',
    movementPattern: 'Squat',
    difficulty: 'Intermediate',
    instructions: 'Great quad builder with locked spinal support. Descend deep into the hole keeping feet flat on platform.',
    instructionsAr: 'تمرين ممتاز لعضلات الفخذ الأمامية مع حماية كاملة للعمود الفقري. انزل لعمق كامل مع ثبات القدمين.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['barbell_back_squat', 'leg_press'],
    youtubeQuery: 'Hack Squat proper form'
  },
  {
    id: 'leg_extensions',
    name: 'Leg Extensions',
    muscleGroup: 'Quads',
    secondaryMuscles: [],
    equipment: 'Machine',
    movementPattern: 'Isolation Push',
    difficulty: 'Beginner',
    instructions: 'Align knee joint with machine axis. Extend legs fully, hold contraction for 1 second, lower with 2-second eccentric.',
    instructionsAr: 'حاذِ مفصل الركبة مع محور الجهاز، افرد الساقين بالكامل واثبت لثانية واحدة عند القمة، ثم انزل ببطء وتحكم.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['sissy_squat', 'goblet_squat'],
    youtubeQuery: 'Leg Extensions proper form'
  },
  {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    muscleGroup: 'Quads',
    secondaryMuscles: ['Glutes', 'Hamstrings'],
    equipment: 'Dumbbell',
    movementPattern: 'Lunge / Single Leg',
    difficulty: 'Intermediate',
    instructions: 'Rear foot elevated on bench. Lower hips until front thigh is parallel to ground, drive through front heel.',
    instructionsAr: 'ضع القدم الخلفية على مقعد، انزل بالحوض حتى يوازي الفخذ الأمامي الأرض ثم ادفع للأعلى بكعب القدم الأمامية.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['walking_lunges', 'leg_press'],
    youtubeQuery: 'Bulgarian Split Squat proper form'
  },
  {
    id: 'barbell_hip_thrust',
    name: 'Barbell Hip Thrust',
    muscleGroup: 'Glutes',
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'Barbell',
    movementPattern: 'Hip Hinge',
    difficulty: 'Intermediate',
    instructions: 'Upper back against bench, barbell across hips with pad. Drive hips upward until thighs and torso align, squeeze glutes at top for 1s.',
    instructionsAr: 'أعلى الظهر مسنود على المقعد والبار فوق الحوض مع وسادة حماية. ادفع الحوض للأعلى حتى يستقيم الجذع مع الفخذين واعصر عضلات المؤخرة بقوة.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['romanian_deadlift', 'dumbbell_hip_thrust'],
    youtubeQuery: 'Barbell Hip Thrust proper form'
  },
  {
    id: 'dumbbell_hip_thrust',
    name: 'Dumbbell Hip Thrust',
    muscleGroup: 'Glutes',
    secondaryMuscles: ['Hamstrings'],
    equipment: 'Dumbbell',
    movementPattern: 'Hip Hinge',
    difficulty: 'Beginner',
    instructions: 'Rest heavy dumbbell across hips. Drive through heels to full hip extension.',
    instructionsAr: 'ضع دامبل ثقيل فوق الحوض، ادفع بالكعبين للأعلى حتى أقصى امتداد للحوض.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['barbell_hip_thrust', 'romanian_deadlift'],
    youtubeQuery: 'Dumbbell Hip Thrust form'
  },
  {
    id: 'romanian_deadlift',
    name: 'Barbell Romanian Deadlift (RDL)',
    muscleGroup: 'Hamstrings',
    secondaryMuscles: ['Glutes', 'Back', 'Core'],
    equipment: 'Barbell',
    movementPattern: 'Hip Hinge',
    difficulty: 'Intermediate',
    instructions: 'Slight soft knee bend, push hips back keeping bar skimming thighs, feel deep hamstring stretch, drive hips forward.',
    instructionsAr: 'ثني طفيف في الركبة، ادفع الحوض للخلف لأقصى حد مع ملاصقة البار للفخذين حتى تشعر بإطالة الفخذ الخلفي ثم ادفع الحوض للأمام.',
    defaultSets: 4,
    defaultReps: 8,
    alternatives: ['dumbbell_rdl', 'lying_leg_curl', 'seated_leg_curl'],
    youtubeQuery: 'Romanian Deadlift RDL proper form'
  },
  {
    id: 'dumbbell_rdl',
    name: 'Dumbbell Romanian Deadlift',
    muscleGroup: 'Hamstrings',
    secondaryMuscles: ['Glutes'],
    equipment: 'Dumbbell',
    movementPattern: 'Hip Hinge',
    difficulty: 'Beginner',
    instructions: 'Hold dumbbells in front of thighs, hinge at hips while keeping back straight, stretch hamstrings.',
    instructionsAr: 'امسك الدامبلز أمام الفخذين، ادفع الحوض للخلف مع استقامة الظهر حتى تشعر بإطالة الفخذ الخلفي.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['romanian_deadlift', 'lying_leg_curl'],
    youtubeQuery: 'Dumbbell Romanian Deadlift form'
  },
  {
    id: 'lying_leg_curl',
    name: 'Prone Leg Curl (Lying)',
    muscleGroup: 'Hamstrings',
    secondaryMuscles: ['Calves'],
    equipment: 'Machine',
    movementPattern: 'Isolation Pull',
    difficulty: 'Beginner',
    instructions: 'Lie face down on pad with pad above heels. Curl legs upward towards glutes, hold 1s, lower under control.',
    instructionsAr: 'استلقِ على بطنك مع وضع الوسادة فوق الكعبين. اثنِ الساقين للأعلى باتجاه المؤخرة واثبت لثانية ثم انزل ببطء وتحكم.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['seated_leg_curl', 'romanian_deadlift'],
    youtubeQuery: 'Lying Leg Curl proper form'
  },
  {
    id: 'seated_leg_curl',
    name: 'Seated Leg Curl',
    muscleGroup: 'Hamstrings',
    secondaryMuscles: ['Calves'],
    equipment: 'Machine',
    movementPattern: 'Isolation Pull',
    difficulty: 'Beginner',
    instructions: 'Locks pelvis in hip flexion placing hamstrings under superior stretch for maximum hypertrophy.',
    instructionsAr: 'يثبت الحوض بزاوية ممتازة تضع عضلات الفخذ الخلفية تحت إطالة قوية لبناء عضلي أسرع.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['lying_leg_curl', 'romanian_deadlift'],
    youtubeQuery: 'Seated Leg Curl proper form'
  },
  {
    id: 'standing_calf_raise',
    name: 'Standing Calf Raise',
    muscleGroup: 'Calves',
    secondaryMuscles: [],
    equipment: 'Machine',
    movementPattern: 'Isolation Push',
    difficulty: 'Beginner',
    instructions: 'Full stretch at bottom for 2 seconds, explode onto toes, hold peak contraction for 1 second.',
    instructionsAr: 'إطالة كاملة في الأسفل لمدة ثانيتين، ثم اصعد على أطراف الأصابع واثبت في القمة لثانية واحدة.',
    defaultSets: 4,
    defaultReps: 15,
    alternatives: ['seated_calf_raise'],
    youtubeQuery: 'Standing Calf Raise proper form'
  },
  {
    id: 'seated_calf_raise',
    name: 'Seated Calf Raise',
    muscleGroup: 'Calves',
    secondaryMuscles: [],
    equipment: 'Machine',
    movementPattern: 'Isolation Push',
    difficulty: 'Beginner',
    instructions: 'Targets the soleus muscle under bent knee. Deep stretch at bottom, full squeeze at top.',
    instructionsAr: 'يستهدف عضلة السوليس في بطة الساق. انزل لإطالة كاملة ثم ارفع واعصر بقوة في القمة.',
    defaultSets: 3,
    defaultReps: 15,
    alternatives: ['standing_calf_raise'],
    youtubeQuery: 'Seated Calf Raise form'
  },

  // ==========================================
  // ARMS (الباي والتراي والساعدين)
  // ==========================================
  {
    id: 'barbell_bicep_curl',
    name: 'Barbell Bicep Curl',
    muscleGroup: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Barbell',
    movementPattern: 'Isolation Pull',
    difficulty: 'Beginner',
    instructions: 'Stand tall with elbows pinned to sides. Curl bar up focusing on bicep contraction, lower with controlled tempo.',
    instructionsAr: 'قف باستقامة وثبّت الكوعين بجانبيك، ارفع البار بالتركيز على عصر البايسبس، وانزل ببطء وبتحكم.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['dumbbell_incline_bicep_curl', 'hammer_curls'],
    youtubeQuery: 'Barbell Bicep Curl proper form'
  },
  {
    id: 'dumbbell_incline_bicep_curl',
    name: 'Incline Dumbbell Bicep Curl',
    muscleGroup: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Dumbbell',
    movementPattern: 'Isolation Pull',
    difficulty: 'Intermediate',
    instructions: 'Set bench to 45-60 degrees. Arms hang straight down for deep stretch on long head of bicep, curl without swinging.',
    instructionsAr: 'اضبط المقعد بزاوية مائلة، دع الذراعين تتدلى بإطالة كاملة للرأس الطويل للبايسبس ثم ارفع بدون مرجحة.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['barbell_bicep_curl', 'hammer_curls'],
    youtubeQuery: 'Incline Dumbbell Curl proper form'
  },
  {
    id: 'preacher_curl',
    name: 'Preacher Curl',
    muscleGroup: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Machine',
    movementPattern: 'Isolation Pull',
    difficulty: 'Beginner',
    instructions: 'Rest upper arms flat against preacher pad, curl weight up with strict isolation.',
    instructionsAr: 'ثبّت أعلى الذراعين على مسند جهاز التبشير، ارفع الوزن بعزل كامل للبايسبس دون مرجحة.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['barbell_bicep_curl', 'cable_bicep_curl'],
    youtubeQuery: 'Preacher Curl proper form'
  },
  {
    id: 'hammer_curls',
    name: 'Dumbbell Hammer Curls',
    muscleGroup: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Dumbbell',
    movementPattern: 'Isolation Pull',
    difficulty: 'Beginner',
    instructions: 'Neutral palms-facing grip. Targets brachialis and brachioradialis for arm thickness.',
    instructionsAr: 'قبضة محايدة (الكفين متقابلين)، يركز على عضلة البراكيلس والساعد لزيادة سماكة الذراع.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['barbell_bicep_curl', 'cable_bicep_curl'],
    youtubeQuery: 'Dumbbell Hammer Curls form'
  },
  {
    id: 'cable_bicep_curl',
    name: 'Cable Bicep Curl',
    muscleGroup: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Cable',
    movementPattern: 'Isolation Pull',
    difficulty: 'Beginner',
    instructions: 'Provides constant tension throughout whole range. Curl bar/rope to chest.',
    instructionsAr: 'يوفر توتراً عضلياً مستمراً على مدار الحركة بالكامل. اسحب البار نحو الصدر بعصر قوي.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['barbell_bicep_curl', 'hammer_curls'],
    youtubeQuery: 'Cable Bicep Curl form'
  },
  {
    id: 'tricep_rope_pushdown',
    name: 'Tricep Rope Pushdown',
    muscleGroup: 'Triceps',
    secondaryMuscles: [],
    equipment: 'Cable',
    movementPattern: 'Isolation Push',
    difficulty: 'Beginner',
    instructions: 'Keep elbows tucked at ribs. Push rope down and spread handles apart at bottom for peak triceps lateral head contraction.',
    instructionsAr: 'ثبت الكوعين بجانب الأضلاع، ادفع الحبل لأسفل وافصل طرفي الحبل عند القاع لأقصى انقباض في الترايسبس.',
    defaultSets: 4,
    defaultReps: 12,
    alternatives: ['overhead_cable_tricep_extension', 'skull_crushers'],
    youtubeQuery: 'Tricep Rope Pushdown form'
  },
  {
    id: 'overhead_cable_tricep_extension',
    name: 'Overhead Cable Tricep Extension',
    muscleGroup: 'Triceps',
    secondaryMuscles: [],
    equipment: 'Cable',
    movementPattern: 'Isolation Push',
    difficulty: 'Beginner',
    instructions: 'Sets long head of triceps under high stretch. Extend arms straight overhead without flaring elbows.',
    instructionsAr: 'يضع الرأس الطويل للترايسبس تحت إطالة ممتازة، افرد الذراعين للأمام ولأعلى دون فتح الكوعين للجانبين.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['skull_crushers', 'tricep_rope_pushdown'],
    youtubeQuery: 'Overhead Cable Tricep Extension proper form'
  },
  {
    id: 'skull_crushers',
    name: 'EZ-Bar Skull Crushers',
    muscleGroup: 'Triceps',
    secondaryMuscles: [],
    equipment: 'Barbell',
    movementPattern: 'Isolation Push',
    difficulty: 'Intermediate',
    instructions: 'Lie on bench, hold EZ bar above forehead. Lower bar toward crown of head bending only at elbows, then press back up.',
    instructionsAr: 'استلقِ على المقعد وامسك بار الزجزاج، انزل بالبار باتجاه أعلى الجبهة بثني الكوع فقط ثم ادفع للأعلى.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['overhead_cable_tricep_extension', 'tricep_rope_pushdown'],
    youtubeQuery: 'Skull Crushers proper form'
  },

  // ==========================================
  // CORE / ABS (البطن والكور)
  // ==========================================
  {
    id: 'cable_crunch',
    name: 'Cable Crunch',
    muscleGroup: 'Core',
    secondaryMuscles: [],
    equipment: 'Cable',
    movementPattern: 'Core / Anti-Extension',
    difficulty: 'Beginner',
    instructions: 'Kneel holding rope at ears. Flex spine and crunch ribs toward hips, squeeze abs hard at bottom.',
    instructionsAr: 'اركع على ركبتيك وثبت الحبل عند الأذنين. قم بثني العمود الفقري وسحب القفص الصدري نحو الحوض مع عصر عضلات البطن بقوة.',
    defaultSets: 3,
    defaultReps: 15,
    alternatives: ['hanging_leg_raise', 'plank'],
    youtubeQuery: 'Cable Crunch proper form abs'
  },
  {
    id: 'plank',
    name: 'Plank',
    muscleGroup: 'Core',
    secondaryMuscles: ['Shoulders', 'Glutes'],
    equipment: 'Bodyweight',
    movementPattern: 'Core / Anti-Extension',
    difficulty: 'Beginner',
    instructions: 'Maintain a rigid straight line from head to heels on forearms and toes. Squeeze glutes and brace core.',
    instructionsAr: 'حافظ على استقامة الجسم كلوح مستقيم على الساعدين وأطراف الأصابع مع شد البطن والمؤخرة بثبات.',
    defaultSets: 3,
    defaultReps: 60,
    alternatives: ['cable_crunch', 'hanging_leg_raise'],
    youtubeQuery: 'Plank proper form abs'
  },
  {
    id: 'hanging_leg_raise',
    name: 'Hanging Leg / Knee Raise',
    muscleGroup: 'Core',
    secondaryMuscles: ['Forearms'],
    equipment: 'Bodyweight',
    movementPattern: 'Core / Anti-Extension',
    difficulty: 'Intermediate',
    instructions: 'Hang from bar, tilt pelvis up first and raise knees or toes to bar height without swinging momentum.',
    instructionsAr: 'تعلق بالعقلة، قم بلف الحوض للأعلى أولاً وارفع الركبتين أو القدمين لمستوى الصدر دون استخدام الاندفاع.',
    defaultSets: 3,
    defaultReps: 12,
    alternatives: ['cable_crunch', 'plank'],
    youtubeQuery: 'Hanging Leg Raise proper form'
  },
  {
    id: 'ab_wheel_rollout',
    name: 'Ab Wheel Rollout',
    muscleGroup: 'Core',
    secondaryMuscles: ['Back', 'Shoulders'],
    equipment: 'Other',
    movementPattern: 'Core / Anti-Extension',
    difficulty: 'Advanced',
    instructions: 'Kneel and roll wheel forward while maintaining posterior pelvic tilt. Pull back using core contraction.',
    instructionsAr: 'تدحرج بالعجلة للأمام مع الحفاظ على شد وقفل البطن، ثم اسحب العجلة للخلف بقوة عضلات الكور.',
    defaultSets: 3,
    defaultReps: 10,
    alternatives: ['plank', 'cable_crunch'],
    youtubeQuery: 'Ab Wheel Rollout proper form'
  }
];

// ==========================================
// DYNAMIC CUSTOM EXERCISE REGISTRY
// ==========================================

const DYNAMIC_EXERCISES_MAP = new Map<string, Exercise>();

// Load any custom exercises from localStorage if in browser environment
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('azmk_custom_exercises');
    if (saved) {
      const parsed: Exercise[] = JSON.parse(saved);
      parsed.forEach(ex => DYNAMIC_EXERCISES_MAP.set(ex.id, ex));
    }
  } catch (e) {
    // Ignore storage parse error
  }
}

/**
 * Intelligent helper to infer muscle group and equipment from arbitrary exercise text
 */
export const inferExerciseAttributes = (name: string): { 
  muscleGroup: MuscleGroup; 
  equipment: Equipment; 
  movementPattern: MovementPattern;
} => {
  const clean = name.toLowerCase();

  let muscleGroup: MuscleGroup = 'Full Body';
  let equipment: Equipment = 'Barbell';
  let movementPattern: MovementPattern = 'Horizontal Push';

  // Equipment inference
  if (clean.includes('dumbbell') || clean.includes('دامبل')) equipment = 'Dumbbell';
  else if (clean.includes('cable') || clean.includes('كيبل')) equipment = 'Cable';
  else if (clean.includes('machine') || clean.includes('جهاز') || clean.includes('مكينة')) equipment = 'Machine';
  else if (clean.includes('smith') || clean.includes('سميث')) equipment = 'Smith Machine';
  else if (clean.includes('bodyweight') || clean.includes('pull-up') || clean.includes('pull up') || clean.includes('pullup') || clean.includes('chin-up') || clean.includes('chin up') || clean.includes('chinup') || clean.includes('push-up') || clean.includes('push up') || clean.includes('pushup') || clean.includes('dip') || clean.includes('plank') || clean.includes('hanging') || clean.includes('leg raise') || clean.includes('knee raise') || clean.includes('عقلة') || clean.includes('متوازي') || clean.includes('ضغط') || clean.includes('وزن الجسم')) equipment = 'Bodyweight';
  else if (clean.includes('kettlebell') || clean.includes('كتل')) equipment = 'Kettlebell';
  else if (clean.includes('band') || clean.includes('مقاومة')) equipment = 'Bands';
  else if (clean.includes('barbell') || clean.includes('بار')) equipment = 'Barbell';

  // Muscle group and pattern inference
  if (clean.includes('chest') || clean.includes('bench') || clean.includes('pec') || clean.includes('صدر') || clean.includes('بنش')) {
    muscleGroup = 'Chest';
    movementPattern = 'Horizontal Push';
  } else if (clean.includes('squat') || clean.includes('leg press') || clean.includes('hack') || clean.includes('quad') || clean.includes('extension') || clean.includes('سكوات') || clean.includes('فخذ أمامي') || clean.includes('رجل')) {
    muscleGroup = 'Quads';
    movementPattern = 'Squat';
  } else if (clean.includes('deadlift') || clean.includes('rdl') || clean.includes('romanian') || clean.includes('hamstring') || clean.includes('leg curl') || clean.includes('فخذ خلفي') || clean.includes('ديدلفت')) {
    muscleGroup = 'Hamstrings';
    movementPattern = 'Hip Hinge';
  } else if (clean.includes('hip thrust') || clean.includes('glute') || clean.includes('مؤخرة') || clean.includes('هيب ثروست')) {
    muscleGroup = 'Glutes';
    movementPattern = 'Hip Hinge';
  } else if (clean.includes('row') || clean.includes('pulldown') || clean.includes('pull up') || clean.includes('pull-up') || clean.includes('pullup') || clean.includes('lat') || clean.includes('back') || clean.includes('سحب') || clean.includes('ظهر') || clean.includes('عقلة')) {
    muscleGroup = 'Back';
    movementPattern = clean.includes('row') ? 'Horizontal Pull' : 'Vertical Pull';
  } else if (clean.includes('shoulder') || clean.includes('overhead') || clean.includes('ohp') || clean.includes('lateral') || clean.includes('front raise') || clean.includes('rear delt') || clean.includes('face pull') || clean.includes('كتف') || clean.includes('أكتاف') || clean.includes('رفرفة') || clean.includes('فيس بول')) {
    muscleGroup = 'Shoulders';
    movementPattern = clean.includes('face pull') || clean.includes('rear') ? 'Horizontal Pull' : (clean.includes('lateral') ? 'Isolation Push' : 'Vertical Push');
  } else if (clean.includes('bicep') || clean.includes('curl') || clean.includes('hammer') || clean.includes('باي') || clean.includes('بايسبس')) {
    muscleGroup = 'Biceps';
    movementPattern = 'Isolation Pull';
  } else if (clean.includes('tricep') || clean.includes('pushdown') || clean.includes('skull crusher') || clean.includes('تراي') || clean.includes('ترايسبس')) {
    muscleGroup = 'Triceps';
    movementPattern = 'Isolation Push';
  } else if (clean.includes('calf') || clean.includes('calves') || clean.includes('بطات') || clean.includes('سمانة')) {
    muscleGroup = 'Calves';
    movementPattern = 'Isolation Push';
  } else if (clean.includes('abs') || clean.includes('core') || clean.includes('crunch') || clean.includes('plank') || clean.includes('بطن') || clean.includes('كور') || clean.includes('بلانك')) {
    muscleGroup = 'Core';
    movementPattern = 'Core / Anti-Extension';
  }

  return { muscleGroup, equipment, movementPattern };
};

/**
 * Finds an existing exercise by fuzzy match or dynamically creates and registers a brand new custom exercise
 * This GUARANTEES that no exercise will ever be lost or forced to become Barbell Bench Press!
 */
export const findOrCreateExercise = (rawName: string): Exercise => {
  const clean = rawName.trim();
  if (!clean) {
    return MOCK_EXERCISES[0];
  }

  const cleanLower = clean.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s]/g, '');

  // 1. Direct match in built-in exercises
  const foundMock = MOCK_EXERCISES.find(ex => {
    const exLower = ex.name.toLowerCase();
    return exLower === cleanLower || exLower.replace(/[^a-z0-9\s]/g, '') === cleanLower;
  });
  if (foundMock) return foundMock;

  // 2. Direct match in dynamic custom exercises
  for (const ex of DYNAMIC_EXERCISES_MAP.values()) {
    if (ex.name.toLowerCase() === cleanLower || ex.id === cleanLower) {
      return ex;
    }
  }

  // 3. Generate a clean dynamic ID from user's exercise name
  const slug = cleanLower
    .replace(/\s+/g, '_')
    .slice(0, 40) || `custom_${Date.now()}`;
  const customId = `custom_${slug}`;

  // If already registered with this custom ID
  if (DYNAMIC_EXERCISES_MAP.has(customId)) {
    return DYNAMIC_EXERCISES_MAP.get(customId)!;
  }

  // Infer attributes
  const { muscleGroup, equipment, movementPattern } = inferExerciseAttributes(clean);

  // Capitalize properly
  const formattedName = clean
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const newExercise: Exercise = {
    id: customId,
    name: formattedName,
    muscleGroup,
    secondaryMuscles: [],
    equipment,
    movementPattern,
    difficulty: 'Intermediate',
    instructions: `Perform ${formattedName} with controlled form, steady cadence, and progressive overload.`,
    instructionsAr: `تمرين ${formattedName}: أدِّ الحركة بتحكم كامل مع المحافظة على التكنيك السليم وتطبيق الزيادة التدريجية.`,
    defaultSets: 3,
    defaultReps: 10,
    alternatives: [],
    youtubeQuery: `${formattedName} proper form`
  };

  // Register in memory map
  DYNAMIC_EXERCISES_MAP.set(customId, newExercise);

  // Persist to localStorage
  if (typeof window !== 'undefined') {
    try {
      const allCustom = Array.from(DYNAMIC_EXERCISES_MAP.values());
      localStorage.setItem('azmk_custom_exercises', JSON.stringify(allCustom));
    } catch (e) {
      // Storage error ignored
    }
  }

  return newExercise;
};

/**
 * Returns exercise by ID with zero undefined crashes and zero accidental Barbell Bench Press overrides
 */
export const getExerciseById = (id: string): Exercise => {
  if (!id) return MOCK_EXERCISES[0];

  // Check built-in mock exercises
  const found = MOCK_EXERCISES.find(ex => ex.id === id);
  if (found) return found;

  // Check dynamic registry
  if (DYNAMIC_EXERCISES_MAP.has(id)) {
    return DYNAMIC_EXERCISES_MAP.get(id)!;
  }

  // If ID has custom prefix or is an unformatted name, create/format it dynamically
  const cleanedName = id
    .replace(/^custom_/, '')
    .replace(/_/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return findOrCreateExercise(cleanedName);
};

export const getAllExercises = (): Exercise[] => {
  return [...MOCK_EXERCISES, ...Array.from(DYNAMIC_EXERCISES_MAP.values())];
};

export const getAlternativeExercises = (exerciseId: string): Exercise[] => {
  const current = getExerciseById(exerciseId);
  if (!current) return [];
  
  const directAlts = (current.alternatives || [])
    .map(altId => getExerciseById(altId))
    .filter((ex): ex is Exercise => ex !== undefined);

  if (directAlts.length >= 3) return directAlts;

  const fallback = MOCK_EXERCISES.filter(ex => 
    ex.id !== exerciseId &&
    (ex.muscleGroup === current.muscleGroup || ex.movementPattern === current.movementPattern) &&
    !(current.alternatives || []).includes(ex.id)
  );

  return [...directAlts, ...fallback].slice(0, 5);
};
