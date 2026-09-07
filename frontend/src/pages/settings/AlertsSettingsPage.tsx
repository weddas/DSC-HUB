import { useState } from "react";
import { Button } from "../../components/ui";
import { SettingRow, SettingsCard, Segmented, Stated, Toggle } from "../../components/settings/SettingRow";
import { playAlertSoundPreview } from "../../components/AlertNotifier";
import { useAlertPrefs } from "../../hooks/useAlertPrefs";
import { useSaveState } from "../../hooks/useGlobalModifiers";
import { usePreference } from "../../hooks/usePreference";
import { ALERT_ENTITY_IDS, playbookFor } from "../../lib/alertPlaybook";
import { type AlertSeverity } from "../../lib/alertPrefsApi";
import { PREFERENCE_DEFAULTS, isPreferenceDefault, resetPreference } from "../../lib/preferences";
import { paths } from "../../lib/paths";

function AlertRow({ id }: { id: string }) {
  const prefs = useAlertPrefs();
  const save = useSaveState();
  const pb = playbookFor(id, "alert");
  const enabled = prefs.isEnabled(id);
  const severity = prefs.severityOf(id);
  const isFailsafe = id === prefs.data?.failsafe_id;
  const defaultSev = prefs.data?.default_severity[id] ?? prefs.data?.baseline_severity ?? "warn";
  const pref = prefs.data?.alerts[id];
  const isDefault = (pref?.enabled ?? true) === true && (pref?.severity ?? defaultSev) === defaultSev;
  return (
    <SettingRow
      id={`alert-${id.split(".")[1]}`}
      label={pb.title}
      description={pb.what}
      scope="brain"
      defaultLabel={`on · ${defaultSev}`}
      isDefault={isDefault}
      onReset={() => void save.run(() => prefs.setAlert(id, { enabled: true, severity: defaultSev }))}
      state={save.state}
      stateText={save.text}
      consumers={[{ label: "Alerts", href: `#${paths.alerts()}` }]}
      control={
        <>
          <Segmented<AlertSeverity>
            value={severity}
            label={`${pb.title} severity`}
            options={[
              { value: "critical", label: "CRITICAL", title: "Counts on the Overview mission line and sounds in critical-only mode" },
              { value: "warn", label: "WARN" },
              { value: "info", label: "INFO", title: "Listed on the Alerts desk only" },
            ]}
            onChange={(v) => void save.run(() => prefs.setAlert(id, { severity: v }))}
          />
          {isFailsafe ? (
            <Stated>always on</Stated>
          ) : (
            <Toggle checked={enabled} label={`${pb.title} enabled`} onChange={(next) => void save.run(() => prefs.setAlert(id, { enabled: next }))} />
          )}
        </>
      }
    />
  );
}

function QuietHoursRow() {
  const prefs = useAlertPrefs();
  const save = useSaveState();
  const q = prefs.quietHours;
  const [start, setStart] = useState(q?.start ?? "22:00");
  const [end, setEnd] = useState(q?.end ?? "07:00");
  const on = q != null;
  return (
    <SettingRow
      id="alert-quiet-hours"
      label="Quiet hours"
      description="Silences the alert sound between these local times. Never silences the emergency failsafe. Shared by every browser."
      scope="brain"
      defaultLabel="off"
      isDefault={!on}
      onReset={() => void save.run(() => prefs.setQuietHours(null))}
      state={save.state}
      stateText={save.text}
      control={
        <>
          <Toggle
            checked={on}
            label="Quiet hours"
            onChange={(next) => void save.run(() => prefs.setQuietHours(next ? { start, end } : null))}
          />
          <input type="time" value={start} aria-label="Quiet hours start" onChange={(e) => setStart(e.target.value)} onBlur={() => on && void save.run(() => prefs.setQuietHours({ start, end }))} />
          <span className="dsc-setting-value">to</span>
          <input type="time" value={end} aria-label="Quiet hours end" onChange={(e) => setEnd(e.target.value)} onBlur={() => on && void save.run(() => prefs.setQuietHours({ start, end }))} />
        </>
      }
    />
  );
}

export function AlertsSettingsPage() {
  const prefs = useAlertPrefs();
  const [toast, setToast] = usePreference("alertToast");
  const [sound, setSound] = usePreference("alertSound");
  const disabled = ALERT_ENTITY_IDS.filter((id) => !prefs.isEnabled(id)).length;
  return (
    <>
      <SettingsCard
        id="delivery"
        title="Delivery"
        icon="bell"
        intro="How this browser tells you. The Alerts desk and the Overview mission line always show what is active; these rows add a toast and a tone on top."
      >
        <SettingRow
          id="pref-alertToast"
          label="Toast on a new alert"
          description="A small card in the corner when an enabled alert turns on, with a jump to the Alerts desk."
          scope="browser"
          defaultLabel={PREFERENCE_DEFAULTS.alertToast ? "on" : "off"}
          isDefault={isPreferenceDefault("alertToast")}
          onReset={() => resetPreference("alertToast")}
          control={<Toggle checked={toast} label="Toast on a new alert" onChange={setToast} />}
        />
        <SettingRow
          id="pref-alertSound"
          label="Sound"
          description="A short tone from this browser. Browsers only allow sound after you have clicked the page once; the preview button counts."
          scope="browser"
          defaultLabel={PREFERENCE_DEFAULTS.alertSound}
          isDefault={isPreferenceDefault("alertSound")}
          onReset={() => resetPreference("alertSound")}
          control={
            <>
              <Segmented
                value={sound}
                label="Alert sound"
                options={[
                  { value: "off", label: "OFF" },
                  { value: "critical", label: "CRITICAL" },
                  { value: "all", label: "ALL" },
                ]}
                onChange={setSound}
              />
              <Button variant="secondary" onClick={() => playAlertSoundPreview("bad")}>
                Preview
              </Button>
            </>
          }
        />
        <QuietHoursRow />
        <SettingRow
          id="alert-push"
          label="Push to phone"
          description="Not built. Possible with a notification relay on the brain — until then the Alerts desk is the record and this browser's toast and tone are the delivery."
          scope="brain"
          control={<Stated>possible with a notification relay</Stated>}
        />
      </SettingsCard>

      <SettingsCard
        id="catalogue"
        title="Catalogue"
        icon="alert-triangle"
        intro={`Every alert the hub can raise. Disabling hides it on the desks and mutes it here; the brain keeps evaluating and logging it. ${disabled ? `${disabled} disabled.` : "All enabled."}`}
        loadState={prefs.state === "error" ? "error" : prefs.state}
        loadError={prefs.error}
      >
        {ALERT_ENTITY_IDS.map((id) => (
          <AlertRow key={id} id={id} />
        ))}
      </SettingsCard>
    </>
  );
}
