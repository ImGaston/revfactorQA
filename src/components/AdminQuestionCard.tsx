"use client";

import { useState } from "react";
import { QuestionWithAnswer, QuestionStatus } from "@/types";
import { updateStatus, updateAnswer } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Check, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminQuestionCardProps {
    question: QuestionWithAnswer;
}

export function AdminQuestionCard({ question }: AdminQuestionCardProps) {
    const [status, setStatus] = useState<QuestionStatus>(question.status);
    const [answerText, setAnswerText] = useState(question.answer?.answerText || "");
    const [videoUrl, setVideoUrl] = useState(question.answer?.videoUrl || "");
    const [isExpanded, setIsExpanded] = useState(!!question.answer);
    const [isSavingStatus, setIsSavingStatus] = useState(false);
    const [isSavingAnswer, setIsSavingAnswer] = useState(false);
    const [statusSaved, setStatusSaved] = useState(false);
    const [answerSaved, setAnswerSaved] = useState(false);

    const handleStatusChange = async (value: string) => {
        const newStatus = value as QuestionStatus;
        setStatus(newStatus);
        setIsSavingStatus(true);
        setStatusSaved(false);

        try {
            await updateStatus(question.id, newStatus);
            setStatusSaved(true);
            setTimeout(() => setStatusSaved(false), 2000);
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert optimization on error if needed, but keeping simple for now
        } finally {
            setIsSavingStatus(false);
        }
    };

    const handleSaveAnswer = async () => {
        setIsSavingAnswer(true);
        setAnswerSaved(false);

        try {
            await updateAnswer(question.id, answerText, videoUrl);
            setAnswerSaved(true);
            setTimeout(() => setAnswerSaved(false), 2000);
        } catch (error) {
            console.error("Failed to save answer", error);
        } finally {
            setIsSavingAnswer(false);
        }
    };

    const getStatusColor = (s: QuestionStatus) => {
        switch (s) {
            case "answered_live": return "bg-moss text-white border-moss";
            case "answered_online": return "bg-walnut text-white border-walnut";
            default: return "bg-gray-100 text-onyx/60 border-gray-200";
        }
    };

    return (
        <div className="bg-white border border-onyx/10 rounded-2xl p-5 mb-4 shadow-sm">
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-onyx/40 uppercase tracking-wide">
                            {question.authorName}
                        </span>
                        <Badge variant="outline" className="text-onyx/60 border-onyx/20 text-[10px] px-2 h-5">
                            {question.voteCount} Votes
                        </Badge>
                    </div>
                    <p className="font-sans text-lg text-onyx font-medium">
                        {question.text}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2 min-w-[140px]">
                    <div className="flex items-center gap-2">
                        {statusSaved && <span className="text-xs text-moss font-medium animate-in fade-in">Saved</span>}
                        {isSavingStatus && <Loader2 className="w-3 h-3 animate-spin text-onyx/40" />}
                    </div>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className={cn("w-[160px] h-8 text-xs font-medium", getStatusColor(status))}>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="answered_live">Answered Live</SelectItem>
                            <SelectItem value="answered_online">Answered Online</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-onyx/5">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm font-medium text-cedar hover:text-cedar/80 transition-colors mb-4"
                >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {isExpanded ? "Hide Answer" : "Add/Edit Answer"}
                </button>

                {isExpanded && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                        <Textarea
                            placeholder="Write your answer here..."
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            className="bg-gray-50/50 min-h-[100px]"
                        />

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-onyx/60">Video URL (optional)</label>
                            <Input
                                placeholder="YouTube or Loom URL"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                className="bg-gray-50/50"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            {answerSaved && (
                                <span className="flex items-center gap-1.5 text-moss text-sm font-medium animate-in fade-in">
                                    <Check className="w-4 h-4" />
                                    Saved
                                </span>
                            )}

                            <Button
                                onClick={handleSaveAnswer}
                                disabled={isSavingAnswer}
                                className="bg-cedar hover:bg-cedar/90 text-bone uppercase font-bold text-xs tracking-wider px-6"
                            >
                                {isSavingAnswer ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Answer"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
