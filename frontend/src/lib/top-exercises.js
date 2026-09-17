/**
 * Top 20 science-based & bodybuilding staple exercises for each muscle category / subcategory.
 * Ranked based on hypertrophy research, mechanical tension, EMG activation, and progressive overload utility.
 */

export const TOP_EXERCISE_IDS = {
  // === CHEST ===
  chest: [
    '0025', // barbell bench press
    '0047', // barbell incline bench press
    '0289', // dumbbell bench press
    '0314', // dumbbell incline bench press
    '0251', // chest dip
    '0662', // push-up
    '0308', // dumbbell fly
    '0319', // dumbbell incline fly
    '0577', // lever chest press
    '0596', // lever seated fly (pec deck)
    '0155', // cable cross-over variation
    '0171', // cable incline fly
    '0179', // cable low fly
    '0188', // cable middle fly
    '0033', // barbell decline bench press
    '0301', // dumbbell decline bench press
    '0757', // smith incline bench press
    '0279', // decline push-up
    '0493', // incline push-up
    '0122'  // barbell wide bench press
  ],

  // === BACK ===
  back: [
    '0652', // pull-up
    '0027', // barbell bent over row
    '0292', // dumbbell bent over row
    '2330', // cable lat pulldown full range of motion
    '0198', // cable pulldown
    '0861', // cable seated row
    '0818', // twin handle parallel grip lat pulldown
    '0579', // lever front pulldown
    '1350', // lever seated row
    '3017', // barbell pendlay row
    '0118', // barbell reverse grip bent over row
    '0238', // cable straight arm pulldown
    '0499', // inverted row
    '0017', // assisted pull-up
    '0095', // barbell shrug
    '0406', // dumbbell shrug
    '0489', // hyperextension
    '0150', // cable bar lateral pulldown
    '0153', // cable cross-over lateral pulldown
    '0245'  // cable underhand pulldown
  ],

  // === UPPER LEGS (Quads, Hamstrings & Glutes) ===
  upper_legs: [
    '0043', // barbell full squat
    '0042', // barbell front squat
    '0032', // barbell deadlift
    '0085', // barbell romanian deadlift
    '1463', // sled 45° leg press (side pov)
    '0046', // barbell hack squat
    '0585', // lever leg extension
    '0586', // lever lying leg curl
    '0599', // lever seated leg curl
    '0054', // barbell lunge
    '0336', // dumbbell lunge
    '1459', // dumbbell romanian deadlift
    '0811', // trap bar deadlift
    '0117', // barbell sumo deadlift
    '0300', // dumbbell deadlift
    '0078', // barbell rear lunge
    '0381', // dumbbell rear lunge
    '0578', // lever deadlift
    '0026', // barbell bench squat
    '1436'  // barbell high bar squat
  ],

  // === LOWER LEGS (Calves) ===
  lower_legs: [
    '1372', // barbell standing calf raise
    '0088', // barbell seated calf raise
    '1373', // bodyweight standing calf raise
    '1379', // dumbbell seated calf raise
    '0605', // lever standing calf raise
    '0594', // lever seated calf raise
    '0284', // donkey calf raise
    '1370', // barbell floor calf raise
    '0108', // barbell standing leg calf raise
    '0111', // barbell standing rocking leg calf raise
    '0999', // band single leg calf raise
    '1000', // band single leg reverse calf raise
    '1369', // band two legs calf raise
    '1490', // standing calf raise (on a staircase)
    '1371'  // barbell seated calf raise v. 2
  ],

  // === ALL LEGS ===
  all_legs: [
    '0043', // barbell full squat
    '0042', // barbell front squat
    '0032', // barbell deadlift
    '0085', // barbell romanian deadlift
    '1463', // sled 45° leg press
    '0046', // barbell hack squat
    '0585', // lever leg extension
    '0586', // lever lying leg curl
    '0599', // lever seated leg curl
    '0054', // barbell lunge
    '0336', // dumbbell lunge
    '1459', // dumbbell romanian deadlift
    '1372', // barbell standing calf raise
    '0088', // barbell seated calf raise
    '0811', // trap bar deadlift
    '0117', // barbell sumo deadlift
    '0300', // dumbbell deadlift
    '0605', // lever standing calf raise
    '0594', // lever seated calf raise
    '1373'  // bodyweight standing calf raise
  ],

  // === SHOULDERS ===
  shoulders: [
    '0091', // barbell seated overhead press
    '1456', // barbell standing close grip military press
    '0405', // dumbbell seated shoulder press
    '0334', // dumbbell lateral raise
    '2137', // dumbbell arnold press
    '0178', // cable lateral raise
    '0075', // barbell rear delt raise
    '0378', // dumbbell rear fly
    '0437', // dumbbell upright row
    '0246', // cable upright row
    '0310', // dumbbell front raise
    '0162', // cable front raise
    '0603', // lever shoulder press
    '0086', // barbell seated behind head military press
    '0219', // cable shoulder press
    '0164', // cable front shoulder raise
    '0192', // cable one arm lateral raise
    '0041', // barbell front raise
    '0107', // barbell standing front raise over head
    '0215'  // cable seated rear lateral raise
  ],

  // === UPPER ARMS (Biceps & Triceps) ===
  upper_arms: [
    '0031', // barbell curl
    '0294', // dumbbell biceps curl
    '0313', // dumbbell hammer curl
    '0070', // barbell preacher curl
    '0297', // dumbbell concentration curl
    '0868', // cable curl
    '0241', // cable triceps pushdown (v-bar)
    '0060', // barbell lying triceps extension skull crusher
    '0092', // barbell seated overhead triceps extension
    '2188', // dumbbell seated triceps extension
    '0351', // dumbbell lying triceps extension
    '0372', // dumbbell preacher curl
    '0186', // cable lying triceps extension
    '1631', // cable concentration curl
    '0056', // barbell lying close-grip triceps extension
    '0061', // barbell lying triceps extension
    '0019', // assisted triceps dip (kneeling)
    '0023', // barbell alternate biceps curl
    '1629', // barbell standing wide grip biceps curl
    '0140'  // biceps pull-up
  ],

  // === FOREARMS / LOWER ARMS ===
  forearms: [
    '0126', // barbell wrist curl
    '0082', // barbell reverse wrist curl
    '1411', // barbell palms down wrist curl over a bench
    '1412', // barbell palms up wrist curl over a bench
    '0385', // dumbbell reverse wrist curl
    '0859', // wrist rollerer
    '0247', // cable wrist curl
    '0210', // cable reverse wrist curl
    '0347', // dumbbell lying pronation
    '0349', // dumbbell lying supination
    '0104', // barbell standing back wrist curl
    '0224', // cable standing back wrist curl
    '1437', // dumbbell finger curls
    '0455', // finger curls
    '0994', // band reverse wrist curl
    '1016'  // band wrist curl
  ],

  // === ALL ARMS ===
  all_arms: [
    '0031', // barbell curl
    '0294', // dumbbell biceps curl
    '0313', // dumbbell hammer curl
    '0070', // barbell preacher curl
    '0241', // cable triceps pushdown
    '0060', // barbell lying triceps extension skull crusher
    '0092', // barbell seated overhead triceps extension
    '2188', // dumbbell seated triceps extension
    '0297', // dumbbell concentration curl
    '0868', // cable curl
    '0351', // dumbbell lying triceps extension
    '0126', // barbell wrist curl
    '0082', // barbell reverse wrist curl
    '0372', // dumbbell preacher curl
    '0186', // cable lying triceps extension
    '0056', // barbell lying close-grip triceps extension
    '0385', // dumbbell reverse wrist curl
    '0859', // wrist rollerer
    '0247', // cable wrist curl
    '0140'  // biceps pull-up
  ],

  // === ABS / CORE / WAIST ===
  abs: [
    '0472', // hanging leg raise
    '0175', // cable kneeling crunch
    '0857', // wheel rollerout (ab wheel)
    '0972', // band bicycle crunch
    '2963', // captains chair straight leg raise
    '0282', // decline sit-up
    '0267', // crunch (hands overhead)
    '2135', // weighted front plank
    '0011', // assisted hanging knee raise
    '0873', // cable reverse crunch
    '0407', // dumbbell side bend
    '0262', // cross body crunch
    '0002', // 45° side bend
    '0212', // cable seated crunch
    '0464', // front plank with twist
    '0226', // cable standing crunch
    '0243', // cable twist
    '0664', // push-up to side plank
    '3544', // bodyweight incline side plank
    '3663'  // reverse plank with leg lift
  ],

  // === CARDIO ===
  cardio: [
    '0684', // run (equipment)
    '0685', // run
    '2612', // jump rope
    '1160', // burpee
    '0630', // mountain climber
    '2138', // stationary bike run
    '2141', // walk elliptical cross trainer
    '2331', // cycle cross trainer
    '3361', // skater hops
    '3223', // star jump (male)
    '3655', // walking high knees lunge
    '3360', // bear crawl
    '1201', // dumbbell burpee
    '0501', // jack burpee
    '3224', // jack jump (male)
    '3636', // high knee against wall
    '3220'  // astride jumps (male)
  ]
}

export function getTopExerciseIds(categoryKey) {
  return TOP_EXERCISE_IDS[categoryKey] || []
}
