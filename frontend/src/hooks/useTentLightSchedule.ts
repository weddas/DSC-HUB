import { useMemo } from "react";
import { useEntityBus } from "./useEntityBus";
import {
  computeLightSchedule,
  readTentPhotoperiodInput,
  tentPhotoperiodFollowsMain,
  type LightScheduleClocks,
  type TentPhotoperiodId,
} from "../lib/lightSchedule";

export function useTentLightSchedule(tent: TentPhotoperiodId): LightScheduleClocks & { followsMain: boolean } {
  const { state, num, tick } = useEntityBus();
  void tick;
  const followsMain = tent === "clone" && tentPhotoperiodFollowsMain(state);
  return useMemo(() => {
    const input = readTentPhotoperiodInput(tent, state, num);
    return { ...computeLightSchedule(input), followsMain };
  }, [tent, state, num, followsMain, tick]);
}
