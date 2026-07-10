# 01 — React date picker

**Prompt:** _"Add a date picker to my birthday form."_

## Before (what agents do without Laconic)

```tsx
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

export function BirthdayField() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <DatePicker
      selected={date}
      onChange={setDate}
      dateFormat="yyyy-MM-dd"
      placeholderText="YYYY-MM-DD"
    />
  );
}
```

**Cost:** 14 lines, one npm install (`react-datepicker` + peer deps), an extra CSS file, and a `useState` that duplicates what the DOM already tracks.

## After (with Laconic)

```html
<input type="date" name="birthday" />
```

**Cost:** 1 line. Zero JS. Native localization. Native keyboard. Native accessibility. Uncontrolled — the form value is already in `formData`.

## Which rung landed

**Rung 4 — native platform feature.** The browser ships `<input type="date">` with localization, keyboard nav, and a calendar UI. Reach for `react-datepicker` only when you need something the native picker cannot do (range selection, custom day rendering, non-Gregorian calendars).

## When the library _does_ earn a spot

If you need any of these, install `react-day-picker` (better docs than `react-datepicker`):
- Multi-select or range picking
- Custom day rendering (highlight holidays, disabled dates)
- Locale-independent formatting for a specific business rule
