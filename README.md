# sales-inventory

A sales inventory management system for business.

## Before you begin
Before you begin we recommend you read about the docs:
* RabbitMQ Go through [RabbitMQ Official Website](https://rabbitmq.com/) docs
* Docker Go through [Docker Official Website](https://docs.docker.com/) docs
## Prerequisites
Make sure you have the following installed on your machine
* Node.js

## How It's Made:

**Tech used:**<p>![NODEJS](https://img.shields.io/static/v1?label=|&message=NODE.JS&color=2b625f&style=plastic&logo=node.js) ![EXPRESS](https://img.shields.io/static/v1?label=|&message=EXPRESS&color=bbb111&style=plastic&logo=express) ![RABBITMQ](https://img.shields.io/static/v1?label=|&message=RABBITMQ&color=40cd8c&style=plastic&logo=rabbitmq)</p>

## Optimizations

Constantly refactor the code and improve the usage and scalablitiy of the app. Updating UI/UX to make it easy for user interact with.

## Lessons Learned:

I learnt how to use rabbitMQ to communicate with different microservices, which make it possible to retrieve sent when a microservice is down.

## Installation:

1. Clone repo
1. Set up environment variables
   ```
   cp .env.local.example .env.local
   ```
1. Enter your data into .env.local
1. run `npm install`

## Usage:

1. run `docker-compose build && docker-compose-up` to start app
1. Navigate to `localhost:8000`
