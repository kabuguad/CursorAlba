---
name: Admissions API contract
description: Two-DTO split for list vs detail; field names, status encoding, document shape — all verified against C# source.
---

## List vs Detail split

The API uses **two different DTOs** — never assume the list includes full detail fields.

### GET /api/admissions/applications → ApplicationSummaryDto[]
```
id, referenceNumber, childFullName (combined!), applyingForGrade,
parentEmail, parentPhone, status (string label), documentCount (int), submittedAt
```
- No `documents` array — only a count
- `childFullName` is pre-combined server-side; no separate first/last

### GET /api/admissions/applications/{id} → ApplicationResponseDto
```
id, referenceNumber, childFirstName, childLastName, dateOfBirth, applyingForGrade,
previousSchool?, parentFirstName, parentLastName, parentEmail, parentPhone,
parentIdNumber?, parentRelationship?, status (string label), adminNotes?,
submittedAt, reviewedAt?, reviewedBy?,
documents: DocumentResponseDto[]    ← EF eager-loaded, always present
```

### DocumentResponseDto (nested in detail)
```
id, documentType, originalFileName, contentType, fileSizeBytes, downloadUrl, uploadedAt
```
- `originalFileName` (NOT `fileName`)
- `downloadUrl` (NOT `fileUrl`) — format: /api/admissions/applications/{appId}/documents/{docId}

## Status encoding
- **Responses**: status is a **string label** ("Pending" | "Reviewing" | "Approved" | "Rejected")
- **PATCH body** (AdmissionStatusUpdateDto): status is an **integer** (0=Pending 1=Reviewing 2=Approved 3=Rejected)
- PATCH fields: `status` (int), `notes?` (NOT `adminNotes`), `reviewedBy?`

## Frontend types
- `AdmissionSummary` — for list data (no documents)
- `AdmissionDetail` — for detail data (includes `documents: AdmissionDocument[]`)
- `AdmissionDocument` — matches `DocumentResponseDto`

## Cache key pattern
- List: `['admissions']` — queryFn: `admissionsService.list()`
- Detail: `['admissions', 'detail', appId]` — queryFn: `admissionsService.getById(appId)`
- After doc upload/delete: invalidate BOTH keys so list `documentCount` and panel docs stay in sync

## Why
The list DTO deliberately omits document payloads for performance (comment in C# source says so).
The detail DTO eager-loads via EF navigation property `ICollection<AdmissionDocument> Documents`.
