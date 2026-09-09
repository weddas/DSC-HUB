/** Journal scope kinds supported by the unified stack (grow_log uses a separate stream). */
export type JournalScopeKind = "plant" | "space" | "room" | "core" | "grow_log";

export type JournalScope = {
  kind: JournalScopeKind;
  /** plant_id, space_id (4x8|2x4), or room_id — omitted for core. */
  id?: string;
};

export type JournalSnapshot = Record<string, string | number | boolean | null>;

/** One photo attached to an entry. Bytes live on disk; this is the row. */
export type JournalMedia = {
  id: number;
  bytes: number;
  w?: number | null;
  h?: number | null;
  caption: string;
  created_at: number;
};

/** A field an action asks for, as declared by the brain's catalogue. */
export type JournalActionField = {
  id: string;
  label: string;
  kind: "number" | "text" | "choice";
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  choices?: string[];
};

/** An action type the journal offers — built-in or operator-defined. */
export type JournalAction = {
  id: string;
  label: string;
  icon?: string;
  /** Whether logging this freezes the room's sensor state. */
  snapshot: boolean;
  fields: JournalActionField[];
  custom?: boolean;
};

export type JournalEntry = {
  id: number;
  plant_id?: string;
  space_id?: string;
  room_id?: string;
  occurred_at: number;
  note: string;
  source: string;
  tags: string[];
  provenance?: "plant" | "space" | "room" | "core" | string;
  created_at?: number;
  snapshot?: JournalSnapshot;
  /** Pass S6. Absent on pre-S6 rows, which are notes — hence the default at the read site. */
  action?: string;
  fields?: Record<string, string | number>;
  /** Brain-rendered one-liner, e.g. "Water · 2 L · pH 6.2". */
  summary?: string;
  media?: JournalMedia[];
};

export type JournalPaginatedResponse = {
  entries: JournalEntry[];
  total: number;
  limit: number;
  offset: number;
  plant_id?: string;
  space_id?: string;
  room_id?: string;
};

export type JournalPostBody = {
  note: string;
  occurred_at?: number;
  tags?: string[];
  action?: string;
  fields?: Record<string, string | number>;
};

export type JournalPatchBody = {
  note?: string;
  occurred_at?: number;
  tags?: string[];
};

export type JournalListVariant = "embedded" | "full";
