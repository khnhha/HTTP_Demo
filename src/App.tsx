import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { NetworkDiagram } from './components/NetworkDiagram';
import { LoginForm } from './components/LoginForm';
import { PacketInspector } from './components/PacketInspector';
import { ExplanationPanel } from './components/ExplanationPanel';
import { TelemetrySimulator } from './components/TelemetrySimulator';
import { 
  ClientType, 
  HttpHeader, 
  HttpRequestData, 
  HttpResponseData, 
  StepId, 
  AuthScenario,
  ThemeMode
} from './types';
import { AUTH_SCENARIOS, DEFAULT_HEADERS, SIMULATION_STEPS } from './data/constants';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iot_http_lab_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });

  const isDarkMode = theme === 'dark';

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('iot_http_lab_theme', next);
      } catch (e) {}
      return next;
    });
  };

  const [clientType, setClientType] = useState<ClientType>('esp32_device');
  const [username, setUsername] = useState<string>('esp32_operator');
  const [password, setPassword] = useState<string>('securePassword@2025');
  const [deviceId, setDeviceId] = useState<string>('ESP32-NODE-01');
  const [headers, setHeaders] = useState<HttpHeader[]>(DEFAULT_HEADERS);
  const [contentType, setContentType] = useState<'application/json' | 'application/x-www-form-urlencoded'>('application/json');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('valid_login');
  
  // Simulation Stepper State
  const [currentStepId, setCurrentStepId] = useState<StepId>('idle');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Live Packet Data
  const [responseData, setResponseData] = useState<HttpResponseData | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [tokenExpiresIn, setTokenExpiresIn] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute request body
  const requestBody = contentType === 'application/json'
    ? JSON.stringify({ username, password, device_id: deviceId }, null, 2)
    : `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&device_id=${encodeURIComponent(deviceId)}`;

  const requestData: HttpRequestData = {
    method: 'POST',
    url: 'http://iot-cloud.smartgateway.vn/api/v1/auth/login',
    path: '/api/v1/auth/login',
    host: 'iot-cloud.smartgateway.vn',
    protocol: 'HTTP/1.1',
    headers,
    body: requestBody
  };

  // Generate mock server response according to inputs
  const computeServerResponse = (): HttpResponseData => {
    const now = new Date().toUTCString();
    
    // Check scenario conditions
    if (password === 'password"' || username === 'bad_json_user') {
      return {
        statusCode: 400,
        statusText: 'Bad Request',
        headers: [
          { key: 'Content-Type', value: 'application/json; charset=utf-8', enabled: true },
          { key: 'Date', value: now, enabled: true },
          { key: 'Server', value: 'IoT-Cloud-Auth/3.2', enabled: true },
          { key: 'Connection', value: 'close', enabled: true }
        ],
        body: JSON.stringify({
          status: 'ERROR',
          error_code: 'ERR_MALFORMED_JSON',
          message: 'Cú pháp JSON không hợp lệ (RFC 8259 syntax error)'
        }, null, 2),
        timestamp: now,
        roundTripMs: 42
      };
    }

    if (username === 'crash_test_admin') {
      return {
        statusCode: 500,
        statusText: 'Internal Server Error',
        headers: [
          { key: 'Content-Type', value: 'application/json; charset=utf-8', enabled: true },
          { key: 'Date', value: now, enabled: true },
          { key: 'Server', value: 'IoT-Cloud-Auth/3.2', enabled: true }
        ],
        body: JSON.stringify({
          status: 'ERROR',
          error_code: 'DATABASE_TIMEOUT',
          message: 'Máy chủ cơ sở dữ liệu xác thực IoT bị ngắt kết nối tạm thời'
        }, null, 2),
        timestamp: now,
        roundTripMs: 85
      };
    }

    if (username === 'unknown_device_99') {
      return {
        statusCode: 404,
        statusText: 'Not Found',
        headers: [
          { key: 'Content-Type', value: 'application/json; charset=utf-8', enabled: true },
          { key: 'Date', value: now, enabled: true },
          { key: 'Server', value: 'IoT-Cloud-Auth/3.2', enabled: true }
        ],
        body: JSON.stringify({
          status: 'ERROR',
          error_code: 'DEVICE_NOT_FOUND',
          message: 'Tài khoản hoặc Hardware Device ID chưa được đăng ký trên hệ thống đám mây'
        }, null, 2),
        timestamp: now,
        roundTripMs: 38
      };
    }

    if (username !== 'esp32_operator' || password !== 'securePassword@2025') {
      return {
        statusCode: 401,
        statusText: 'Unauthorized',
        headers: [
          { key: 'Content-Type', value: 'application/json; charset=utf-8', enabled: true },
          { key: 'Date', value: now, enabled: true },
          { key: 'Server', value: 'IoT-Cloud-Auth/3.2', enabled: true },
          { key: 'WWW-Authenticate', value: 'Bearer error="invalid_credentials"', enabled: true }
        ],
        body: JSON.stringify({
          status: 'ERROR',
          error_code: 'INVALID_CREDENTIALS',
          message: 'Tên người dùng hoặc mật khẩu không chính xác'
        }, null, 2),
        timestamp: now,
        roundTripMs: 56
      };
    }

    // Default: Success 200 OK
    const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VfaWQiOiJFU1AzMi1OT0RFLTAxIiwicm9sZSI6InNlbnNvcl9ub2RlIiwiZXhwIjoxNzg5MTIzNDU2fQ.8F9bC3dE2a1...';

    return {
      statusCode: 200,
      statusText: 'OK',
      headers: [
        { key: 'Content-Type', value: 'application/json; charset=utf-8', enabled: true },
        { key: 'Date', value: now, enabled: true },
        { key: 'Server', value: 'IoT-Cloud-Auth/3.2', enabled: true },
        { key: 'Cache-Control', value: 'no-store, no-cache', enabled: true },
        { key: 'X-RateLimit-Remaining', value: '99', enabled: true }
      ],
      body: JSON.stringify({
        status: 'SUCCESS',
        token_type: 'Bearer',
        token: sampleToken,
        expires_in: 3600,
        device_id: deviceId || 'ESP32-NODE-01',
        permissions: ['sensor:write', 'ota:read'],
        server_timestamp: Math.floor(Date.now() / 1000)
      }, null, 2),
      timestamp: now,
      roundTripMs: 64
    };
  };

  // Scenario Selection Handler
  const handleSelectScenario = (scenario: AuthScenario) => {
    setSelectedScenarioId(scenario.id);
    setUsername(scenario.username);
    setPassword(scenario.password);
  };

  // Automated step-by-step runner
  const runSimulationSequence = () => {
    setIsSending(true);
    setIsPlaying(true);
    setCurrentStepId('tcp_handshake');

    // Step 1: TCP Handshake (approx 600ms)
    setTimeout(() => {
      setCurrentStepId('send_request');

      // Step 2: Wire transfer request (approx 800ms)
      setTimeout(() => {
        setCurrentStepId('server_processing');

        // Step 3: Server processing & token generation (approx 800ms)
        setTimeout(() => {
          const generatedResponse = computeServerResponse();
          setResponseData(generatedResponse);
          setCurrentStepId('send_response');

          // Step 4: Wire transfer response back (approx 800ms)
          setTimeout(() => {
            setCurrentStepId('client_parsed');
            setIsPlaying(false);
            setIsSending(false);

            // If success, store token in state (simulating ESP32 NVS Flash storage)
            if (generatedResponse.statusCode === 200) {
              try {
                const parsed = JSON.parse(generatedResponse.body);
                setAuthToken(parsed.token || null);
                setTokenExpiresIn(parsed.expires_in || 3600);
              } catch (e) {}
            } else {
              setAuthToken(null);
              setTokenExpiresIn(null);
            }
          }, 900);
        }, 800);
      }, 800);
    }, 700);
  };

  const handleSendRequest = () => {
    runSimulationSequence();
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStepId === 'idle' || currentStepId === 'client_parsed') {
        runSimulationSequence();
      } else {
        setIsPlaying(true);
      }
    }
  };

  const handleNextStep = () => {
    const sequence: StepId[] = [
      'idle',
      'tcp_handshake',
      'send_request',
      'server_processing',
      'send_response',
      'client_parsed'
    ];
    const currentIndex = sequence.indexOf(currentStepId);
    if (currentIndex < sequence.length - 1) {
      const nextStep = sequence[currentIndex + 1];
      setCurrentStepId(nextStep);
      if (nextStep === 'send_response' && !responseData) {
        setResponseData(computeServerResponse());
      }
      if (nextStep === 'client_parsed') {
        const resp = responseData || computeServerResponse();
        setResponseData(resp);
        if (resp.statusCode === 200) {
          try {
            const parsed = JSON.parse(resp.body);
            setAuthToken(parsed.token || null);
            setTokenExpiresIn(parsed.expires_in || 3600);
          } catch (e) {}
        }
      }
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setIsSending(false);
    setCurrentStepId('idle');
    setResponseData(null);
    setAuthToken(null);
    setTokenExpiresIn(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-white transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Sticky Top Navigation */}
      <Navbar
        clientType={clientType}
        onClientTypeChange={setClientType}
        onReset={handleReset}
        isAuthenticated={!!authToken}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Module 1: Interactive Network Flow Diagram & Stepper */}
        <NetworkDiagram
          clientType={clientType}
          currentStepId={currentStepId}
          isPlaying={isPlaying}
          onPlayToggle={handlePlayToggle}
          onNextStep={handleNextStep}
          onReset={handleReset}
          onSelectStep={setCurrentStepId}
          statusCode={responseData?.statusCode}
          isDarkMode={isDarkMode}
        />

        {/* Module 2: Login Interface (Left) & Live Packet Inspector (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Login Form & Scenarios (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <LoginForm
              clientType={clientType}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              deviceId={deviceId}
              setDeviceId={setDeviceId}
              headers={headers}
              setHeaders={setHeaders}
              contentType={contentType}
              setContentType={setContentType}
              onSendRequest={handleSendRequest}
              isSending={isSending}
              onSelectScenario={handleSelectScenario}
              selectedScenarioId={selectedScenarioId}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Right Column: Live Wire Packet Inspector (7 cols) */}
          <div className="lg:col-span-7 h-full">
            <PacketInspector
              requestData={requestData}
              responseData={responseData}
              authToken={authToken}
              tokenExpiresIn={tokenExpiresIn}
              deviceId={deviceId}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        {/* Module 3: Telemetry Simulator with Acquired Bearer Token */}
        <TelemetrySimulator
          authToken={authToken}
          onReauthenticate={handleSendRequest}
          isDarkMode={isDarkMode}
        />

        {/* Module 4: In-depth Educational & Theoretical Explanation Panel */}
        <ExplanationPanel isDarkMode={isDarkMode} />
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-6 text-center text-xs transition-colors duration-200 ${
          isDarkMode
            ? 'border-slate-800/80 bg-slate-900/60 text-slate-500'
            : 'border-slate-200 bg-white text-slate-600 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>IoT HTTP Protocol &amp; Authentication Lab • Thiết kế cho sinh viên và kỹ sư lập trình nhúng</span>
          <span className={`font-mono text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            ESP32 • Arduino • FreeRTOS • MicroPython
          </span>
        </div>
      </footer>
    </div>
  );
}
