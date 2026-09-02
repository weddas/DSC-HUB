/** Journal scope kinds supported by the unified stack (grow_log uses a separate stream). */
export type JournalScopeKind = "plant" | "space" | "room" | "core" | "grow_log";

export type JournalScope = {
  kind: JournalScopeKind;
  /** plant_id, space_id (4x8|2x4), or room_id — omitted for core. */
  id?: string;
};

export type JournalSnapshot = Record<string, string | number | boolean | null>;

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
};

export type JournalPatchBody = {
  note?: string;
  tags?: string[];
  growth_stage?: string;
};

export type JournalListVariant = "embedded" | "full";
