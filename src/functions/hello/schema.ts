export default {
  type: "object",
  properties: {
    distination: { type: "string" },
    events: {
      type: "array",
      items: {
        type: "object",
        properties: {
          replyToken: {
            type: "string",
          },
          message: {
            type: "object",
            properties: {
              type: { type: "string" },
              text: { type: "string" },
            },
          },
        },
      },
    },
  },
} as const;
