import { company } from "@/content/site";

export function WhatsApp() {
  return (
    <a
      href={`https://wa.me/234${company.whatsapp.slice(1)}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Ruach Dredging on WhatsApp"
      className="fixed bottom-4 right-4 z-40 grid h-12 w-12 place-items-center rounded-full border-2 border-white bg-[#075E54] text-white shadow-lg transition hover:bg-[#064C44]"
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 3.2a12.7 12.7 0 0 0-10.8 19.4L3.8 28l5.6-1.5A12.8 12.8 0 1 0 16 3.2Zm0 23.2a10.5 10.5 0 0 1-5.3-1.4l-.4-.2-3.3.9.9-3.2-.2-.4A10.5 10.5 0 1 1 16 26.4Zm5.8-7.8c-.3-.2-1.8-.9-2.1-1s-.5-.1-.7.2-.8 1-1 1.2-.4.3-.7.1a8.5 8.5 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.5-.5c.2-.2.2-.3.3-.5s0-.4 0-.5l-1-2.3c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1 2.9 1.2 3.1 2.1 3.3 5.2 4.6c.7.3 1.3.5 1.8.6.8.2 1.5.2 2 .1.6-.1 1.8-.7 2.1-1.4s.3-1.2.2-1.4-.3-.2-.6-.4Z"
        />
      </svg>
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}
