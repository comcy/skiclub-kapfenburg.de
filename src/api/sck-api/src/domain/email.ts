export interface EmailRequestBody {
    to: string;
    subject: string;
    text: string;
    cc?: string;
    bcc?: string;
    from?: string;
  }