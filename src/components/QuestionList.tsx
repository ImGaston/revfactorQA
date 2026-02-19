"use client";

import { useEffect, useState } from "react";
import { getQuestionsWithAnswers } from "@/lib/questions";
import { QuestionWithAnswer } from "@/types";
import { QuestionCard } from "@/components/QuestionCard";
import { Skeleton } from "@/components/ui/skeleton";

export function QuestionList() {
    const [questions, setQuestions] = useState<QuestionWithAnswer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getQuestionsWithAnswers();
                setQuestions(data);
            } catch (error) {
                console.error("Failed to fetch questions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();

        // Optional: Set up real-time listener if we wanted live updates, 
        // but the prompt implies a simple fetch on mount for this component 
        // or maybe simple 'fetches all questions'. 
        // `getQuestionsWithAnswers` was implemented as a one-time fetch.
        // We could add a polling interval or refresh button later.
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 w-full max-w-2xl mx-auto">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-onyx/10 shadow-sm space-y-3">
                        <div className="flex justify-between">
                            <div className="space-y-2 w-3/4">
                                <Skeleton className="h-4 w-24 bg-bone/50" />
                                <Skeleton className="h-6 w-full bg-bone/50" />
                                <Skeleton className="h-6 w-2/3 bg-bone/50" />
                            </div>
                            <Skeleton className="h-12 w-12 rounded-lg bg-bone/50" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center py-12 max-w-2xl mx-auto">
                <h3 className="font-serif text-xl text-cedar mb-2">No questions yet</h3>
                <p className="text-onyx/60">Be the first to ask a question!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-2xl mx-auto">
            {questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
            ))}
        </div>
    );
}
