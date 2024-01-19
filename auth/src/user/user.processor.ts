import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Mail } from "../interfaces/queue.interface";
import { MailerService } from "@nestjs-modules/mailer";

@Processor("user")
export class UserProcessor {
    constructor (private readonly mailService: MailerService) {}

    @Process("verifyEmailAddress")
    async sendVerificationMail(job: Job<Mail>) {
        const { data } = job;

        try {
            await this.mailService.sendMail({
                ...data,
                subject: "Verify Your Email",
                template: "verify-email",
                context: {
                  otp: data.otp,
                },
            });
        } catch (err) {
            console.log(err);
        }
    }

    @Process("verifyMobileNumber")
    async sendVerificationOtp(job: Job) {
        const { data } = job;

        console.log(data);
    }
}