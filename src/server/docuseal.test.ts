import test from "node:test";
import assert from "node:assert/strict";

process.env.SKIP_ENV_VALIDATION = "1";
process.env.DOCUSEAL_API_BASE_URL = "https://api.example.com";
process.env.DOCUSEAL_APP_BASE_URL = "https://sign.example.com";
process.env.DOCUSEAL_API_KEY = "test-key";

const docusealModule = await import("./docuseal");

test("normalizeDocusealCreateSubmissionResponse handles SDK submitter array shape", () => {
  const normalized = docusealModule.normalizeDocusealCreateSubmissionResponse([
    {
      id: 42,
      submission_id: 77,
      slug: "sdk-submitter",
      embed_src: "https://sign.example.com/s/sdk-submitter",
      email: "signer@example.com",
      role: "Signer",
    },
  ]);

  assert.deepEqual(normalized, {
    submissionId: "77",
    submissionStatus: null,
    primarySubmitterId: "42",
    primarySubmitterSlug: "sdk-submitter",
    primarySubmitterEmbedUrl: "https://sign.example.com/s/sdk-submitter",
  });
});

test("normalizeDocusealCreateSubmissionResponse handles legacy object shape", () => {
  const normalized = docusealModule.normalizeDocusealCreateSubmissionResponse({
    id: 88,
    status: "pending",
    submitters: [
      {
        id: 21,
        submission_id: 88,
        slug: "legacy-submitter",
        embed_src: "/s/legacy-submitter",
        email: "signer@example.com",
        role: "Signer",
      },
    ],
  });

  assert.deepEqual(normalized, {
    submissionId: "88",
    submissionStatus: "pending",
    primarySubmitterId: "21",
    primarySubmitterSlug: "legacy-submitter",
    primarySubmitterEmbedUrl: "https://sign.example.com/s/legacy-submitter",
  });
});

test("normalizeDocusealCreateSubmissionResponse derives signer URL from slug when embed URL is missing", () => {
  const normalized = docusealModule.normalizeDocusealCreateSubmissionResponse([
    {
      id: 11,
      submission_id: 12,
      slug: "slug-only",
      email: "signer@example.com",
      role: "Signer",
    },
  ]);

  assert.equal(normalized.primarySubmitterEmbedUrl, "https://sign.example.com/s/slug-only");
});

test("normalizeDocusealCreateSubmissionResponse leaves preview metadata empty for malformed responses", () => {
  const normalized = docusealModule.normalizeDocusealCreateSubmissionResponse([
    {
      id: 11,
      submission_id: 12,
      email: "signer@example.com",
      role: "Signer",
    },
  ]);

  assert.deepEqual(normalized, {
    submissionId: "12",
    submissionStatus: null,
    primarySubmitterId: "11",
    primarySubmitterSlug: null,
    primarySubmitterEmbedUrl: null,
  });
});

test("createDocusealTemplateSubmission uses /submissions/init and enriches status from canonical submission lookup", async () => {
  const requests: string[] = [];
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (input, init) => {
    requests.push(typeof input === "string" ? input : input.toString());

    if (requests.length === 1) {
      assert.equal(init?.method, "POST");
      assert.match(String(input), /\/submissions\/init$/);

      return new Response(
        JSON.stringify([
          {
            id: 42,
            submission_id: 77,
            slug: "sdk-submitter",
            embed_src: "https://sign.example.com/s/sdk-submitter",
            email: "signer@example.com",
            role: "Signer",
          },
        ]),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    assert.match(String(input), /\/submissions\/77$/);
    return new Response(
      JSON.stringify({
        id: 77,
        status: "pending",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };

  try {
    const normalized = await docusealModule.createDocusealTemplateSubmission({
      templateId: 99,
      completedRedirectUrl: "https://app.example.com/complete",
      submitters: [{ email: "signer@example.com", role: "Signer" }],
    });

    assert.deepEqual(normalized, {
      submissionId: "77",
      submissionStatus: "pending",
      primarySubmitterId: "42",
      primarySubmitterSlug: "sdk-submitter",
      primarySubmitterEmbedUrl: "https://sign.example.com/s/sdk-submitter",
    });
    assert.equal(requests.length, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
