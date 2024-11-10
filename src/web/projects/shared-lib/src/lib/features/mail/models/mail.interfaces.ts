export interface MailInformation {
    to: string;
    cc?: string;
    bcc?: string;
    from?: string;
    subject: string;
    text: string;
}

export interface FormToMailInformation<T> {
    receiver: string;
    formValues: T;
}
