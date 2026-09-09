# Supporting-route consistency verification

Date: 9 September 2026  
Routes: `/recover`, `/asks`, `/method`

## Implemented

- Recover, Asks and Method now share one responsive page frame and intro hierarchy.
- Recover uses a two-panel composition when a quiet day exists and retains an honest no-room state when one does not.
- Recovery choices are native toggle buttons and announce the resulting plan without saving it.
- Asks separates totals from decision history on wider screens and stacks them on compact screens.
- Declined requests are described as hours “kept free,” not hours “handed back.”
- Method retains a comfortable reading width, exposes numbered steps visually and uses valid ordered-list structure.

## Local verification

- Checked Recover with Aisyah and Nurul for no-room variants.
- Checked Recover with Wei Jian for the quiet-day variant and selected “sleep in” using the Enter key.
- Checked the empty Ask history.
- Completed one temporary sample decline and confirmed the populated history showed 5h kept free, then reset the demo state.
- Checked Method’s heading hierarchy and ordered content in the accessibility tree.
- Inspected all three routes in the compact in-app browser layout with mobile navigation present.
- Ran `npm run verify`: voice gate passed, ESLint passed, all 74 Vitest tests passed and the Next.js production build completed.

## Remaining limit

This is local browser evidence only. The routes still need the planned release-width sweep, deployed-URL check and physical Android pass.
