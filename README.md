# ICP Schemas

JSON schemas for ICP (Internet Computer Protocol) event standardization and validation.

## Overview

This repository contains JSON Schema definitions for standardizing events in the Internet Computer Protocol ecosystem. The schemas ensure consistent event structure across different services and applications.

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

Defines the standard structure for ICP blockchain events. This schema includes:
- **eventId**: Unique identifier (UUID format)
- **eventType**: Type of event (e.g., `canister.created`, `transaction.completed`)
- **timestamp**: ISO 8601 timestamp when the event occurred
- **source**: Information about the event source (canister ID, subnet)
- **data**: Event-specific payload
- **metadata**: Additional metadata (version, correlation ID)

### Stored Event (`stored-event.schema.json`)

Extends the canonical event with persistence metadata. Additional fields include:
- **storedAt**: Timestamp when the event was persisted
- **status**: Processing status (`pending`, `processed`, `failed`, `archived`)
- **processedAt**: Timestamp when the event was processed
- **retryCount**: Number of processing retry attempts
- **error**: Error information if processing failed

## Usage

### Validating Events

You can use any JSON Schema validator to validate events against these schemas. Example using `ajv`:

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const canonicalSchema = require('./schemas/events/v1/canonical-event.schema.json');
const validate = ajv.compile(canonicalSchema);

const event = {
  eventId: "550e8400-e29b-41d4-a716-446655440000",
  eventType: "canister.created",
  timestamp: "2024-01-15T14:30:00.000Z",
  source: {
    canisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai"
  }
};

const valid = validate(event);
if (!valid) console.log(validate.errors);
```

### Sample Files

Sample files are provided in the `samples/` directory to demonstrate valid event structures:
- `canonical-event.sample.json`: Example of a canonical event
- `stored-event.sample.json`: Example of a stored event with persistence metadata

## Event Types

Currently supported event types:
- `canister.created`: New canister creation
- `canister.updated`: Canister update
- `canister.deleted`: Canister deletion
- `transaction.completed`: Transaction completion
- `cycle.transfer`: Cycle transfer between canisters

## Versioning

Schemas are versioned under the `v1` directory. Future versions will be added as separate directories (e.g., `v2`, `v3`) to maintain backward compatibility.

## Contributing

Contributions are welcome! Please ensure:
1. All schemas are valid JSON Schema Draft 07
2. Sample files validate against their corresponding schemas
3. Documentation is updated for any schema changes

## License

See LICENSE file for details.