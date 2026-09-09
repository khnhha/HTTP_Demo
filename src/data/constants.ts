import { AuthScenario, HttpHeader, SimulationStep } from '../types';

export const AUTH_SCENARIOS: AuthScenario[] = [
  {
    id: 'valid_login',
    label: 'Đăng nhập Hợp Lệ (200 OK)',
    description: 'Tài khoản chính xác, server cấp Bearer JWT token có thời hạn 3600s.',
    username: 'esp32_operator',
    password: 'securePassword@2025',
    expectedStatus: 200,
    expectedStatusText: 'OK',
    iconType: 'success'
  },
  {
    id: 'invalid_password',
    label: 'Sai Mật Khẩu (401 Unauthorized)',
    description: 'Server kiểm tra hash mật khẩu không khớp, từ chối cấp quyền.',
    username: 'esp32_operator',
    password: 'wrong_password_123',
    expectedStatus: 401,
    expectedStatusText: 'Unauthorized',
    iconType: 'unauthorized'
  },
  {
    id: 'device_not_found',
    label: 'Chưa Đăng Ký Thiết Bị (404 Not Found)',
    description: 'Tài khoản hoặc Device ID không tồn tại trong CSDL máy chủ IoT.',
    username: 'unknown_device_99',
    password: 'somePassword',
    expectedStatus: 404,
    expectedStatusText: 'Not Found',
    iconType: 'not_found'
  },
  {
    id: 'bad_request',
    label: 'Lỗi Cú Pháp Gói Tin (400 Bad Request)',
    description: 'Thiết bị gửi chuỗi JSON bị thiếu ngoặc nhọn hoặc sai Content-Type.',
    username: 'esp32_operator',
    password: 'password"',
    expectedStatus: 400,
    expectedStatusText: 'Bad Request',
    iconType: 'bad_request'
  },
  {
    id: 'server_error',
    label: 'Máy Chủ Gặp Sự Cố (500 Internal Error)',
    description: 'Cơ sở dữ liệu IoT Cloud bị quá tải hoặc lỗi xử lý nội bộ.',
    username: 'crash_test_admin',
    password: 'adminPassword',
    expectedStatus: 500,
    expectedStatusText: 'Internal Server Error',
    iconType: 'server_error'
  }
];

export const DEFAULT_HEADERS: HttpHeader[] = [
  {
    key: 'Host',
    value: 'iot-cloud.smartgateway.vn',
    enabled: true,
    description: 'Tên miền/IP máy chủ nhận yêu cầu (Bắt buộc trong chuẩn HTTP/1.1)'
  },
  {
    key: 'Content-Type',
    value: 'application/json',
    enabled: true,
    description: 'Khai báo định dạng dữ liệu trong phần thân (Body)'
  },
  {
    key: 'User-Agent',
    value: 'ESP32-HTTPClient/1.2 (FreeRTOS; ESP-IDF v5.1)',
    enabled: true,
    description: 'Thông tin danh tính vi điều khiển / trình duyệt gửi yêu cầu'
  },
  {
    key: 'X-Device-MAC',
    value: '24:6F:28:B1:C2:E0',
    enabled: true,
    description: 'Địa chỉ vật lý MAC của chip WiFi (thường dùng trong xác thực IoT)'
  },
  {
    key: 'Accept',
    value: 'application/json',
    enabled: true,
    description: 'Báo cho máy chủ biết thiết bị chỉ chấp nhận phản hồi dạng JSON'
  },
  {
    key: 'Connection',
    value: 'close',
    enabled: true,
    description: 'Đóng socket TCP ngay sau khi nhận phản hồi để tiết kiệm RAM vi điều khiển'
  }
];

export const SIMULATION_STEPS: SimulationStep[] = [
  {
    id: 'idle',
    title: 'Sẵn sàng khởi tạo',
    subtitle: 'Nhập thông tin xác thực trên thiết bị IoT hoặc trang cấu hình',
    technicalDetails: 'Thiết bị IoT đang ở trạng thái nhàn rỗi (IDLE). Đang chuẩn bị dữ liệu xác thực (Username, Password, Device ID) để đóng gói vào gói tin HTTP POST.',
    iotNote: 'Vi điều khiển (ESP32/STM32) chuẩn bị buffer RAM hoặc đọc cấu hình từ bộ nhớ Flash SPIFFS/NVS trước khi kích hoạt module mạng WiFi/4G.',
    phase: 'client'
  },
  {
    id: 'tcp_handshake',
    title: 'Bước 1: Bắt tay 3 bước TCP (3-Way Handshake)',
    subtitle: 'Client <-> Server: SYN -> SYN-ACK -> ACK trên cổng 80 (HTTP) hoặc 443 (HTTPS)',
    technicalDetails: 'Trước khi HTTP có thể truyền nhận, tầng vận chuyển (Transport Layer) phải thiết lập kênh socket TCP tin cậy giữa Client và Server (IP: 103.82.20.14:80).',
    iotNote: 'Trong thư viện Arduino WiFiClient, bước này diễn ra khi gọi `client.connect(server_ip, server_port)`. Nếu WiFi yếu hoặc server bận, hàm này sẽ trả về false sau một khoảng timeout.',
    phase: 'network'
  },
  {
    id: 'send_request',
    title: 'Bước 2: Gửi gói tin HTTP Request',
    subtitle: 'Đẩy Request Line + Headers + Ký tự CRLF (\\r\\n\\r\\n) + JSON Body qua Socket',
    technicalDetails: 'Dữ liệu được chuyển thành dòng byte ASCII/UTF-8. Bắt buộc có dòng trống (CRLF kép: \\r\\n\\r\\n) để báo hiệu cho máy chủ biết đã kết thúc phần Headers và bắt đầu phần Body.',
    iotNote: 'Lưu ý tối quan trọng: Giá trị Content-Length phải bằng chính xác số byte của chuỗi Body. Nếu vi điều khiển tính thiếu byte, server sẽ đợi tiếp đến khi timeout!',
    phase: 'network'
  },
  {
    id: 'server_processing',
    title: 'Bước 3: Máy chủ xác thực (Auth Server) xử lý',
    subtitle: 'Bóc tách JSON -> Kiểm tra MAC/User -> Đối chiếu mật khẩu băm (bcrypt) -> Sinh Token',
    technicalDetails: 'Máy chủ web tiếp nhận luồng byte, parse HTTP Headers, giải mã JSON Body. Sau đó kiểm tra tài khoản trong database. Nếu đúng, server tạo JSON Web Token (JWT) có chữ ký số (HMAC-SHA256).',
    iotNote: 'Trong hệ thống IoT thực tế, máy chủ thường kiểm tra thêm cả địa chỉ MAC (`X-Device-MAC`) hoặc Hardware UID để đảm bảo không bị thiết bị lạ mạo danh người dùng.',
    phase: 'server'
  },
  {
    id: 'send_response',
    title: 'Bước 4: Máy chủ gửi HTTP Response về',
    subtitle: 'Status Line (200 OK / 401 Unauthorized) + Response Headers + JSON Payload',
    technicalDetails: 'Server phản hồi với mã trạng thái (HTTP Status Code), đính kèm Headers (`Content-Type: application/json`, `Content-Length`) và phần thân chứa Token hoặc thông báo lỗi.',
    iotNote: 'Vi điều khiển bắt đầu đọc luồng dữ liệu trả về từ socket bằng cách lắng nghe qua hàm `client.available()` hoặc callback của `HTTPClient`.',
    phase: 'network'
  },
  {
    id: 'client_parsed',
    title: 'Bước 5: Thiết bị IoT xử lý kết quả & Lưu trữ',
    subtitle: 'Đọc mã Status -> Parse JSON (ArduinoJson) -> Lưu Token vào Flash NVS',
    technicalDetails: 'Nếu mã phản hồi là 200 OK, thiết bị bóc tách trường `token`. Token này sẽ được gắn vào Header `Authorization: Bearer <token>` cho tất cả các request gửi cảm biến (Telemetry) sau đó.',
    iotNote: 'Khác với trình duyệt tự lưu Cookie, vi điều khiển phải tự chủ động lưu trữ Token vào biến tĩnh trong RAM hoặc ghi vào Flash (NVS / EEPROM) để không bị mất khi mất điện đột ngột!',
    phase: 'client'
  }
];

export const CODE_EXAMPLES = {
  esp32_httpclient: `// ========================================================
// Ví dụ lập trình ESP32 Arduino sử dụng thư viện HTTPClient
// ========================================================
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "IoT_Lab_WiFi";
const char* password = "wifi_password_here";
const char* authServerUrl = "http://iot-cloud.smartgateway.vn/api/v1/auth/login";

// Biến lưu trữ Token sau khi xác thực thành công
String authToken = "";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi connected! IP: " + WiFi.localIP().toString());
  
  // Tiến hành đăng nhập lấy Token
  loginToAuthServer("esp32_operator", "securePassword@2025");
}

void loginToAuthServer(String username, String pass) {
  if (WiFi.status() != WL_CONNECTED) return;
  
  HTTPClient http;
  http.begin(authServerUrl);
  
  // 1. Cài đặt các HTTP Headers
  http.addHeader("Content-Type", "application/json");
  http.addHeader("User-Agent", "ESP32-HTTPClient/1.2");
  http.addHeader("X-Device-MAC", WiFi.macAddress());
  
  // 2. Đóng gói JSON Payload
  StaticJsonDocument<200> doc;
  doc["username"] = username;
  doc["password"] = pass;
  doc["device_id"] = "ESP32-NODE-01";
  
  String requestBody;
  serializeJson(doc, requestBody);
  
  Serial.println("[HTTP] Đang gửi yêu cầu đăng nhập...");
  
  // 3. Thực thi HTTP POST
  int httpResponseCode = http.POST(requestBody);
  
  // 4. Xử lý mã trạng thái (HTTP Status Code)
  if (httpResponseCode > 0) {
    Serial.printf("[HTTP] Mã trạng thái phản hồi: %d\\n", httpResponseCode);
    String responsePayload = http.getString();
    Serial.println("[HTTP] Dữ liệu nhận về: " + responsePayload);
    
    if (httpResponseCode == 200) { // Đăng nhập thành công!
      StaticJsonDocument<512> responseDoc;
      DeserializationError error = deserializeJson(responseDoc, responsePayload);
      if (!error) {
        authToken = responseDoc["token"].as<String>();
        Serial.println(">>> ĐĂNG NHẬP THÀNH CÔNG! Token: " + authToken);
        // Lưu token vào NVS / Preferences nếu cần lưu qua các lần reboot
      }
    } else if (httpResponseCode == 401) {
      Serial.println(">>> LỖI: Sai tên tài khoản hoặc mật khẩu (401 Unauthorized)!");
    } else {
      Serial.printf(">>> LỖI XÁC THỰC: Server trả về mã %d\\n", httpResponseCode);
    }
  } else {
    Serial.printf("[HTTP] Lỗi kết nối Socket: %s\\n", http.errorToString(httpResponseCode).c_str());
  }
  
  // 5. Giải phóng tài nguyên kết nối
  http.end();
}

void loop() {
  // Thực hiện tác vụ gửi cảm biến bằng authToken vừa nhận được...
  delay(10000);
}`,

  esp32_raw_socket: `// ========================================================
// Minh họa Socket TCP thô (Raw HTTP) trên ESP32 với WiFiClient
// Giúp hiểu sâu cách chuỗi byte HTTP truyền qua dây dẫn
// ========================================================
#include <WiFi.h>

WiFiClient client;
const char* host = "iot-cloud.smartgateway.vn";
const int port = 80;

void sendRawHttpLogin() {
  if (!client.connect(host, port)) {
    Serial.println("Lỗi: Không thể mở socket TCP tới máy chủ!");
    return;
  }
  
  String jsonBody = "{\\"username\\":\\"esp32_operator\\",\\"password\\":\\"securePassword@2025\\"}";
  int contentLength = jsonBody.length();
  
  // Gửi Request Line
  client.print("POST /api/v1/auth/login HTTP/1.1\\r\\n");
  
  // Gửi các dòng Headers
  client.print("Host: " + String(host) + "\\r\\n");
  client.print("Content-Type: application/json\\r\\n");
  client.print("Content-Length: " + String(contentLength) + "\\r\\n");
  client.print("User-Agent: ESP32-RawSocket/1.0\\r\\n");
  client.print("Connection: close\\r\\n");
  
  // ĐẶC BIỆT QUAN TRỌNG: Dòng trống \\r\\n kết thúc Header!
  client.print("\\r\\n");
  
  // Gửi phần thân Body
  client.print(jsonBody);
  
  // Đọc phản hồi HTTP từ server
  while (client.connected() || client.available()) {
    if (client.available()) {
      String line = client.readStringUntil('\\n');
      Serial.println(line);
    }
  }
  client.stop();
}`,

  micropython: `# ========================================================
# Ví dụ lập trình MicroPython cho ESP32 / Raspberry Pi Pico W
# ========================================================
import urequests
import ujson
import network
import time

def login_iot_server(username, password):
    url = "http://iot-cloud.smartgateway.vn/api/v1/auth/login"
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "MicroPython-ESP32",
        "X-Device-MAC": "24:6F:28:B1:C2:E0"
    }
    
    payload = {
        "username": username,
        "password": password,
        "device_id": "ESP32-MPY-01"
    }
    
    try:
        print("Đang gửi HTTP POST tới server xác thực...")
        response = urequests.post(url, data=ujson.dumps(payload), headers=headers)
        
        print("HTTP Status Code:", response.status_code)
        data = response.json()
        print("Server Response:", data)
        
        if response.status_code == 200:
            token = data.get("token")
            print(">>> Lấy Token thành công:", token)
            return token
        else:
            print(">>> Đăng nhập thất bại, mã lỗi:", response.status_code)
            return None
            
    except Exception as e:
        print("Lỗi kết nối:", e)
        return None`,

  curl: `# ========================================================
# Lệnh cURL kiểm tra API xác thực trực tiếp trên Terminal
# (Rất hữu ích cho kỹ sư IoT test server trước khi nạp code)
# ========================================================

# 1. Gửi request đăng nhập và in chi tiết toàn bộ Headers (-v: verbose)
curl -v -X POST "http://iot-cloud.smartgateway.vn/api/v1/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "User-Agent: ESP32-HTTPClient/1.2" \\
  -H "X-Device-MAC: 24:6F:28:B1:C2:E0" \\
  -d '{"username":"esp32_operator","password":"securePassword@2025"}'

# 2. Sau khi có Token, gửi dữ liệu cảm biến (Telemetry) kèm Bearer Token:
curl -X POST "http://iot-cloud.smartgateway.vn/api/v1/telemetry" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -d '{"temperature": 28.5, "humidity": 65.2, "voltage": 3.3}'`
};
