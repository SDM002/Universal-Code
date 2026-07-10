# 05 — HTML form validation

**Prompt:** _"Add validation to my signup form — email, required fields, password length."_

## Before

```jsx
import { useState } from "react";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().min(8, "min 8 chars").required("required"),
});

export function SignupForm({ onSubmit }) {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await schema.validate(values, { abortEarly: false });
      setErrors({});
      onSubmit(values);
    } catch (err) {
      const eMap = {};
      err.inner.forEach(x => { eMap[x.path] = x.message; });
      setErrors(eMap);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={values.email}
        onChange={e => setValues({...values, email: e.target.value})} />
      {errors.email && <span>{errors.email}</span>}
      <input name="password" type="password" value={values.password}
        onChange={e => setValues({...values, password: e.target.value})} />
      {errors.password && <span>{errors.password}</span>}
      <button type="submit">Sign up</button>
    </form>
  );
}
```

**Cost:** ~30 lines of component + `yup` dep. `useState` × 2. Manual error mapping. `preventDefault`. Two-way binding on every field. Screen readers see nothing — errors are just spans.

## After

```jsx
export function SignupForm({ onSubmit }) {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      onSubmit(Object.fromEntries(new FormData(e.currentTarget)));
    }}>
      <label>Email <input name="email" type="email" required /></label>
      <label>Password <input name="password" type="password" minLength={8} required /></label>
      <button>Sign up</button>
    </form>
  );
}
```

**Cost:** 8 lines. Native HTML5 validation — the browser blocks submit and shows a localized error message on invalid inputs. No dep. No state. No error mapping. `type="email"` handles the RFC. `minLength` and `required` are read by screen readers automatically. `<label>` wraps input for click-focus + a11y.

## Which rung landed

**Rung 4 — native platform feature.** HTML5 constraint validation (`required`, `type="email"`, `minLength`, `pattern`, `:invalid`) has been in every browser since 2012. Screen readers announce constraint failures without any ARIA. The `<label>` element is the accessibility contract.

## When you still want `zod` / `yup`

- Cross-field validation (_"password and confirm-password must match"_)
- Complex regex you want to unit-test
- Sharing schemas between client and server (`zod` shines here — same schema, `.parse()` on both ends)

In those cases, still keep the native attributes — treat the JS validation as _extra_, not _instead_.
