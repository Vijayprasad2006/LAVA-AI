
export interface Module {
    id: string;
    name: string; // e.g., "Module 1"
    difficulty: 'Easy' | 'Medium' | 'Hard';
    completed: boolean;
}

export interface Subject {
    id: string;
    name: string;
    credits: number; // 1-4
    modules: Module[];
    color: string; // For UI
}

export interface UserConfig {
    examDate: Date;
    scheduleType: 'College' | 'Holiday' | 'Mixed';
    preferredDailyHours: number;
    wakeTime: string; // "06:00"
    sleepTime: string; // "23:00"
}

export interface StudySlot {
    timeRange: string;
    subjectId: string;
    subjectName: string;
    moduleName: string;
    type: 'Study' | 'Revision' | 'Break' | 'Routine';
}

export interface DailyPlan {
    date: Date;
    isHoliday: boolean;
    slots: StudySlot[];
    totalHours: number;
}

// --- CONSTANTS ---
const CREDIT_MULTIPLIER: Record<number, number> = {
    1: 1,
    2: 1.5,
    3: 2,
    4: 3 // Higher weight for high credits
};

// --- CORE LOGIC ---

export const generateStudyPlan = (
    subjects: Subject[],
    config: UserConfig
): DailyPlan[] => {
    const plan: DailyPlan[] = [];
    const today = new Date();
    const endDate = new Date(config.examDate);

    // 1. Flatten all modules into a prioritized queue
    // STRATEGY: Sort Subjects by Credits Descending FIRST
    // Then take all modules from the highest credit subject, then the next, etc.
    // This aligns with user request: "start same with 3 and then 2 and then 1"

    let sortedSubjects = [...subjects].sort((a, b) => b.credits - a.credits);

    let globalTaskQueue: {
        subjectId: string;
        subjectName: string;
        moduleName: string;
        color: string;
    }[] = [];

    // Push all modules in order of Subject Priority
    sortedSubjects.forEach(sub => {
        sub.modules.forEach(mod => {
            if (!mod.completed) {
                globalTaskQueue.push({
                    subjectId: sub.id,
                    subjectName: sub.name,
                    moduleName: mod.name,
                    color: sub.color
                });
            }
        });
    });

    // 2. Iterate days
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start tomorrow

    while (currentDate <= endDate) {
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
        let isHoliday = false;

        if (config.scheduleType === 'Holiday') isHoliday = true;
        else if (config.scheduleType === 'Mixed' && isWeekend) isHoliday = true;

        const slots: StudySlot[] = [];

        if (isHoliday) {
            // --- HOLIDAY ROUTINE (User Specified) ---

            // 5:00 - 6:00: Routine
            slots.push({
                timeRange: "05:00 - 06:00",
                subjectId: 'routine',
                subjectName: 'Morning Ritual',
                moduleName: 'Yoga, Meditation, Fresh-up, Milk/Tea',
                type: 'Routine'
            });

            // 6-hour Blocks
            const blocks = [
                { start: 6, end: 12, label: "Morning Grind" },
                { start: 12, end: 18, label: "Afternoon Session" },
                { start: 18, end: 24, label: "Night Shift" } // 18-24 is 6pm-12am
            ];

            blocks.forEach(block => {
                // Determine how many tasks fit in this 6-hour block
                // Let's fill hour-by-hour to be precise.

                for (let hour = block.start; hour < block.end; hour++) {
                    // Check if queue empty
                    if (globalTaskQueue.length === 0) {
                        slots.push({
                            timeRange: `${hour}:00 - ${hour + 1}:00`,
                            subjectId: 'revision',
                            subjectName: 'Revision / Buffer',
                            moduleName: 'Review previous topics',
                            type: 'Revision'
                        });
                        continue;
                    }

                    const task = globalTaskQueue[0];
                    globalTaskQueue.shift(); // Remove from queue

                    slots.push({
                        timeRange: `${hour}:00 - ${hour + 1}:00`,
                        subjectId: task.subjectId,
                        subjectName: task.subjectName,
                        moduleName: task.moduleName,
                        type: 'Study'
                    });
                }
            });

        } else {
            // --- COLLEGE / NORMAL DAY ---
            // Fallback for non-holiday days (e.g. Mixed weekdays)

            const collegeBlocks = [
                "06:00 - 07:00",
                "07:00 - 08:00",
                "19:00 - 20:00",
                "20:00 - 21:00",
                "21:00 - 22:00"
            ];

            collegeBlocks.forEach(time => {
                if (globalTaskQueue.length > 0) {
                    const task = globalTaskQueue.shift()!;
                    slots.push({
                        timeRange: time,
                        subjectId: task.subjectId,
                        subjectName: task.subjectName,
                        moduleName: task.moduleName,
                        type: 'Study'
                    });
                }
            });
        }

        plan.push({
            date: new Date(currentDate),
            isHoliday,
            slots,
            totalHours: slots.filter(s => s.type === 'Study').length
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return plan;
};
