import { QuestionForm } from "@/components/QuestionForm";
import { QuestionList } from "@/components/QuestionList";

export default function Home() {
  return (
    <main className="min-h-screen bg-bone/30 pb-20">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-bone via-bone/50 to-transparent -z-10" />

      <div className="container max-w-4xl mx-auto px-4 pt-12 md:pt-20">
        <header className="text-center mb-12 space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cedar tracking-tight">
            RevFactor Q&amp;A
          </h1>
          <p className="text-lg md:text-xl text-walnut max-w-2xl mx-auto font-light leading-relaxed">
            Submit your burning questions for the revenue management workshop
            and vote on the topics you want covered most.
          </p>
        </header>

        <QuestionForm />

        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl text-cedar">
              Latest Questions
            </h2>
            <div className="text-sm text-onyx/50 font-medium">
              Top Voted
            </div>
          </div>

          <QuestionList />
        </div>
      </div>
    </main>
  );
}
