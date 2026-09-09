export type ClientType = 'esp32_device' | 'web_config_portal' | 'gateway';
export type ThemeMode = 'dark' | 'light';

export interface HttpHeader {
  key: string;
  value: string;
  enabled: boolean;
  description?: string;
}

export interface HttpRequestData {
  method: 'POST' | 'GET';
  url: string;
  path: string;
  host: string;
  protocol: 'HTTP/1.1' | 'HTTP/1.0';
  headers: HttpHeader[];
  body: string;
}

export interface HttpResponseData {
  statusCode: number;
  statusText: string;
  headers: HttpHeader[];
  body: string;
  timestamp: string;
  roundTripMs: number;
}

export type StepId = 
  | 'idle'
  | 'input_ready'
  | 'tcp_handshake'
  | 'send_request'
  | 'server_processing'
  | 'send_response'
  | 'client_parsed';

export interface SimulationStep {
  id: StepId;
  title: string;
  subtitle: string;
  technicalDetails: string;
  iotNote: string;
  phase: 'client' | 'network' | 'server';
}

export interface AuthScenario {
  id: string;
  label: string;
  description: string;
  username: string;
  password: string;
  expectedStatus: number;
  expectedStatusText: string;
  iconType: 'success' | 'unauthorized' | 'bad_request' | 'not_found' | 'server_error';
}

export interface SensorTelemetry {
  temperature: number;
  humidity: number;
  voltage: number;
  rssi: number;
  timestamp: string;
}
