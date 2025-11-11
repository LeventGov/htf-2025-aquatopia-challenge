# Sonar Dark Signal Decipher

This Lambda ingests **SNS** messages that may contain **dark signals**, decodes and **deciphers** them using a monoalphabetic substitution key, and forwards the plaintext to an **SQS** queue.

- Reads an encoded dark message
- Looks up the key by `kid`
- **Deciphers** the message
- Sends the plaintext to an SQS queue

---

## Flow

**SNS topic(s) → Lambda (this function) → SQS queue (`htf-2025-sonar-dark-signal-deciphered`)**


### Decoding Dark Signal

Example possible Dark Signal message
```json
{
  "type": "dark-signal",
  "originalPayload": {
    "data": "eyJhbGciOiJzdWJzdGl0dXRpb24tY2lwaGVyIiwia2lkIjoiNWM5YjdlMmEtMWYzNC00ZDY3LThhOTAtYjFjMmQzZTRmNTY3IiwiY2lwaGVyIjoiYW8gdHBjcWVhZm0gd2R2In0=",
    "species": "Clownfihs"
  },
  "detectedIssues": [
    "missing location",
    "missing intensity"
  ]
}
```

**Decode** `originalPayload.data` and see what key could be used

---

### Key lookup

Keys are fetched once per batch (from S3) and held in memory. Something in the dark message tells you which key can be used.
**S3 URL**: https://htf-2025-cipher-keys.s3.eu-central-1.amazonaws.com/keys.xml

**Hint**: Decipher the text using the `MonoAlphabeticCipher` library

---

### Output (SQS)

Each successfully deciphered message is sent to **SQS** as JSON:

```json
{
  "text": "<plaintext message>",
  "sourceMessageId": "<SNS MessageId>"
  ...
}
```

The function processes **all** records in the SNS batch and returns once at the end.

**Queue URL**: https://sqs.eu-central-1.amazonaws.com/128894441789/htf-2025-sonar-dark-signal-deciphered
