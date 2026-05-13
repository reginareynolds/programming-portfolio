import math
import random
import time

PRODUCTION_LINES = [
    {"id": "line-1", "name": "Packaging Line A", "product": "Carton Sealer"},
    {"id": "line-2", "name": "Packaging Line B", "product": "Flow Wrapper"},
    {"id": "line-3", "name": "Assembly Line C", "product": "Tray Former"},
]

NORMAL_RANGES = {
    "temperature": {"min": 60, "max": 85, "unit": "°C"},
    "pressure": {"min": 28, "max": 35, "unit": "PSI"},
    "vibration": {"min": 0.5, "max": 2.5, "unit": "mm/s"},
    "motor_rpm": {"min": 1400, "max": 1600, "unit": "RPM"},
    "power_draw": {"min": 12, "max": 18, "unit": "kW"},
}

ALERT_THRESHOLDS = {
    "temperature": {"warning": 82, "critical": 90},
    "pressure": {"warning": 33, "critical": 38},
    "vibration": {"warning": 2.2, "critical": 3.0},
    "motor_rpm": {"warning": 1550, "critical": 1650},
    "power_draw": {"warning": 17, "critical": 20},
}

IDEAL_CYCLE_TIME = 0.5


class SensorSimulator:
    def __init__(self):
        self._start_time = time.time()
        self._tick_count = 0
        self._anomaly_lines = set()
        self._line_states = {
            line["id"]: {"status": "running", "uptime_start": time.time()}
            for line in PRODUCTION_LINES
        }
        self._oee_state = {
            line["id"]: {"downtime_ticks": 0, "total_parts": 0, "good_parts": 0}
            for line in PRODUCTION_LINES
        }

    def _elapsed(self):
        return time.time() - self._start_time

    def _generate_sensor_value(self, sensor, line_id):
        r = NORMAL_RANGES[sensor]
        mid = (r["min"] + r["max"]) / 2
        amp = (r["max"] - r["min"]) / 2
        t = self._elapsed()

        base = mid + amp * 0.3 * math.sin(t / 30 + hash(line_id + sensor) % 100)
        noise = random.gauss(0, amp * 0.08)
        value = base + noise

        if line_id in self._anomaly_lines:
            value += amp * random.uniform(0.5, 1.2)

        return round(value, 2)

    def _get_alert_level(self, sensor, value):
        thresholds = ALERT_THRESHOLDS[sensor]
        if value >= thresholds["critical"]:
            return "critical"
        if value >= thresholds["warning"]:
            return "warning"
        return "normal"

    def _compute_oee(self, line_id):
        state = self._line_states[line_id]
        oee_state = self._oee_state[line_id]
        is_running = state["status"] == "running"

        if not is_running:
            oee_state["downtime_ticks"] += 1
        else:
            parts_this_tick = 2
            oee_state["total_parts"] += parts_this_tick
            defects = 1 if random.random() < 0.007 else 0
            oee_state["good_parts"] += parts_this_tick - defects

        elapsed = self._tick_count
        if elapsed == 0:
            return {"availability": 100.0, "performance": 100.0, "quality": 100.0, "oee": 100.0}

        run_ticks = elapsed - oee_state["downtime_ticks"]
        availability = run_ticks / elapsed
        performance = (oee_state["total_parts"] * IDEAL_CYCLE_TIME) / run_ticks if run_ticks > 0 else 0
        performance = min(performance, 1.0)
        quality = oee_state["good_parts"] / oee_state["total_parts"] if oee_state["total_parts"] > 0 else 1.0
        oee = availability * performance * quality

        return {
            "availability": round(availability * 100, 1),
            "performance": round(performance * 100, 1),
            "quality": round(quality * 100, 1),
            "oee": round(oee * 100, 1),
        }

    def maybe_trigger_event(self):
        if random.random() < 0.02:
            line_id = random.choice(PRODUCTION_LINES)["id"]
            if line_id in self._anomaly_lines:
                self._anomaly_lines.discard(line_id)
                self._line_states[line_id]["status"] = "running"
            else:
                self._anomaly_lines.add(line_id)
                if random.random() < 0.3:
                    self._line_states[line_id]["status"] = "stopped"

    def generate_tick(self):
        self._tick_count += 1
        self.maybe_trigger_event()
        timestamp = time.time()

        lines_data = []
        alerts = []

        for line in PRODUCTION_LINES:
            lid = line["id"]
            sensors = {}

            for sensor in NORMAL_RANGES:
                value = self._generate_sensor_value(sensor, lid)
                alert_level = self._get_alert_level(sensor, value)
                sensors[sensor] = {
                    "value": value,
                    "unit": NORMAL_RANGES[sensor]["unit"],
                    "alert": alert_level,
                }
                if alert_level != "normal":
                    alerts.append({
                        "line_id": lid,
                        "line_name": line["name"],
                        "sensor": sensor,
                        "value": value,
                        "unit": NORMAL_RANGES[sensor]["unit"],
                        "level": alert_level,
                    })

            oee = self._compute_oee(lid)

            lines_data.append({
                "line_id": lid,
                "line_name": line["name"],
                "product": line["product"],
                "status": self._line_states[lid]["status"],
                "sensors": sensors,
                "oee": oee,
            })

        return {
            "timestamp": timestamp,
            "lines": lines_data,
            "alerts": alerts,
        }
