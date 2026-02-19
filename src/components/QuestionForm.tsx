"use client";

import { useState } from "react";
import { submitQuestion } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function QuestionForm() {
    const [authorName, setAuthorName] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authorName.trim() || !questionText.trim()) return;

        setIsSubmitting(true);
        setError("");
        setSuccess(false);

        try {
            await submitQuestion(questionText, authorName);
            setAuthorName("");
            setQuestionText("");
            setSuccess(true);
            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError("Failed to submit question. Please try again.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto bg-white/50 backdrop-blur-sm border-onyx/10 shadow-sm mb-8">
            <CardHeader>
                <CardTitle className="font-serif text-2xl text-cedar">
                    Ask a Question
                </CardTitle>
            </CardHeader>
            <CardContent>
                {success ? (
                    <div className="bg-moss/10 text-moss p-4 rounded-lg text-center font-medium animate-in fade-in">
                        Question submitted successfully!
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="authorName" className="text-sm font-medium text-onyx/70">
                                Your Name
                            </label>
                            <Input
                                id="authorName"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                placeholder="Enter your name"
                                className="bg-white"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="questionText" className="text-sm font-medium text-onyx/70">
                                Question
                            </label>
                            <Textarea
                                id="questionText"
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value.slice(0, 500))}
                                placeholder="What would you like to ask?"
                                className="bg-white min-h-[100px]"
                                required
                            />
                            <div className="text-xs text-right text-onyx/40">
                                {questionText.length}/500
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting || !authorName.trim() || !questionText.trim()}
                            className="bg-cedar hover:bg-cedar/90 text-bone uppercase rounded-full font-sans font-bold tracking-widest text-xs px-6 py-2 w-full sm:w-auto"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting
                                </>
                            ) : (
                                "Submit Question"
                            )}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
