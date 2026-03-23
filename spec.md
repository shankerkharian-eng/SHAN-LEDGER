# Transaction Ledger

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- A form to record entries with: Date, Name, Amount, and Narration fields
- A list/table view showing all recorded entries
- Ability to delete entries
- Summary showing total amount across all entries

### Modify
N/A

### Remove
N/A

## Implementation Plan
- Backend: store entries with id, date, name, amount (as Float), narration. CRUD operations: addEntry, getEntries, deleteEntry.
- Frontend: form with Date picker, Name text input, Amount number input, Narration text area. Table displaying all entries. Summary row with total. Delete action per row.
