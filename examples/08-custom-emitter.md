# 08 — Custom event emitter

**Prompt:** _"I need an event bus for pub/sub between modules."_

## Before

```javascript
class EventBus {
  constructor() { this.handlers = {}; }
  on(event, fn) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(fn);
    return () => this.off(event, fn);
  }
  off(event, fn) {
    if (!this.handlers[event]) return;
    this.handlers[event] = this.handlers[event].filter(h => h !== fn);
  }
  emit(event, data) {
    (this.handlers[event] || []).forEach(fn => {
      try { fn(data); } catch (e) { console.error(e); }
    });
  }
  once(event, fn) {
    const off = this.on(event, (d) => { off(); fn(d); });
  }
}

export const bus = new EventBus();
```

**Cost:** 22 lines, no cancellation, no propagation control, no async handling, no memory-leak safety net.

## After

```javascript
// Browser or Node 15+
const bus = new EventTarget();

// subscribe
const controller = new AbortController();
bus.addEventListener("user:login", (e) => console.log(e.detail), { signal: controller.signal });

// publish
bus.dispatchEvent(new CustomEvent("user:login", { detail: { id: 42 } }));

// unsubscribe — free
controller.abort();
```

**Cost:** ~6 lines. Native. Free cancellation via `AbortController`. `once: true` option for one-time handlers. Handlers can call `stopImmediatePropagation()`. Works identically in browser and Node.

## Which rung landed

**Rung 4 — native platform feature.** `EventTarget` is a browser primitive that Node bolted on in v15. It gives you subscribe / dispatch / unsubscribe / once / async — everything a custom event bus does, plus the parts custom buses always forget (cancellation, error handling, propagation).

## When a library still earns its spot

- **You need typed events** at compile time → `mitt` (200 bytes) with a TypeScript generic type parameter
- **You want message replay / persistence** → that's not an event bus, that's a queue — use Redis / NATS / a real broker
- **Cross-tab communication** → `BroadcastChannel` (native, also in Node)
