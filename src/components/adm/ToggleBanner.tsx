import { buttonClass } from "@/components/ui/Button";

type Props = {
  enabled: boolean;
  /** Ex.: "Agenda", "Grade escolar" */
  label: string;
  onText: string;
  offText: string;
  action: (formData: FormData) => Promise<void>;
  /** Campos extras do form (ex.: o mês que o adm estava vendo) */
  hidden?: Record<string, string>;
};

/** Faixa no topo de cada módulo do /adm: mostra se está no ar e liga/desliga */
export function ToggleBanner({ enabled, label, onText, offText, action, hidden = {} }: Props) {
  return (
    <div
      className={`mb-12 flex flex-col gap-5 border px-6 py-5 sm:flex-row sm:items-center sm:justify-between ${
        enabled ? "border-gold/50 bg-gold/5" : "border-line bg-ink-2"
      }`}
    >
      <div>
        <p className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em]">
          <span aria-hidden className={`size-2 rounded-full ${enabled ? "bg-gold-light" : "bg-mute/60"}`} />
          <span className={enabled ? "text-gold-light" : "text-mute"}>
            {label} {enabled ? "visível no site" : "oculta no site"}
          </span>
        </p>
        <p className="mt-2 text-sm text-mute">{enabled ? onText : offText}</p>
      </div>
      <form action={action} className="shrink-0">
        <input type="hidden" name="enabled" value={String(!enabled)} />
        {Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <button type="submit" className={buttonClass(enabled ? "outline" : "solid", "cursor-pointer")}>
          <span className="relative">
            {enabled ? "Desabilitar" : "Habilitar"} {label.toLowerCase()}
          </span>
        </button>
      </form>
    </div>
  );
}
