import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';
import { createWriteStream } from 'fs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(private readonly configService: ConfigService) {}

  async sendMail(data: any): Promise<string> {
    const approveBtn = `https://0016-2a02-a211-8ec1-3b80-974-4132-ed86-493a.ngrok-free.app/review?approval=approved&documentId=${data.documentId}&userId=${data.userId}&token=${data.token}`;
    const rejectBtn = `https://0016-2a02-a211-8ec1-3b80-974-4132-ed86-493a.ngrok-free.app/review?approval=rejected&documentId=${data.documentId}&userId=${data.userId}&token=${data.token}`;
    const name = data.user.name
    const fileName = data.fileName
    const submitedAt = data.submittedAt

    console.log(data);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.get('AUTH_EMAIL_ACCOUNT_ADDRESS'),
        pass: this.configService.get('AUTH_EMAIL_ACCOUNT_PASSWORD'),
      },
    });

    try {
      // Define the email content
      const mailOptions = {
        from: this.configService.get('AUTH_EMAIL_ACCOUNT_ADDRESS'),
        to: data.user.emailAddress,
        subject: 'New Document For Review from the CMS',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document Review Approval</title>
              <style>
                  /* Reset some default styles */
                  body, html {
                      margin: 0;
                      padding: 0;
                  }
          
                  /* Set a background color and font styles */
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f8f8f8;
                      line-height: 1.6;
                      color: #333;
                  }
          
                  /* Create a container to center content */
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #ffffff;
                      border-radius: 5px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
          
                  /* Header styling */
                  .header {
                      background-color: #2196F3; /* Material Design Blue */
                      color: #fff;
                      text-align: center;
                      padding: 20px 0;
                  }
                  .header h1 {
                      font-size: 24px;
                      margin: 0;
                  }
                  .header p {
                      margin: 10px 0;
                  }
          
                  /* Content styling */
                  .content {
                      padding: 20px;
                  }
                  .content p {
                      font-size: 16px;
                      margin-bottom: 15px;
                  }
                  .content ul {
                      list-style-type: disc;
                      padding-left: 20px;
                  }
                  .content li {
                      margin: 5px 0;
                  }
          
                  /* Button styling */
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      font-size: 16px;
                      border-radius: 5px;
                      margin-right: 10px;
                      cursor: pointer;
                  }
                  .reject-button {
                      background-color: #F44336; /* Material Design Red */
                      color: #fff;
                  }
                  .approve-button {
                      background-color: #4CAF50; /* Material Design Green */
                      color: #fff;
                  }
                  .download-button {
                      background-color: #2196F3; /* Material Design Blue */
                      color: #fff;
                  }
          
                  /* Footer styling */
                  .footer {
                      text-align: center;
                      padding: 10px 0;
                      color: #777;
                  }
          
                  /* Media query for responsive design */
                  @media screen and (max-width: 600px) {
                      .container {
                          width: 100%;
                          padding: 10px;
                      }
                      .header {
                          padding: 15px 0;
                      }
                      .header h1 {
                          font-size: 20px;
                      }
                      .button {
                          display: block;
                          width: 100%;
                          margin: 10px 0;
                      }
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                      <h1>Document Review</h1>
                      <p>Document Approval Request</p>
                  </div>
                  <div class="content">
                      <p>Hello,</p>
                      <p>A document requires your review and approval. Please see the details below:</p>
                      <ul>
                          <li><strong>Document Name:</strong> ${fileName}</li>
                          <li><strong>Submitted by:</strong> ${name}</li>
                          <li><strong>Date Submitted:</strong> ${submitedAt}</li>
                      </ul>
                      <p>You can take the following actions:</p>
                      <a href=${data.fileUrl} class="button download-button">Download for Review</a>
                      <a href=${rejectBtn} class="button reject-button">Reject</a>
                      <a href=${approveBtn} class="button approve-button">Approve</a>
                      <p>If you have any questions or need further information, please contact The CMS Team at  at info@cms.com.</p>
                      <p>Thank you for your prompt attention to this matter.</p>
                      <p>Sincerely,</p>
                      <p>Your Company Name</p>
                  </div>
              </div>
          </body>
          </html>
        `,
      };

      console.log('Email sending...');

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
      return 'res';
    } catch (error) {
      console.error('Error sending email:', error);
      throw new RpcException(error.message); // Propagate the error to the caller
    }
  }
}
