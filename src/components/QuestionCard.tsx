"use client";

import { useState, useEffect } from "react";
import { QuestionWithAnswer } from "@/types";
import { submitVote } from "@/lib/questions";
import { getOrCreateFingerprint } from "@/lib/fingerprint";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
    question: QuestionWithAnswer;
}

export function QuestionCard({ question }: QuestionCardProps) {
    const [hasVoted, setHasVoted] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [optimisticVoteCount, setOptimisticVoteCount] = useState(question.voteCount);

    useEffect(() => {
        // Check if user has already voted for this question
        const storedVotes = localStorage.getItem("rf_voted");
        if (storedVotes) {
            const votedIds = JSON.parse(storedVotes);
            if (Array.isArray(votedIds) && votedIds.includes(question.id)) {
                setHasVoted(true);
            }
        }
    }, [question.id]);

    const handleVote = async () => {
        if (hasVoted || isVoting) return;

        setIsVoting(true);
        const fingerprint = getOrCreateFingerprint();

        try {
            const result = await submitVote(question.id, fingerprint);

            if (result.success || result.alreadyVoted) {
                setHasVoted(true);
                if (result.success) {
                    setOptimisticVoteCount(prev => prev + 1);
                }

                // Update local storage
                const storedVotes = localStorage.getItem("rf_voted");
                const votedIds = storedVotes ? JSON.parse(storedVotes) : [];
                if (!votedIds.includes(question.id)) {
                    localStorage.setItem("rf_voted", JSON.stringify([...votedIds, question.id]));
                }
            }
        } catch (error) {
            console.error("Error voting:", error);
        } finally {
            setIsVoting(false);
        }
    };

    const getEmbedUrl = (url: string) => {
        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        // Loom
        const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9-]+)/);
        if (loomMatch) {
            return `https://www.loom.com/embed/${loomMatch[1]}`;
        }

        return null;
    };

    return (
        <div className="bg-white border border-onyx/10 rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-onyx/50 uppercase tracking-wide">
                            {question.authorName}
                        </span>
                        {question.status === "answered_live" && (
                            <Badge className="bg-moss text-white hover:bg-moss/90 border-transparent">Answered Live</Badge>
                        )}
                        {question.status === "answered_online" && (
                            <Badge className="bg-walnut text-white hover:bg-walnut/90 border-transparent">Answered Online</Badge>
                        )}
                    </div>

                    <h3 className="font-sans text-lg text-onyx leading-relaxed">
                        {question.text}
                    </h3>
                </div>

                <Button
                    onClick={handleVote}
                    disabled={hasVoted || isVoting}
                    variant="outline"
                    size="sm"
                    className={cn(
                        "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[60px] border-secondary/20 transition-colors",
                        hasVoted
                            ? "bg-moss text-white border-moss hover:bg-moss opacity-100"
                            : "hover:bg-bone hover:text-cedar text-onyx/60"
                    )}
                >
                    <ThumbsUp className={cn("w-5 h-5", hasVoted && "fill-current")} />
                    <span className="text-xs font-bold">{optimisticVoteCount}</span>
                </Button>
            </div>

            {question.answer && (
                <div className="mt-6 pt-4 border-t border-onyx/5 bg-gray-50/50 -mx-5 px-5 pb-5 rounded-b-2xl">
                    <div className="space-y-3">

                        {question.answer.videoUrl && (
                            <div className="relative w-full text-center my-3 bg-black rounded-lg overflow-hidden"
                                style={{ paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                                {getEmbedUrl(question.answer.videoUrl) ? (
                                    <iframe
                                        src={getEmbedUrl(question.answer.videoUrl)!}
                                        className="absolute top-0 left-0 w-full h-full"
                                        frameBorder="0"
                                        allowFullScreen
                                        title="Answer Video"
                                    />
                                ) : (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-sm">
                                        Video unavailable
                                    </div>
                                )}
                            </div>
                        )}

                        {question.answer.answerText && (
                            <p className="text-onyx/80 text-sm whitespace-pre-wrap">
                                {question.answer.answerText}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
