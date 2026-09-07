import { useEffect, useState } from "react";
import { SettingRow } from "./SettingRow";
import { useSaveState } from "../../hooks/useGlobalModifiers";
import { useSettingsManifest } from "../../hooks/useSettingsManifest";
import { patch_settings } from "../../lib/fleetApi";

/** A tier-N text row that autosaves on blur; default and description come from the manifest. */
export function TextSettingRow({
  id,
  settingKey,
  label,
  description,
  value,
  onSaved,
  password,
  placeholder,
  isSet,
  consumers,
  advanced,
}: {
  id: string;
  settingKey: string;
  label: string;
  description?: string;
  value: string;
  onSaved: (next: string) => void;
  password?: boolean;
  placeholder?: string;
  /** For masked secrets: the brain says a value exists even though it never returns it. */
  isSet?: boolean;
  consumers?: { label: string; href: string }[];
  advanced?: boolean;
}) {
  const manifest = useSettingsManifest();
  const saveState = useSaveState();
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const row = manifest.rows[settingKey];
  const def = row && typeof row.default === "string" ? row.default : "";
  const commit = () => {
    if (draft === value) return;
    void saveState.run(async () => {
      await patch_settings({ [settingKey]: draft });
      onSaved(draft);
    });
  };
  return (
    <SettingRow
      id={id}
      label={label}
      description={description ?? row?.description}
      scope="brain"
      defaultLabel={def ? def : row ? "empty" : undefined}
      isDefault={password ? undefined : value === def}
      onReset={
        password
          ? undefined
          : () =>
              void saveState.run(async () => {
                await patch_settings({ [settingKey]: def });
                onSaved(def);
              })
      }
      state={saveState.state}
      stateText={saveState.text}
      consumers={consumers}
      advanced={advanced}
      control={
        <input
          type={password ? "password" : "text"}
          value={draft}
          placeholder={placeholder ?? (password && isSet ? "•••••••• (set)" : undefined)}
          aria-label={label}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
        />
      }
    />
  );
}
