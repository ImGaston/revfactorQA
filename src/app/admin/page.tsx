"use client";

import { useEffect, useState } from "react";
import { getQuestionsWithAnswers } from "@/lib/questions";
import { QuestionWithAnswer } from "@/types";
import { AdminQuestionCard } from "@/components/AdminQuestionCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
    const [questions, setQuestions] = useState<QuestionWithAnswer[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const data = await getQuestionsWithAnswers();
            // Sort: pending first, then by voteCount desc
            const sortedData = data.sort((a, b) => {
                if (a.status === "pending" && b.status !== "pending") return -1;
                if (a.status !== "pending" && b.status === "pending") return 1;
                return b.voteCount - a.voteCount;
            });
            setQuestions(sortedData);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const pendingCount = questions.filter(q => q.status === "pending").length;
    const answeredCount = questions.filter(q => q.status !== "pending").length;

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-40 w-full rounded-2xl bg-white/50" />
                ))}
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="font-serif text-2xl text-cedar">No questions yet</h2>
                <p className="text-onyx/50">Questions will appear here once submitted.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <h1 className="font-serif text-3xl text-cedar">Questions</h1>
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="bg-white border border-onyx/10 px-2 py-1 rounded-md text-onyx/60">
                        {pendingCount} Pending
                    </span>
                    <span className="bg-moss/10 text-moss px-2 py-1 rounded-md border border-moss/20">
                        {answeredCount} Answered
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {questions.map(question => (
                    <AdminQuestionCard key={question.id} question={question} />
                ))}
            </div>
        </div>
    );
}
