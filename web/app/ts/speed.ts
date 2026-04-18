export interface ProbeResult {
  url: string;
  ms: number | null;
  ok: boolean;
}

export interface ConnectivityMetrics {
  measuredAt: string;
  results: ProbeResult[];
}

export interface RoomSpeed {
  room: number;
  connectivityMetrics: ConnectivityMetrics | null;
}
