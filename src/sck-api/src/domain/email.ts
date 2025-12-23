export interface EmailRequestBody {
    id?: string;
    to: string;
    subject: string;
    text: string;
    cc?: string;
    bcc?: string;
    from?: string;
  }