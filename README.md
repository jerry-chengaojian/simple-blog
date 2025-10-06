# Simple Blog Platform 📝

A modern, full-stack blog platform built with **Next.js 14** and **AWS Amplify Gen2**. Features user authentication, blog post management, and an interactive comment system with fine-grained authorization controls.

![Next.js](https://img.shields.io/badge/Next.js-14.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![AWS Amplify](https://img.shields.io/badge/AWS%20Amplify-Gen2-orange?style=flat-square&logo=amazon-aws)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🔐 Authentication
- **Email-based authentication** powered by AWS Cognito
- Secure sign-up and sign-in flows
- Auto-redirect after successful authentication
- Session management

### 📰 Blog Management
- **Public blog browsing** - Anyone can view blog posts
- **Create blog posts** - Authenticated users can write and publish
- **Delete posts** - Authors can remove their own content
- **Rich content display** - Support for multi-line content with proper formatting
- **Timestamp tracking** - Creation dates for all posts

### 💬 Comment System
- **Interactive comments** on blog posts
- **Real-time updates** after posting
- **Owner-based deletion** - Users can delete their own comments
- **Login prompt** for unauthenticated users

### 🎨 Modern UI/UX
- **Responsive design** - Works seamlessly on desktop, tablet, and mobile
- **Beautiful animations** - Smooth transitions and hover effects
- **Intuitive navigation** - Clean and accessible interface
- **Loading states** - Clear feedback during async operations
- **Error handling** - User-friendly error messages

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: AWS Amplify Gen2
- **Authentication**: AWS Cognito (Email + Password)
- **Database**: AWS DynamoDB (via Amplify Data)
- **API**: AWS AppSync (GraphQL)

## 📝 Key Features Implementation

### Authentication Flow
- Uses AWS Amplify UI's `<Authenticator>` component
- Supports email/password sign-up with verification
- Auto-redirect after successful login
- Protected routes check for user session

### Blog Post Creation
- Only authenticated users can create posts
- Captures author info from Cognito user session
- Real-time validation and error handling
- Success redirect to home page

### Comments System
- Nested data relationship (Blog → Comments)
- Real-time comment refresh after posting
- Owner-based deletion permissions
- Login prompt for unauthenticated users

### Authorization Strategy
- **API Key mode** for public read operations
- **User Pool mode** for authenticated operations
- **Owner-based access control** for delete/update operations
- Fine-grained field-level authorization