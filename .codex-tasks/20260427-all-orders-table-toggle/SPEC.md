# AllOrders table toggle

## Goal
Split the existing AllOrders detail table into a component, add a summary table component based on `docs/prototypes/05-all-orders-summary.png`, and toggle between them from the existing toolbar button.

## Acceptance
- The detail mode renders the current AllOrders table.
- The summary mode renders columns from the prototype: selection, index, merchant, order count, photo count, receive total, dispatch total, profit, order time, operation.
- Switching modes resets keyword, selected rows, and current page.
- Toolbar layout and controls remain otherwise unchanged.
- Build succeeds.
