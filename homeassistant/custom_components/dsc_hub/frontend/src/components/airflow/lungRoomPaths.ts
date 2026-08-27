import * as THREE from "three";

/** Lung room splines — feet-scale, adapted from gemini demo. */
export type AirPathId = "intake_main" | "intake_clone" | "exhaust_outside" | "exhaust_recirc";

export function lungRoomPath(id: AirPathId): THREE.CatmullRomCurve3 {
  switch (id) {
    case "intake_clone":
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8, 1, 4),
        new THREE.Vector3(-5, 0.5, -2),
        new THREE.Vector3(-5, 6.5, -2),
        new THREE.Vector3(8, 7, -4),
      ]);
    case "intake_main":
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8, 1, 4),
        new THREE.Vector3(3, 0.5, 0),
        new THREE.Vector3(3, 6.5, 0),
        new THREE.Vector3(8, 7, -4),
      ]);
    case "exhaust_outside":
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(3, 6.5, 0),
        new THREE.Vector3(8, 7, -4),
        new THREE.Vector3(10, 7.5, -6),
      ]);
    case "exhaust_recirc":
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(-5, 6.5, -2),
        new THREE.Vector3(0, 7, 2),
        new THREE.Vector3(4, 7.2, 4),
      ]);
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export const LUNG_ROOM_SIZE = { w: 16, h: 8, d: 12 } as const;
export const TENT_2X4_SIZE = { w: 2, h: 7, d: 4 } as const;
export const TENT_4X8_SIZE = { w: 4, h: 7, d: 8 } as const;
