import { Timestamp } from 'firebase/firestore';

export type QuestionStatus = 'pending' | 'answered_live' | 'answered_online';

export interface Question {
    id: string;
    text: string;
    authorName: string;
    status: QuestionStatus;
    voteCount: number;
    createdAt: Timestamp;
}

export interface Answer {
    questionId: string;
    answerText: string;
    videoUrl?: string;
    createdAt: Timestamp;
}

export interface QuestionWithAnswer extends Question {
    answer?: Answer;
}
