# Sonar Observation Ingest

This Lambda ingests **SNS** messages containing sonar events and writes them to the correct destination:
- `observation` & `rare-observation` → stored in **DynamoDB**
- `alert` → indexed into **OpenSearch Serverless** (AOSS)

---

## Flow

**SNS topics** (`htf-2025-observation`, `htf-2025-rare-observation`, `htf-2025-alert`) → **Lambda** (this function) → **DynamoDB** & **OpenSearch Serverless**

- Only messages with the correct types!

### DynamoDB (for `observation` & `rare-observation`)

- Table: `htf-2025-sonar-observations`
- Item fields:
  - `id` = `Sns.MessageId` (UUID; idempotent via `ConditionExpression`)
  - `team` = `"htf-<teamname>"` (currently hard-coded → Should be changed to their team name)
  - `species`
  - `location`
  - `intensity`
  - `timestamp`
  - `type`
- Each write is logged in CloudWatch for verification.

### OpenSearch Serverless (for `alert`)

- Collection endpoint: `https://s6tkjpxuugo2q82i4z3d.eu-central-1.aoss.amazonaws.com`
- Dashbord endpoint: https://s6tkjpxuugo2q82i4z3d.eu-central-1.aoss.amazonaws.com/_dashboards/app/home
- Index: `<yourteamname>`
- Bulk indexing **without** custom `_id` (AOSS auto-generates IDs).
- Index mapping (created if missing):
  - `id`: `keyword`
  - `team`: `keyword`
  - `species`: `keyword`
  - `location`: `keyword`
  - `type`: `keyword`
  - `intensity`: `integer`
  - `timestamp`: `date`
