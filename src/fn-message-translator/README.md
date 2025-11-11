# Sonar Message Translator

This Lambda is triggered by **SQS**. It:

1. Extracts text from the message body,
2. Detects the language with **Amazon Comprehend**,
3. Translates non-English text to English using **Amazon Translate**,
4. Posts a compact result JSON to a **webhook** (HTTP POST).

It is designed for **single-record** SQS invocations (Batch size = 1).

---

## Flow

**SQS queue → Lambda (this function) → Comprehend → Translate → Webhook (HTTP POST)**

---

## Webhook
Many modern applications support webhooks in one way or another. You could use Teams, Discord or Slack.

In our experience Discord is probably the easiest, part of server integrations: 
- **Documentation**: https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks
- **Message format**: https://birdie0.github.io/discord-webhooks-guide/discord_webhook.html