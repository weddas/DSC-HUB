/**
 * Settings › Devices — operator-editable params for a curated Task, rendered from the
 * recipe's own `param_schema`.
 *
 * Every curated recipe has always shipped a param_schema, and the SPA has always declared
 * the type for it, but nothing rendered it: an operator could pick a Task and then had to
 * live with whatever sat in `default_params`. The two banner tasks kept their bespoke
 * controls (they template the banner text off the other fields, which no generic renderer
 * can do); everything else lands here, so the next curated task needs no SPA change at all.
 *
 * Labels come from the param name — `countdown_margin_min` reads as "Countdown margin min"
 * — which is plain rather than pretty, but it is honest and it never goes stale when the
 * backend adds a field.
 */

import type { ZigbeeParamSchemaField } from "../../lib/fleetApi";

type Props = {
  schema: Record<string, ZigbeeParamSchemaField>;
  params: Record<string, unknown>;
  disabled?: boolean;
  onChange: (patch: Record<string, unknown>) => void;
};

/** `countdown_margin_min` → "Countdown margin min". */
export function paramLabel(name: string): string {
  const words = name.replace(/[_-]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** `post_sunrise` → "Post sunrise"; left alone when it already reads as a word. */
export function optionLabel(value: string): string {
  if (value === value.toUpperCase() && value.length <= 4) return value;
  return paramLabel(value);
}

export default function TaskParamFields({ schema, params, disabled, onChange }: Props) {
  const names = Object.keys(schema);
  if (!names.length) return null;

  return (
    <>
      {names.map((name) => {
        const field = schema[name];
        const kind = String(field?.type || "string").toLowerCase();
        const current = params[name];

        if (kind === "enum" && field.values?.length) {
          return (
            <label key={name}>
              {paramLabel(name)}
              <select
                value={String(current ?? field.values[0])}
                disabled={disabled}
                onChange={(e) => onChange({ [name]: e.target.value })}
              >
                {field.values.map((v) => (
                  <option key={v} value={v}>
                    {optionLabel(v)}
                  </option>
                ))}
              </select>
            </label>
          );
        }

        if (kind === "int" || kind === "number") {
          return (
            <label key={name}>
              {paramLabel(name)}
              <input
                type="number"
                value={current === undefined || current === null ? "" : String(current)}
                min={field.min}
                max={field.max}
                step={kind === "int" ? 1 : "any"}
                disabled={disabled}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") {
                    onChange({ [name]: undefined });
                    return;
                  }
                  const n = kind === "int" ? parseInt(raw, 10) : Number(raw);
                  // Let the operator type freely; only commit a number we can use.
                  if (!Number.isNaN(n)) onChange({ [name]: n });
                }}
              />
            </label>
          );
        }

        return (
          <label key={name} style={{ flex: "1 1 240px" }}>
            {paramLabel(name)}
            <input
              type="text"
              value={String(current ?? "")}
              disabled={disabled}
              onChange={(e) => onChange({ [name]: e.target.value })}
            />
          </label>
        );
      })}
    </>
  );
}
