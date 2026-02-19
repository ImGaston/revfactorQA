import {
    collection,
    addDoc,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    serverTimestamp,
    query,
    orderBy,
    increment,
    runTransaction
} from "firebase/firestore";
import { db } from "./firebase";
import { Answer, QuestionWithAnswer, QuestionStatus } from "@/types";

export async function getQuestionsWithAnswers(): Promise<QuestionWithAnswer[]> {
    const questionsRef = collection(db, "questions");
    const q = query(questionsRef, orderBy("voteCount", "desc"));
    const questionsSnapshot = await getDocs(q);

    const answersRef = collection(db, "answers");
    const answersSnapshot = await getDocs(answersRef);

    const answersMap = new Map<string, Answer>();
    answersSnapshot.forEach(docSnapshot => {
        const data = docSnapshot.data();
        answersMap.set(docSnapshot.id, {
            questionId: docSnapshot.id,
            answerText: data.answerText,
            videoUrl: data.videoUrl,
            createdAt: data.createdAt
        });
    });

    return questionsSnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        return {
            id: docSnapshot.id,
            text: data.text,
            authorName: data.authorName,
            status: data.status,
            voteCount: data.voteCount,
            createdAt: data.createdAt,
            answer: answersMap.get(docSnapshot.id)
        } as QuestionWithAnswer;
    });
}

export async function submitQuestion(text: string, authorName: string) {
    const questionsRef = collection(db, "questions");
    return addDoc(questionsRef, {
        text,
        authorName,
        voteCount: 0,
        status: 'pending' as QuestionStatus,
        createdAt: serverTimestamp()
    });
}

export async function submitVote(questionId: string, fingerprint: string) {
    const voteDocId = `${questionId}_${fingerprint}`;
    const voteRef = doc(db, "votes", voteDocId);
    const questionRef = doc(db, "questions", questionId);

    try {
        await runTransaction(db, async (transaction) => {
            const voteDoc = await transaction.get(voteRef);
            if (voteDoc.exists()) {
                throw new Error("Already voted");
            }

            const questionDoc = await transaction.get(questionRef);
            if (!questionDoc.exists()) {
                throw new Error("Question not found");
            }

            transaction.set(voteRef, {
                questionId,
                fingerprint,
                createdAt: serverTimestamp()
            });

            transaction.update(questionRef, {
                voteCount: increment(1)
            });
        });
        return { success: true };
    } catch (error) {
        if (error instanceof Error && error.message === "Already voted") {
            return { alreadyVoted: true };
        }
        console.error("Vote failed: ", error);
        return { error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function updateAnswer(questionId: string, answerText: string, videoUrl?: string) {
    const answerRef = doc(db, "answers", questionId);
    const data: Record<string, unknown> = {
        questionId,
        answerText,
        createdAt: serverTimestamp()
    };
    if (videoUrl) data.videoUrl = videoUrl;

    await setDoc(answerRef, data, { merge: true });
}

export async function updateStatus(questionId: string, status: QuestionStatus) {
    const questionRef = doc(db, "questions", questionId);
    await updateDoc(questionRef, { status });
}
