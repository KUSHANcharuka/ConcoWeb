declare module "mjml-browser" {
  const mjml: (
    input: string,
    options?: Record<string, unknown>,
  ) => {
    html: string;
    errors?: unknown[];
  };

  export default mjml;
}
