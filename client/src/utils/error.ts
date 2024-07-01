export type ErrorResponse = {
  validation?: string;
  code: string;
  message: string;
  path: string[];
  minimum?: number;
  type?: string;
  inclusive?: boolean;
  exact?: boolean;
};

export const transformErrorMessages = (errors: ErrorResponse[]): string => {
  return errors
    .map((error) => {
      switch (error.code) {
        case "invalid_string":
          if (error.validation === "email") {
            return "Invalid email address.";
          }
          break;
        case "too_small":
          if (error.type === "string") {
            return `Password must contain at least ${error.minimum} characters.`;
          }
          break;
        default:
          return error.message;
      }
    })
    .join("\n");
};
