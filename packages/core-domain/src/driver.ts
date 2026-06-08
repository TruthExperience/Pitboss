export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
}

export interface DriverStats {
  driverId: string;
  starts: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
}
