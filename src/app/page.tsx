import { QuestionForm } from "@/components/QuestionForm";
import { QuestionList } from "@/components/QuestionList";
import Image from "next/image";
import { MarketingFooter } from "@/components/MarketingFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-bone/30">
      <nav className="sticky top-0 bg-bone/80 backdrop-blur-sm border-b border-onyx/10 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center w-full">
          {/* Left side: RevFactor logo */}
          <div className="bg-[#DDDAD3 ] rounded-lg px-3 py-1 flex items-center">
            <Image
              src="/RevFactor_logo.png"
              alt="RevFactor Logo"
              width={120}
              height={32}
              className="h-8 w-auto"
              style={{ width: "auto" }}
              priority
            />
          </div>

          {/* Right side: Level Up Your Listing Summit logo */}
          <div className="flex items-center">
            <Image
              src="/LUYL 2025 Logo.png"
              alt="Level Up Your Listing Summit Logo"
              width={100}
              height={48}
              className="h-12 w-auto"
              style={{ width: "auto" }}
              priority
            />
          </div>
        </div>
      </nav>

      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-bone via-bone/50 to-transparent -z-10" />

      <div className="container max-w-4xl mx-auto px-4 pt-8 md:pt-16">
        <header className="text-center mb-12 space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cedar tracking-tight">
            LUYL Workshop Q&amp;A
          </h1>
          <p className="text-lg md:text-xl text-walnut max-w-2xl mx-auto font-light leading-relaxed">
            Submit your burning questions for the revenue management workshop
            and vote on the topics you want covered most.
          </p>
        </header>

        <QuestionForm />

        <div className="mt-16 mb-24 md:mb-32">
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
      <MarketingFooter />
    </main>
  );
}
