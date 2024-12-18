# Fitness-workout-tracker
Fitness Workout Tracker is a simple backend service/api that helps users plan, track, and log their workout routines. Users can create custom workout plans, schedule exercises, and log their progress over time. The app supports tracking exercise sets, reps.

## Features
- User authentication and profile management
- Create and schedule workout plans
- Log workouts and track progress
- View workout history and reports
- Categories for different types of exercises (Strength, Cardio, etc.)

## Technology Stack
- Backend: Node.js, Express, TypeScript
- Database: MySQL
- ORM Seeding: TypeORM-seeding for populating initial data
- Testing: Jest for unit tests

## Database Design
[Lucid chart link](https://lucid.app/lucidchart/763404e7-26f5-4a1a-b5d5-d4f389d7e0b2/edit?viewport_loc=-1167%2C-714%2C1983%2C921%2C0_0&invitationId=inv_1ad63f63-1e72-423f-91b5-4e56703de65d)

![Design](./db-design/Fitness-Workout-Tracker.png)

## Installation
1 - Clone the repository:
```
git clone https://github.com/Luwa-Tech/Fitness-workout-tracker.git
cd fitness-workout-tracker

```
2 - Install dependencies:
```
npm install
```
3 - Environment Variables:
Create a `.env` file at the root of the project and configure it with your MySQL credentials and JWT secret.
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=fitness_tracker
ACCESS_KEY=your_jwt_secret
```
4 - Seed Initial Data:
```
npm run seed
```
5 - Start the Server:
```
npm run start
```
6 - Run Tests:
```
npm run test
```

## Improvements
- Centralized Error Handling: Although the project handles errors on a per-route basis, it would benefit from a centralized error handling middleware. This would ensure consistency across the entire app and avoid duplication of error handling logic.

## Resources
[A Philosophy For Effective Error Handling](https://openupthecloud.com/error-handling-javascript/#google_vignette): This article was particularly helpful during the development process in understanding how to implement efficient error handling and best practices.
