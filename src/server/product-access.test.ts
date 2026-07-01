import assert from "node:assert/strict";
import test from "node:test";

process.env.SKIP_ENV_VALIDATION = "1";
const productAccessModule = await import("./product-access");

test("renderProductAccessTemplate resolves nested placeholders", () => {
  const rendered = productAccessModule.renderProductAccessTemplate(
    {
      event: "{{eventType}}",
      project: {
        id: "{{project.id}}",
        name: "{{project.name}}",
      },
      access: {
        expiresAt: "{{access.accessExpiresAt}}",
      },
    },
    {
      eventType: "access.granted",
      project: {
        id: "project-1",
        name: "Acme Portal",
      },
      access: {
        accessExpiresAt: "2026-07-31T00:00:00.000Z",
      },
    },
  );

  assert.deepEqual(rendered, {
    event: "access.granted",
    project: {
      id: "project-1",
      name: "Acme Portal",
    },
    access: {
      expiresAt: "2026-07-31T00:00:00.000Z",
    },
  });
});

test("product access signatures verify against the shared header format", () => {
  const payload = JSON.stringify({ hello: "world" });
  const timestamp = "1782806400";
  const secret = "super-secret";
  const signature = productAccessModule.buildProductAccessSignature(
    payload,
    timestamp,
    secret,
  );

  assert.equal(
    productAccessModule.verifyProductAccessSignature({
      payload,
      signatureHeader: `t=${timestamp},v1=${signature}`,
      secret,
    }),
    true,
  );

  assert.equal(
    productAccessModule.verifyProductAccessSignature({
      payload,
      signatureHeader: `t=${timestamp},v1=deadbeef`,
      secret,
    }),
    false,
  );
});

test("getEffectiveProductAccessState marks past-due active access as expired", () => {
  assert.equal(
    productAccessModule.getEffectiveProductAccessState({
      accessState: "active",
      accessExpiresAt: new Date("2026-01-01T00:00:00.000Z"),
    }),
    "expired",
  );

  assert.equal(
    productAccessModule.getEffectiveProductAccessState({
      accessState: "revoked",
      accessExpiresAt: new Date("2026-01-01T00:00:00.000Z"),
    }),
    "revoked",
  );
});
