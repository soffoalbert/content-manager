import { Body, Controller, Post, UseGuards, Get, Param, Req, Res, HttpStatus, Query, UseFilters, HttpException } from '@nestjs/common';
import { ReviewClient as ReviewClient } from './review.client';
import { AuthorizationGuard } from 'src/authentication.guard';
import { ReviewAuthorizationGuard } from './review.auth.guard';
import { Request, Response } from 'express';
import { RpcException } from '@nestjs/microservices';
import { ContentReviewerGuard } from './reviewer.guard';


@Controller('review')
export class ReviewController {
    constructor(private readonly reviewClient: ReviewClient) { }

    @Get()
    @UseGuards(ContentReviewerGuard)
    async review(@Query('documentId') documentId: number, @Query('userId') userId: number, @Query('approval') approval: string, @Res() res: Response) {
        try {
            const review = await this.reviewClient.review({ documentId, userId, approval });
            console.log(review)
            if (review.approval === 'rejected') {
                res.redirect('review/rejected');
            } else {
                res.redirect('review/approved');
            }
        } catch (error) {
            if (error.message === 'You have already voted on this document') {
                res.redirect('review/voted');
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('rejected')
    reject(@Res() res: Response) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

        // Send an HTML response directly
        res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document Rejection Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                text-align: center;
                padding: 20px;
            }
            .confirmation-box {
                background-color: #fff;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                max-width: 400px;
                margin: 0 auto;
            }
            h1 {
                color: #e74c3c;
            }
            p {
                font-size: 18px;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                margin: 10px;
                background-color: #e74c3c;
                color: #fff;
                text-decoration: none;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }
            .btn:hover {
                background-color: #c0392b;
            }
        </style>
    </head>
    <body>
        <div class="confirmation-box">
            <h1>Document Rejected</h1>
            <p>The document has been rejected by the user.</p>
            <a href="#" class="btn">Go Back</a>
        </div>
    </body>
    </html>
    
    `);
    }

    @Get('voted')
    voted(@Res() res: Response) {
        res.status(200).send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document Vote Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    text-align: center;
                    padding: 20px;
                }
                .confirmation-box {
                    background-color: #fff;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                    max-width: 400px;
                    margin: 0 auto;
                }
                h1 {
                    color: #e74c3c; /* Red color for rejection */
                }
                p {
                    font-size: 18px;
                }
                .btn {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 10px;
                    background-color: #e74c3c; /* Red color for rejection button */
                    color: #fff;
                    text-decoration: none;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .btn:hover {
                    background-color: #c0392b; /* Darker red color on hover */
                }
            </style>
        </head>
        <body>
            <div class="confirmation-box">
                <h1>Vote Already Submitted</h1>
                <p>You have already voted on this document.</p>
                <a href="#" class="btn">Go Back</a>
            </div>
        </body>
        </html>
        `)
    }

    @Get('approved')
    async approve(@Res() res: Response) {
        // Send an HTML response directly
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

        res.status(HttpStatus.OK).send(`
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Document Approval Confirmation</title>
       <style>
           body {
               font-family: Arial, sans-serif;
               background-color: #f5f5f5;
               text-align: center;
               padding: 20px;
           }
           .confirmation-box {
               background-color: #fff;
               border-radius: 10px;
               padding: 20px;
               box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
               max-width: 400px;
               margin: 0 auto;
           }
           h1 {
               color: #27ae60;
           }
           p {
               font-size: 18px;
           }
           .btn {
               display: inline-block;
               padding: 10px 20px;
               margin: 10px;
               background-color: #27ae60;
               color: #fff;
               text-decoration: none;
               border: none;
               border-radius: 5px;
               cursor: pointer;
               transition: background-color 0.3s ease;
           }
           .btn:hover {
               background-color: #219552;
           }
       </style>
   </head>
   <body>
       <div class="confirmation-box">
           <h1>Document Approved</h1>
           <p>The document has been approved by the user.</p>
           <a href="#" class="btn">Go Back</a>
       </div>
   </body>
   </html>
   
    `);
    }
}
