import {Subject} from "@/types";


export const MOCK_SUBJECTS: Subject[] = [
    {
        id: 1,
        code: "CS101",
        name: "Introduction to Computer Science",
        department: "CS",
        description: "An introduction to the fundamental concepts of computer science and programming.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        code: "MATH201",
        name: "Calculus II",
        department: "Math",
        description: "Advanced calculus covering integration, sequences, and series.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        code: "ENG102",
        name: "English Composition",
        department: "English",
        description: "Focuses on developing critical thinking and writing skills through various essay forms.",
        createdAt: new Date().toISOString(),
    },
];
