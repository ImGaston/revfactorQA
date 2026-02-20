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
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReverting, setIsReverting] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

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

    const handleVote = () => {
        if (hasVoted || isVoting) return;

        // Optimistic UI updates
        setHasVoted(true);
        setOptimisticVoteCount(prev => prev + 1);

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        // Optimistic localStorage update
        const storedVotes = localStorage.getItem("rf_voted");
        const votedIds = storedVotes ? JSON.parse(storedVotes) : [];
        if (!votedIds.includes(question.id)) {
            localStorage.setItem("rf_voted", JSON.stringify([...votedIds, question.id]));
        }

        setIsVoting(true);
        const fingerprint = getOrCreateFingerprint();

        // Background call (no await)
        submitVote(question.id, fingerprint)
            .then(result => {
                if (!result.success || result.alreadyVoted) {
                    revertVote();
                }
            })
            .catch(error => {
                console.error("Error voting:", error);
                revertVote();
            })
            .finally(() => {
                setIsVoting(false);
            });
    };

    const revertVote = () => {
        setHasVoted(false);
        setOptimisticVoteCount(prev => prev - 1);

        const currentStoredVotes = localStorage.getItem("rf_voted");
        if (currentStoredVotes) {
            const currentVotedIds = JSON.parse(currentStoredVotes);
            const updatedVotedIds = currentVotedIds.filter((id: string) => id !== question.id);
            localStorage.setItem("rf_voted", JSON.stringify(updatedVotedIds));
        }

        setIsReverting(true);
        setTimeout(() => setIsReverting(false), 2000);
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

                <div className="flex flex-col items-center relative">
                    <Button
                        onClick={handleVote}
                        disabled={hasVoted || isVoting}
                        variant="outline"
                        size="sm"
                        className={cn(
                            "flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[60px] border-secondary/20 transition-all duration-300",
                            hasVoted
                                ? "bg-moss text-white border-moss hover:bg-moss opacity-100"
                                : "hover:bg-bone hover:text-cedar text-onyx/60",
                            isAnimating && "ring-2 ring-moss/30 rounded-full"
                        )}
                    >
                        <ThumbsUp
                            className={cn(
                                "w-5 h-5 transition-all duration-300 ease-out",
                                hasVoted ? "fill-current text-white" : "text-current",
                                isAnimating ? "scale-125" : "scale-100"
                            )}
                        />
                        <span className="text-xs font-bold">{optimisticVoteCount}</span>
                    </Button>
                    {isReverting && (
                        <span className="absolute -bottom-6 text-[10px] font-medium text-red-500 whitespace-nowrap animate-in fade-in duration-200">
                            Already voted
                        </span>
                    )}
                </div>
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
                            <div className="flex flex-col items-start gap-1">
                                <p className="text-onyx/80 text-sm whitespace-pre-wrap transition-all duration-200">
                                    {question.answer.answerText.length <= 280
                                        ? question.answer.answerText
                                        : isExpanded
                                            ? question.answer.answerText
                                            : `${question.answer.answerText.slice(0, 280)}...`}
                                </p>
                                {question.answer.answerText.length > 280 && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="text-xs font-sans font-medium text-moss underline-offset-2 hover:underline cursor-pointer bg-transparent border-none p-0 transition-all duration-200"
                                    >
                                        {isExpanded ? "Show less" : "Read more"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
