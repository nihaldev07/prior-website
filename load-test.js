import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 100 }, // Ramp up to 100 users
    { duration: "1m", target: 1000 }, // Stay at 1000 users
    // { duration: "30s", target: 2000 }, // Ramp up to 5000 users
    // { duration: "1m", target: 2000 }, // Stay at 5000 users
    { duration: "30s", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be < 500ms
    http_req_failed: ["rate<0.01"], // Error rate < 1%
  },
};

const BASE_URL = "https://priorbd.com"; // Replace with your actual base URL

export default function () {
  const res = http.get(`${BASE_URL}/`);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 1s": (r) => r.timings.duration < 1000,
  });

  // Simulate user thinking time
  sleep(1 + Math.random() * 3);
}
