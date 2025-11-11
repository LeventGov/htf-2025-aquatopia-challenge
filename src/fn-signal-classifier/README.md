# Sonar Signal Classifier

This Lambda ingests EventBridge events containing sonar observations, validates required fields, classifies each event, and publishes to the appropriate **SNS** topic.
- If **any required fields are missing** → it emits a **dark signal**.
- Otherwise → it routes to the right **observation/alert** topic based on `type` and `intensity`.

---

## Flow

**EventBridge** (source of events) → **Lambda** (this function) → **SNS topics**

### Event Shape
Shape of an incoming event
```json
{
  "id": "event-uuid",
  "detail-type": "creature | hazard | anomaly | dark-signal",
  "source": "htf-2025-aquatopia.sonar-generator",
  "detail": {
    "type": "creature | hazard | anomaly",
    "species": "Sea Turtle",
    "location": "reef-2",
    "intensity": 1
  }
}
```
- Dark signals from upstream may have only `{ "data": "..." }` in `detail`, which will be detected as missing required fields. These need to be translated:
```json
{
  "type": "dark-signal",
  "originalPayload": { /* original detail */ },
  "detectedIssues": ["missing location", "missing intensity"]
}
```

### Routing Rules

| type       | intensity condition | SNS Topic              |
| ---------- | ------------------- | ------------------ |
| creature   | < 3               | `htf-2025-observation`      |
| creature   | >= 3              | `htf-2025-rare-observation` |
| hazard     | >= 2              | `htf-2025-alert`            |
| anomaly    | >= 2              | `htf-2025-alert`            |
| (fallback) | —                   | `htf-2025-observation`      |

**Dark signals** (any missing required field) → `htf-2025-dark-signals`
