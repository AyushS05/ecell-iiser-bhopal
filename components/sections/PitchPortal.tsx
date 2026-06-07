"use client";
// components/sections/PitchPortal.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Editorial Brutalism — pitch submission form.
// Amber accent throughout. No cyan/violet. Ruled borders, DM Mono.
// Logic identical to original; only colors and styling updated.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, AnimatePresence, Variants } from "framer-motion";
import React, { useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle, ArrowRight, ArrowLeft,
  Loader2, AlertTriangle, ArrowUpRight,
} from "lucide-react";

import { submitPitch } from "@/actions/pitch";
import { pitchFormSchema, type PitchFormValues } from "@/config/pitch-schema";
import { siteConfig } from "@/config/site";

// ── Step Definitions ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: "Who are you?",   subtitle: "Let's start with the founder.",          fields: ["name", "email"]          as const },
  { id: 2, title: "The Big Idea",   subtitle: "Name your venture and its current stage.", fields: ["ideaName", "stage"]       as const },
  { id: 3, title: "The Problem",    subtitle: "What pain are you solving? Be specific.",  fields: ["problem"]                 as const },
] as const;

// ── Slide variants ────────────────────────────────────────────────────────────
const slideVariants: Variants = {
  enter:  (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, filter: "blur(4px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:   (d: number) => ({ x: d < 0 ? 60 : -60, opacity: 0, filter: "blur(4px)", transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

// ── Input base style — amber focus instead of cyan ────────────────────────────
const inputBase =
  "w-full border px-4 py-3.5 text-sm placeholder:text-white/20 outline-none transition-all duration-300 " +
  "hover:border-white/20 aria-[invalid=true]:border-rose-500/50";

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  background: "rgba(255,255,255,0.025)",
  borderColor: "rgba(255,255,255,0.1)",
  color: "#f0ede6",
  borderRadius: 0,
};

// ── FieldWrapper ──────────────────────────────────────────────────────────────
interface FieldWrapperProps {
  label: string; error?: string; children: React.ReactNode; hint?: string;
}
function FieldWrapper({ label, error, children, hint }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        style={{
          fontFamily: "var(--font-mono)", fontSize: "0.6rem",
          letterSpacing: "0.16em", textTransform: "uppercase",
          color: "rgba(240,237,230,0.4)",
        }}
      >
        {label}
      </label>
      {children}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-rose-400"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem" }}
          >
            <AlertTriangle size={11} />{error}
          </motion.p>
        ) : hint ? (
          <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "rgba(240,237,230,0.25)" }}
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ── Stage Selector ────────────────────────────────────────────────────────────
interface StageSelectorProps { value: string; onChange: (val: string) => void; error?: string; }
function StageSelector({ value, onChange, error }: StageSelectorProps) {
  const { stages } = (siteConfig as any).pitchPortal;
  return (
    <FieldWrapper label="Current Stage" error={error}>
      <div className="grid grid-cols-2 gap-[1px]" style={{ background: "rgba(255,255,255,0.07)" }}>
        {stages.map((stage: { value: string; label: string }) => (
          <button
            key={stage.value}
            type="button"
            onClick={() => onChange(stage.value)}
            className="relative px-4 py-3 text-left transition-all duration-200"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              letterSpacing: "0.04em",
              background: value === stage.value ? "var(--color-amber-dim)" : "var(--color-surface)",
              color: value === stage.value ? "var(--color-amber)" : "rgba(240,237,230,0.4)",
              borderLeft: value === stage.value ? "2px solid var(--color-amber)" : "2px solid transparent",
            }}
          >
            {stage.label}
          </button>
        ))}
      </div>
    </FieldWrapper>
  );
}

// ── Progress Bar — amber ──────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div className="relative flex items-center justify-center">
            <div
              className="w-7 h-7 flex items-center justify-center transition-all duration-300"
              style={{
                border: `1px solid ${i < step ? "var(--color-amber)" : "rgba(255,255,255,0.12)"}`,
                background: i < step ? "var(--color-amber)" : "transparent",
              }}
            >
              {i < step - 1 ? (
                <CheckCircle size={13} style={{ color: "#0c0b09" }} />
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.65rem",
                    color: i === step - 1 ? "#0c0b09" : "rgba(240,237,230,0.3)",
                    fontWeight: i === step - 1 ? 700 : 400,
                  }}
                >
                  {i + 1}
                </span>
              )}
            </div>
            {/* Pulse ring on active step */}
            {i === step - 1 && (
              <motion.div
                className="absolute inset-0"
                style={{ border: "1px solid rgba(232,160,32,0.4)" }}
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </div>
          {i < total - 1 && (
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                className="h-full"
                style={{ background: "var(--color-amber)" }}
                animate={{ width: i < step - 1 ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "rgba(240,237,230,0.28)" }}>
        {step} / {total}
      </span>
    </div>
  );
}

// ── Success State — amber ─────────────────────────────────────────────────────
function SuccessState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center text-center gap-6 py-8"
    >
      <motion.div
        className="w-20 h-20 flex items-center justify-center"
        style={{
          border: "1px solid rgba(232,160,32,0.4)",
          background: "rgba(232,160,32,0.08)",
        }}
        animate={{ boxShadow: ["0 0 0 0 rgba(232,160,32,0.3)", "0 0 0 24px rgba(232,160,32,0)", "0 0 0 0 rgba(232,160,32,0)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <CheckCircle size={34} style={{ color: "var(--color-amber)" }} />
      </motion.div>
      <div className="space-y-3">
        <h3
          style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "0.04em", color: "#f0ede6" }}
        >
          PITCH RECEIVED
        </h3>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", lineHeight: 1.7, color: "rgba(240,237,230,0.5)" }}>
          {message}
        </p>
      </div>
      <span
        className="inline-flex items-center gap-2 px-4 py-2"
        style={{
          fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.12em",
          textTransform: "uppercase", border: "1px solid rgba(232,160,32,0.3)",
          color: "var(--color-amber)", background: "rgba(232,160,32,0.06)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-amber)", animation: "amber-pulse 1.8s ease-in-out infinite" }} />
        Welcome to the cohort
      </span>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PitchPortal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction,   setDirection]   = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg,  setSuccessMsg]  = useState<string | null>(null);
  const [isPending,   startTransition] = useTransition();

  const { sectionLabel, headline, subheadline } = (siteConfig as any).pitchPortal;

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } =
    useForm<PitchFormValues>({
      resolver: zodResolver(pitchFormSchema),
      mode: "onTouched",
      defaultValues: { name: "", email: "", ideaName: "", stage: undefined, problem: "" },
    });

  const stageValue   = watch("stage");
  const problemValue = watch("problem");
  const stepConfig   = STEPS[currentStep - 1];

  const handleNext = async () => {
    const valid = await trigger(stepConfig.fields as unknown as (keyof PitchFormValues)[]);
    if (!valid) return;
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };
  const handleBack = () => { setDirection(-1); setCurrentStep((s) => Math.max(s - 1, 1)); };

  const onSubmit: SubmitHandler<PitchFormValues> = (data) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitPitch(data);
      if (result.success) setSuccessMsg(result.message);
      else setServerError(result.error ?? "Something went wrong.");
    });
  };

  return (
    <section id="pitch" className="relative py-28 px-4">
      {/* Subtle amber gradient — replaces violet blob */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div
          style={{
            position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
            width: 500, height: 320,
            background: "radial-gradient(ellipse, rgba(232,160,32,0.05) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "2.5rem" }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span
                className="inline-flex items-center gap-3 mb-5"
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,230,0.3)" }}
              >
                <span className="w-5 h-px" style={{ background: "var(--color-amber)", opacity: 0.7 }} />
                {sectionLabel}
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 7vw, 5rem)",
                  lineHeight: 0.95, letterSpacing: "0.01em",
                  color: "rgba(240,237,230,0.9)", textTransform: "uppercase",
                }}
              >
                {headline}
              </h2>
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", lineHeight: 1.7, color: "rgba(240,237,230,0.35)", maxWidth: 340 }}>
              {subheadline}
            </p>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-lg mx-auto"
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(17,16,8,0.85)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Top amber rule */}
            <div style={{ height: 2, background: "var(--color-amber)", opacity: 0.7 }} />

            <div className="p-8 md:p-10">
              {successMsg ? (
                <SuccessState message={successMsg} />
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <ProgressBar step={currentStep} total={STEPS.length} />

                  {/* Step header */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`hdr-${currentStep}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mb-8"
                    >
                      <h3
                        style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", letterSpacing: "0.04em", color: "#f0ede6", textTransform: "uppercase" }}
                      >
                        {stepConfig.title}
                      </h3>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "rgba(240,237,230,0.35)", marginTop: 4 }}>
                        {stepConfig.subtitle}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Fields */}
                  <div className="relative overflow-hidden min-h-[200px]">
                    <AnimatePresence custom={direction} mode="wait">
                      <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="flex flex-col gap-5"
                      >
                        {currentStep === 1 && (
                          <>
                            <FieldWrapper label="Full Name" error={errors.name?.message}>
                              <input
                                {...register("name")}
                                className={inputBase}
                                style={inputStyle}
                                placeholder="Aarav Sharma"
                                autoComplete="name"
                                aria-invalid={!!errors.name}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,160,32,0.6)"; e.currentTarget.style.background = "rgba(232,160,32,0.04)"; }}
                                onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
                              />
                            </FieldWrapper>
                            <FieldWrapper label="Email Address" error={errors.email?.message} hint="Use your @iiserbhopal.ac.in email for priority review.">
                              <input
                                {...register("email")}
                                type="email"
                                className={inputBase}
                                style={inputStyle}
                                placeholder="aarav@iiserbhopal.ac.in"
                                autoComplete="email"
                                aria-invalid={!!errors.email}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,160,32,0.6)"; e.currentTarget.style.background = "rgba(232,160,32,0.04)"; }}
                                onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
                              />
                            </FieldWrapper>
                          </>
                        )}

                        {currentStep === 2 && (
                          <>
                            <FieldWrapper label="Idea / Venture Name" error={errors.ideaName?.message}>
                              <input
                                {...register("ideaName")}
                                className={inputBase}
                                style={inputStyle}
                                placeholder="e.g. NeuroGrid, SolarMesh, BioTrace..."
                                aria-invalid={!!errors.ideaName}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,160,32,0.6)"; e.currentTarget.style.background = "rgba(232,160,32,0.04)"; }}
                                onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
                              />
                            </FieldWrapper>
                            <StageSelector
                              value={stageValue ?? ""}
                              onChange={(val) => setValue("stage", val as PitchFormValues["stage"], { shouldValidate: true })}
                              error={errors.stage?.message}
                            />
                          </>
                        )}

                        {currentStep === 3 && (
                          <FieldWrapper
                            label="The Problem You're Solving"
                            error={errors.problem?.message}
                            hint={`${problemValue?.length ?? 0} / 2000 characters (min 50)`}
                          >
                            <textarea
                              {...register("problem")}
                              rows={6}
                              className={`${inputBase} resize-none`}
                              style={inputStyle}
                              placeholder="Describe the problem clearly: who faces it, how often, and why existing solutions fall short..."
                              aria-invalid={!!errors.problem}
                              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(232,160,32,0.6)"; e.currentTarget.style.background = "rgba(232,160,32,0.04)"; }}
                              onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; }}
                            />
                          </FieldWrapper>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Server error */}
                  <AnimatePresence>
                    {serverError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 px-4 py-3 flex items-center gap-2 text-rose-300"
                        style={{
                          fontFamily: "var(--font-mono)", fontSize: "0.7rem",
                          border: "1px solid rgba(244,63,94,0.3)",
                          background: "rgba(244,63,94,0.06)",
                        }}
                      >
                        <AlertTriangle size={13} className="shrink-0" />{serverError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.5rem" }}>
                    {currentStep > 1 ? (
                      <motion.button
                        type="button"
                        onClick={handleBack}
                        whileHover={{ x: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-5 py-3 transition-all duration-200"
                        style={{
                          fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em",
                          border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,237,230,0.45)",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,237,230,0.7)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(240,237,230,0.45)"; }}
                      >
                        <ArrowLeft size={13} />
                        BACK
                      </motion.button>
                    ) : <div />}

                    {currentStep < STEPS.length ? (
                      <motion.button
                        type="button"
                        onClick={handleNext}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-3 transition-all duration-200"
                        style={{
                          fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em",
                          background: "var(--color-amber)", color: "#0c0b09", fontWeight: 600,
                        }}
                      >
                        CONTINUE
                        <ArrowRight size={13} />
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={isPending}
                        whileHover={!isPending ? { scale: 1.02 } : {}}
                        whileTap={!isPending ? { scale: 0.98 } : {}}
                        className="flex items-center gap-2 px-6 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.08em",
                          background: "var(--color-amber)", color: "#0c0b09", fontWeight: 700,
                        }}
                      >
                        {isPending ? (
                          <><Loader2 size={13} className="animate-spin" />SUBMITTING...</>
                        ) : (
                          <>SUBMIT PITCH<ArrowUpRight size={13} /></>
                        )}
                      </motion.button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          <p
            className="text-center mt-5"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.08em", color: "rgba(240,237,230,0.2)" }}
          >
            Your idea is safe with us. We don&apos;t share submissions with third parties.
          </p>
        </motion.div>
      </div>
    </section>
  );
}