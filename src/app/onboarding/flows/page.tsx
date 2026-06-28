"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Code2,
  Eye,
  Fingerprint,
  Lock,
  Mail,
  Settings2,
} from "lucide-react";

import onboardingBackground from "@/Images/onboard_Flow/Background.png";
import planBuildDeliverImage from "@/Images/onboard_Flow/Plan. Build. Deliver..png";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Plan. Build. Deliver.",
    body: "End-to-end construction solutions built on precision, quality, and trust.",
    icon: Building2,
    visual: "construction",
  },
  {
    title: "Smart IT Solutions",
    body: "Scalable, secure, and innovative technology to power your business.",
    icon: Code2,
    visual: "technology",
  },
  {
    title: "Integrated Approach",
    body: "We combine construction expertise with IT innovation for seamless project execution.",
    icon: Settings2,
    visual: "integrated",
  },
] as const;

const services = [
  {
    label: "Construction",
    body: "From design to delivery, we build infrastructure that stands the test of time.",
    icon: Building2,
  },
  {
    label: "Technology",
    body: "Reliable software, cloud systems, and automation for faster business operations.",
    icon: Code2,
  },
  {
    label: "Operations",
    body: "Connected workflows that keep teams, timelines, and project data aligned.",
    icon: Settings2,
  },
  {
    label: "Delivery",
    body: "Practical support that helps every project move from idea to signed kickoff.",
    icon: Fingerprint,
  },
] as const;

function SlideVisual({
  type,
}: {
  type: (typeof slides)[number]["visual"];
}) {
  return (
    <div className="relative h-[48svh] min-h-[340px] w-full overflow-hidden rounded-b-[42px] bg-zinc-950 sm:h-[54svh] lg:h-full lg:min-h-0 lg:rounded-b-none lg:rounded-r-[56px]">
      <Image
        src={onboardingBackground}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 52vw, 100vw"
        className="object-cover object-center"
      />
      <div className="onboarding-image-glow absolute left-[52%] top-[42%] h-[42%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff200]/45" />
      <div className="onboarding-transparent-ring absolute left-[52%] top-[42%] size-[42vw] max-h-[520px] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#fff200]/20" />
      <Image
        src={planBuildDeliverImage}
        alt="Plan. Build. Deliver."
        priority
        sizes="(min-width: 1024px) 52vw, 100vw"
        className={cn(
          "onboarding-foreground-image absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1 -translate-y-5 object-contain drop-shadow-[0_24px_55px_rgba(255,242,0,0.24)] sm:h-[90%] sm:w-[90%] lg:h-[88%] lg:w-[88%]",
          type === "technology" && "rotate-[1.5deg]",
          type === "integrated" && "rotate-[-1.5deg]",
        )}
      />

    </div>
  );
}

function Dots({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`Step ${activeIndex + 1} of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "h-2 rounded-full transition-all",
            activeIndex === index ? "w-7 bg-[#fff200]" : "w-2 bg-zinc-300",
          )}
        />
      ))}
    </div>
  );
}

function PrimarySlide({
  index,
  onNext,
  onSkip,
}: {
  index: number;
  onNext: () => void;
  onSkip: () => void;
}) {
  const slide = slides[index]!;
  const Icon = slide.icon;

  return (
    <section className="grid h-full min-h-0 bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <SlideVisual type={slide.visual} />
      <div className="flex min-h-0 flex-1 flex-col justify-between px-6 pb-6 pt-8 sm:px-10 lg:px-14 lg:py-12">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center text-center lg:max-w-lg">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#fff200] shadow-lg shadow-yellow-200/60">
            <Icon className="size-9 text-zinc-950" strokeWidth={1.9} />
          </div>
          <h1 className="text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl lg:text-5xl">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-sm text-base leading-7 text-zinc-600 sm:text-lg">{slide.body}</p>
          <div className="mt-8">
            <Dots activeIndex={index} />
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-4 lg:max-w-lg">
          <button
            type="button"
            onClick={onSkip}
            className="h-12 rounded-full px-5 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-700 transition hover:bg-[#fff200]/20 hover:text-zinc-950"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={onNext}
            className="h-12 min-w-32 rounded-full bg-[#fff200] px-7 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-950 shadow-xl shadow-yellow-200/60 transition hover:-translate-y-0.5 hover:bg-[#f5e500]"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

function ServicesStep({
  onNext,
  selectedService,
  setSelectedService,
}: {
  onNext: () => void;
  selectedService: number;
  setSelectedService: (value: number) => void;
}) {
  const service = services[selectedService]!;

  return (
    <section className="grid h-full min-h-0 bg-white lg:grid-cols-[1fr_1fr]">
      <div className="relative flex min-h-[42svh] overflow-hidden bg-[linear-gradient(125deg,#34342f_0%,#1c1c1b_52%,#080808_100%)] px-6 py-10 sm:px-10 lg:min-h-0 lg:items-center lg:px-16">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff200]/25 blur-3xl" />
        <div className="absolute -bottom-24 left-[-12%] h-52 w-[128%] -rotate-6 rounded-[50%] bg-white" />


        <div className="relative z-10 max-w-lg self-center">
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Let&apos;s build something great together!
          </h1>
          <p className="mt-5 max-w-sm text-base leading-7 text-zinc-200 sm:text-lg">
            Tap on the icons to see how we can help you.
          </p>
        </div>
      </div>

      <div className="flex min-h-0 flex-col justify-between px-6 py-6 sm:px-10 lg:px-14 lg:py-12">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
          <div className="grid grid-cols-4 gap-3 rounded-[28px] bg-zinc-100 p-2">
            {services.map((item, index) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedService(index)}
                  aria-label={item.label}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-2xl transition",
                    selectedService === index
                      ? "bg-[#fff200] text-zinc-950 shadow-lg shadow-yellow-200/60"
                      : "bg-white text-zinc-700 hover:text-zinc-950",
                  )}
                >
                  <Icon className="size-7" />
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-[32px] border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-950/5">
            <h2 className="text-3xl font-semibold text-zinc-950">{service.label}</h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">{service.body}</p>
          </div>

          <div className="mt-8">
            <Dots activeIndex={3} />
          </div>
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-lg items-center justify-between gap-4">
          <button
            type="button"
            onClick={onNext}
            className="h-12 rounded-full px-5 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-700 transition hover:bg-[#fff200]/20 hover:text-zinc-950"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={onNext}
            className="h-12 min-w-44 rounded-full bg-[#fff200] px-7 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-950 shadow-xl shadow-yellow-200/60 transition hover:-translate-y-0.5 hover:bg-[#f5e500]"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}

function SignupStep({
  workspaceName,
  setWorkspaceName,
  onSubmit,
}: {
  workspaceName: string;
  setWorkspaceName: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <section className="grid h-full min-h-0 bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-[linear-gradient(125deg,#34342f_0%,#1c1c1b_52%,#080808_100%)] lg:block">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff200]/25 blur-3xl" />


        <div className="absolute left-16 top-1/2 max-w-sm -translate-y-1/2">
          <h1 className="text-5xl font-semibold leading-tight text-white">Welcome!</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-200">Create your account to continue.</p>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-col justify-center overflow-hidden px-6 py-10 sm:px-10 lg:px-16">
        <div className="absolute -top-28 right-[-18%] size-72 rounded-full bg-[#fff200]/28 blur-xl lg:hidden" />
        <div className="relative mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <h1 className="text-4xl font-semibold leading-tight text-zinc-950">Welcome!</h1>
            <p className="mt-3 text-base leading-7 text-zinc-600">Create your account to continue.</p>
          </div>

          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-800">Workspace / Company name</span>
              <span className="flex h-14 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 transition focus-within:border-zinc-950 focus-within:bg-white">
                <Building2 className="size-5 text-zinc-500" />
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(event) => setWorkspaceName(event.target.value)}
                  placeholder="Acme Co"
                  className="min-w-0 flex-1 bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-400"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-800">Email address</span>
              <span className="flex h-14 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 transition focus-within:border-zinc-950 focus-within:bg-white">
                <Mail className="size-5 text-zinc-500" />
                <input
                  type="email"
                  placeholder="youremail@example.com"
                  className="min-w-0 flex-1 bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-400"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-zinc-800">Password</span>
              <span className="flex h-14 items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 transition focus-within:border-zinc-950 focus-within:bg-white">
                <Lock className="size-5 text-zinc-500" />
                <input
                  type="password"
                  placeholder="********"
                  className="min-w-0 flex-1 bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-400"
                />
                <Eye className="size-5 text-zinc-400" />
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm leading-6 text-zinc-600">
              <input type="checkbox" className="mt-1 size-4 rounded border-zinc-300 accent-zinc-950" />
              <span>
                I agree to the <strong className="font-semibold text-zinc-950">Terms of Service</strong> and{" "}
                <strong className="font-semibold text-zinc-950">Privacy Policy</strong>
              </span>
            </label>

            <button
              type="submit"
              className="h-14 w-full rounded-full bg-[#fff200] text-sm font-semibold uppercase tracking-[0.16em] text-zinc-950 shadow-xl shadow-yellow-200/60 transition hover:-translate-y-0.5 hover:bg-[#f5e500]"
            >
              Sign In
            </button>
          </form>

          {/* <p className="mt-7 text-center text-sm text-zinc-500">
            Already have an account? <strong className="font-semibold text-zinc-950">Sign in</strong>
          </p> */}
        </div>
      </div>
    </section>
  );
}

export default function OnboardingFlowsPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(0);
  const [clientData, setClientData] = useState({ name: "" });
  const isFirstStep = step === 0;
  const isSignupStep = step === 4;

  function openClientDashboard() {
    const slug =
      clientData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_-]/g, "") || "concolabs_demo";

    router.push(`/onboarding/${slug}_dashboard`);
  }

  const currentPage = useMemo(() => {
    if (step < 3) {
      return <PrimarySlide index={step} onNext={() => setStep(step + 1)} onSkip={() => setStep(4)} />;
    }

    if (step === 3) {
      return (
        <ServicesStep
          onNext={() => setStep(4)}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
        />
      );
    }

    return (
      <SignupStep
        workspaceName={clientData.name}
        setWorkspaceName={(name) => setClientData({ name })}
        onSubmit={openClientDashboard}
      />
    );
  }, [clientData.name, selectedService, step]);

  return (
    <main className="fixed inset-0 z-[60] flex min-h-[100svh] bg-zinc-100 text-zinc-950">
      <style jsx global>{`
        .onboarding-image-glow {
          filter: blur(38px);
          opacity: 0.58;
          mix-blend-mode: screen;
          animation: onboarding-glow-breathe 4s ease-in-out infinite;
        }

        .onboarding-transparent-ring {
          animation: onboarding-ring-pulse 4.8s ease-in-out infinite;
        }

        .onboarding-foreground-image {
          animation: onboarding-foreground-float 4.4s ease-in-out infinite;
        }

        @keyframes onboarding-glow-breathe {
          0%,
          100% {
            opacity: 0.42;
            transform: translate(-50%, -50%) scale(0.9);
          }
          50% {
            opacity: 0.72;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }

        @keyframes onboarding-ring-pulse {
          0%,
          100% {
            opacity: 0.18;
            transform: translate(-50%, -50%) scale(0.94);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes onboarding-foreground-float {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-10px) scale(1.025);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .onboarding-image-glow,
          .onboarding-transparent-ring,
          .onboarding-foreground-image {
            animation: none;
          }
        }
      `}</style>
      <div className="mx-auto flex h-[100svh] w-full max-w-[1600px] items-stretch justify-center p-0 lg:p-8">
        <div className="relative h-full w-full overflow-hidden bg-white shadow-2xl shadow-zinc-950/10 lg:rounded-[36px]">
          {!isFirstStep && (
            <button
              type="button"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              className="absolute left-4 top-4 z-20 flex size-11 items-center justify-center rounded-full bg-[#fff200] text-zinc-950 shadow-lg shadow-yellow-200/60 backdrop-blur transition hover:bg-[#f5e500] sm:left-6 sm:top-6"
              aria-label="Go back"
            >
              <ArrowLeft className="size-5" />
            </button>
          )}

          {currentPage}

          {isSignupStep && (
            <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
              <Dots activeIndex={4} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
