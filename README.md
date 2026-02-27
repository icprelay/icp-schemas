# ICP Schemas

JSON schemas for ICP Relay event standardization and validation.

## Overview

This repository contains JSON Schema definitions for standardizing events in the ICP Relay ecosystem. The schemas ensure consistent event structure across different webhook sources and notification targets.

## Directory Structure

```
icprelay-schemas/
├── README.md
├── schemas/
│  ├── events/
│  │  └── v1/
│  │     ├── canonical-event.schema.json
│  │     └── stored-event.schema.json
│  └── index.json
└── samples/
   └── v1/
      ├── canonical-event.sample.json
      └── stored-event.sample.json
```
 
## Schemas

### Canonical Event (`canonical-event.schema.json`)

Defines the standard structure for ICP Relay canonical events. This schema includes:
- **schemaVersion**: Schema version (e.g., "1.0")
- **eventId**: Unique identifier (UUID format)
- **correlationId**: Optional correlation identifier for tracing
- **source**: Source system identifier (e.g., "falcony", "jira")
- **eventType**: Type of event (e.g., `observation.created`, `issue.updated`)
- **subject**: Optional subject information (type and id)
- **occurredAtUtc**: ISO 8601 timestamp when the event occurred
- **data**: Event-specific payload (flexible object)

### Stored Event (`stored-event.schema.json`)

Defines the envelope structure for stored events in ICP Relay. This wraps the canonical event with additional persistence and routing metadata:
- **schemaVersion**: Envelope schema version
- **correlationId**: Optional correlation identifier
- **source**: Source system information (system, environment, senderId)
- **receivedAtUtc**: Timestamp when webhook was received
- **raw**: Reference to raw webhook payload in blob storage
  - **payloadRef**: Blob storage reference
  - **hashSha256**: SHA-256 hash of payload
  - **contentType**: Content type (e.g., "application/json")
  - **sizeBytes**: Payload size in bytes
- **canonical**: The canonical event representation
- **normalized**: Normalized event for notifications (compatible with ICP Lite)
- **routing**: Routing state and delivery attempts
  - **targets**: Array of delivery targets with state tracking
- **tags**: Optional tags for filtering and grouping

## Usage

### Validating Events

You can use any JSON Schema validator to validate events against these schemas. Example using `jsonschema` (Python):

```python
import json
from jsonschema import validate

# Load schema
with open('schemas/events/v1/canonical-event.schema.json') as f:
    schema = json.load(f)

# Validate event
event = {
    "schemaVersion": "1.0",
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "source": "falcony",
    "eventType": "observation.created",
    "occurredAtUtc": "2024-01-15T14:30:00.000Z",
    "data": {}
}

validate(instance=event, schema=schema)
```

### Sample Files

Sample files are provided in the `samples/` directory to demonstrate valid event structures:
- `canonical-event.sample.json`: Example of a canonical event from Falcony
- `stored-event.sample.json`: Example of a stored event envelope with routing information

## Event Flow

1. **Webhook Received**: External system sends webhook to ICP Relay
2. **Raw Storage**: Complete payload stored in blob storage
3. **Canonical Transform**: Webhook transformed to canonical event format
4. **Stored Event**: Canonical event wrapped in stored event envelope
5. **Routing**: Event routed to configured targets (Teams, SharePoint, etc.)

## Versioning

Schemas are versioned under the `v1` directory. Future versions will be added as separate directories (e.g., `v2`, `v3`) to maintain backward compatibility.

## Contributing

Contributions are welcome! Please ensure:
1. All schemas are valid JSON Schema Draft 07
2. Sample files validate against their corresponding schemas
3. Documentation is updated for any schema changes

## License

See LICENSE file for details.