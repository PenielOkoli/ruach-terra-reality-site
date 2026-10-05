"use client";
import { FormEvent, useState } from "react";
import {
  quoteFields as fields,
  quoteProjectTypes,
  quoteRequiredFields,
} from "@/content/quote";
import { sendQuote } from "@/lib/quote/client";

export function QuoteForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      await sendQuote(new FormData(form));
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "The request could not be sent.",
      );
    }
  }
  if (status === "success")
    return (
      <div className="grid min-h-[460px] place-items-center border-y-2 border-ink px-6 text-center">
        <div>
          <p className="section-label">Request received</p>
          <h2 className="mt-3 font-display text-4xl leading-none tracking-tight">
            Thank you. Your project information has been sent.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-clay">
            The Ruach team will review the details you provided and respond
            using your contact information.
          </p>
          <button
            type="button"
            className="btn btn-navy mt-8"
            onClick={() => setStatus("idle")}
          >
            Send another request
          </button>
        </div>
      </div>
    );
  return (
    <form onSubmit={submit} className="border-t-2 border-ink">
      <div className="grid gap-x-6 sm:grid-cols-2">
        {fields.map(([name, label, type]) => (
          <label
            key={name}
            className="block border-b border-line py-5 text-xs font-bold uppercase tracking-[.08em] text-clay"
          >
            {label}
            <span className="ml-1 text-rust">
              {(quoteRequiredFields as readonly string[]).includes(name)
                ? "*"
                : ""}
            </span>
            <input
              name={name}
              type={type}
              min={type === "number" ? 0 : undefined}
              required={(quoteRequiredFields as readonly string[]).includes(
                name,
              )}
              className="mt-3 block w-full bg-transparent text-base font-medium normal-case tracking-normal text-ink outline-none placeholder:text-[#989187]"
            />
          </label>
        ))}
        <label className="block border-b border-line py-5 text-xs font-bold uppercase tracking-[.08em] text-clay">
          Project type<span className="ml-1 text-rust">*</span>
          <select
            name="projectType"
            required
            className="mt-3 block w-full bg-transparent text-base font-medium normal-case tracking-normal text-ink outline-none"
          >
            <option value="">Select project type</option>
            {quoteProjectTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className="block border-b border-line py-5 text-xs font-bold uppercase tracking-[.08em] text-clay">
          Supporting file
          <input
            name="attachment"
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="mt-3 block w-full text-sm normal-case tracking-normal text-ink file:mr-3 file:border-0 file:bg-[#ddd7cc] file:px-3 file:py-2 file:text-xs file:font-bold file:text-ink"
          />
        </label>
      </div>
      <label className="block border-b border-line py-5 text-xs font-bold uppercase tracking-[.08em] text-clay">
        Project brief
        <textarea
          name="message"
          rows={5}
          className="mt-3 block w-full resize-y bg-transparent text-base font-medium normal-case leading-7 tracking-normal text-ink outline-none"
          placeholder="Describe the project, source conditions or site requirements."
        />
      </label>
      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-5 text-clay">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-[#a44c2a]"
        />
        I agree that Ruach Dredging may contact me about this project request.
      </label>
      {status === "error" && (
        <p role="alert" className="mt-4 text-sm font-semibold text-[#a44c2a]">
          {message}
        </p>
      )}
      <button
        className="btn btn-primary mt-7 disabled:opacity-60"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending request" : "Send project request"}
      </button>
      <p className="mt-4 text-xs leading-5 text-clay">
        Required fields are marked *. Do not include sensitive information.
      </p>
    </form>
  );
}
