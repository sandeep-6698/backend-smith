declare module "@mailchimp/mailchimp_transactional" {
  interface MailchimpMessage {
    from_email: string;
    subject: string;
    html: string;
    to: Array<{ email: string; type: "to" }>;
  }

  interface MailchimpTransactionalClient {
    messages: {
      send: (params: { message: MailchimpMessage }) => Promise<unknown>;
    };
  }

  function createMailchimpClient(apiKey: string): MailchimpTransactionalClient;

  export default createMailchimpClient;
}
