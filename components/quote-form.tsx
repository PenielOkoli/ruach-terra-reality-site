"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  quoteFields as fields,
  quoteProjectTypes,
  quoteRequiredFields,
  quoteEngineeringFields,
} from "@/content/quote";
import { sendQuote } from "@/lib/quote/client";
import { company } from '@/content/site';

function QuoteField({ field, engineering = false }: { field: readonly [string, string, string]; engineering?: boolean }) {
  const [unknown, setUnknown] = useState(false);
  const [name, label, type] = field;
  const required = (quoteRequiredFields as readonly string[]).includes(name);
  return <div className="border-b border-line py-5">
    <label className="block text-xs font-bold uppercase tracking-[.08em] text-clay">
      {label}{required && <span className="ml-1 text-rust">*</span>}
      <input name={unknown ? undefined : name} type={type} min={type === 'number' ? '0.01' : undefined} step={type === 'number' ? 'any' : undefined} maxLength={type !== 'number' ? 2000 : undefined} required={required} disabled={unknown} autoComplete={({ name: 'name', phone: 'tel', email: 'email', company: 'organization' } as Record<string, string>)[name]} className="mt-3 block w-full bg-transparent text-base font-medium normal-case tracking-normal text-ink placeholder:text-clay disabled:opacity-50" placeholder={engineering ? 'Leave blank if unknown' : undefined} />
    </label>
    {engineering && type === 'number' && <label className="mt-3 flex items-center gap-2 text-sm text-clay"><input type="checkbox" checked={unknown} onChange={event => setUnknown(event.target.checked)} className="accent-[#a44c2a]" />Not sure yet{unknown && <input type="hidden" name={name} value="Not sure yet" />}</label>}
  </div>;
}

export function QuoteForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (status === 'success') successRef.current?.focus(); }, [status]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'loading') return;
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
      <div ref={successRef} tabIndex={-1} role="status" className="grid min-h-[460px] place-items-center border-y-2 border-ink px-6 text-center">
        <div>
          <p className="section-label">Request accepted</p>
          <h2 className="mt-3 font-display text-4xl leading-none tracking-tight">
            Thank you. Your enquiry has been accepted.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-clay">
            Your enquiry was accepted by our delivery service for the Ruach team.
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
    <form onSubmit={submit} className="border-t-2 border-ink" aria-busy={status === 'loading'}>
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-x-6 sm:grid-cols-2">
        {fields.slice(0, 3).map(field => <QuoteField key={field[0]} field={field} />)}
        <label className="block border-b border-line py-5 text-xs font-bold uppercase tracking-[.08em] text-clay">
          Project type<span className="ml-1 text-rust">*</span>
          <select
            name="projectType"
            required
            className="mt-3 block w-full bg-transparent text-base font-medium normal-case tracking-normal text-ink"
          >
            <option value="">Select project type</option>
            {quoteProjectTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>
      </div>
      <details className="border-b border-line py-5"><summary className="cursor-pointer text-sm font-semibold text-navy">Additional details (optional)</summary><div className="mt-3 grid gap-x-6 sm:grid-cols-2">
        {fields.slice(3).map(field => <QuoteField key={field[0]} field={field} />)}
        {quoteEngineeringFields.map(field => <QuoteField key={field[0]} field={field} engineering />)}
        <label className="block border-b border-line py-5 text-xs font-bold uppercase tracking-[.08em] text-clay">
          Supporting file
          <input
            name="attachment"
            type="file"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="mt-3 block w-full text-sm normal-case tracking-normal text-ink file:mr-3 file:border-0 file:bg-[#ddd7cc] file:px-3 file:py-2 file:text-xs file:font-bold file:text-ink"
          />
          <span className="mt-2 block text-xs font-normal normal-case tracking-normal">PDF, Word, PNG or JPEG. Maximum 5 MB.</span>
        </label>
      </div>
      <label className="block border-b border-line py-5 text-xs font-bold uppercase tracking-[.08em] text-clay">
        Project brief
        <textarea
          name="message"
          rows={3}
          maxLength={2000}
          className="mt-3 block w-full resize-y bg-transparent text-base font-medium normal-case leading-7 tracking-normal text-ink"
          placeholder="Describe the project, source conditions or site requirements."
        />
      </label>
      </details>
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
          <span className="mt-2 flex flex-wrap gap-x-5"><a className="underline" href={`tel:${company.phones[0]}`}>Call {company.phones[0]}</a><a className="underline" href={`https://wa.me/234${company.whatsapp.slice(1)}`}>WhatsApp {company.whatsapp}</a></span>
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
