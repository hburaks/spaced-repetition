# Spaced Repetition App

A modern flashcard application using spaced repetition techniques for efficient learning. Built with Angular and Material Design, this app helps users learn and retain information more effectively through scientifically-proven spacing algorithms.

## Current Features

### Card Management
- Create and manage flashcards with questions and answers
- Organize cards with customizable tags
- Filter cards by multiple tags
- Preview cards before creation

### Review System
- Smart review scheduling based on performance
- Exponential spacing between reviews
- Visual progress tracking
- Performance-based leveling system

### User Interface
- Clean, modern Material Design
- Responsive layout for all devices
- Intuitive card organization
- Easy-to-use review interface

### Authentication
- Secure user authentication
- Email verification system
- Profile management

## Roadmap

### 1. User Settings Page
- [ ] Create settings route and component
- [ ] Design settings layout with sections:
  - [ ] Profile settings (username, email)
  - [ ] Theme preferences (dark/light mode)
  - [ ] Study preferences (cards per day, review timing)
  - [ ] Notification settings
- [ ] Implement settings storage
- [ ] Add settings state management

### 2. Project Landing Page
- [ ] Create landing page component
- [ ] Design sections:
  - [ ] Hero section with value proposition
  - [ ] Features showcase
  - [ ] How it works (spaced repetition explanation)
  - [ ] Demo/Preview section
  - [ ] Benefits of using the app
  - [ ] Call-to-action buttons
- [ ] Add animations and interactive elements
- [ ] Create responsive design

### 3. Dark Mode Implementation
- [ ] Create theme service:
  - [ ] Theme toggle functionality
  - [ ] Theme persistence
  - [ ] System preference detection
- [ ] Update CSS variables for theming
- [ ] Theme all components
- [ ] Add theme toggle in header and settings

### 4. Additional Tasks
- [ ] Update routing for new pages
- [ ] Add loading states
- [ ] Create theme documentation
- [ ] Add e2e tests
- [ ] Create user migration plan
- [ ] Add notifications for review reminders

## Algorithm

The spaced repetition algorithm follows exponential spacing between reviews:
- Level 0: Immediate review
- Level 1: 1 day
- Level 2: 3 days
- Level 3: 7 days
- Level 4: 14 days
- Level 5: 30 days

## Acknowledgments

Algorithm inspired by [Nicky Case's "How to Remember Anything Forever-ish"](https://ncase.me/remember/)
