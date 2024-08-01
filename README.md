# Event Management System

This project is an event management system built with Node.js, Express, and MongoDB. It allows users to create, manage, and discover events. Additionally, it provides functionalities for reviews, registrations, and bookings. Here's a detailed breakdown:

## Features
## Technologies
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **API Testing:** Postman
- **Payment Processing:** Stripe

### Event Management
- Create events with details like title, description, dates, location (including geospatial data), capacity, category, price, status, tags, imageUrl, agenda, speakers, sponsors, and organizers.
- View all events.
- Get details of a specific event.
- Search for events within a radius or based on distance from a point.
- Update event information.
- Delete events.

### User Management
- User signup and login with role-based authorization (e.g., admin, user).
- User profile management (update name, photo).
- Get current user details.

### Reviews
- Create reviews for events with rating and text.
- View all reviews for an event.
- Get details of a specific review.
- Update review content.
- Delete reviews.

## Functional Requirements
- Users can create, manage, and discover events.
- Users can register for events.
- Users can book tickets for events.
- Users can leave reviews for events.
- Users can manage their profiles.
- The system facilitates secure user authentication and authorization.
- The system efficiently retrieves events based on location or distance.

## Non-Functional Requirements
- The system should be scalable and handle a growing number of users and events.
- The system should be performant and provide fast response times.
- The system should be secure and protect user data.
- The API should be well-documented and easy to use.

### Database and Relationships
The database likely includes the following collections:

## eventModel.js

This file defines the schema for events within the event management system. An event represents a planned activity with details like title, description, dates, and registration options.

**Schema Properties:**

* `_id` (ObjectId): Unique identifier for the event (primary key).
* `title` (String): Title of the event (required).
* `description` (String): Description of the event (required).
* `startDate` (Date): Start date of the event (required).
* `endDate` (Date): End date of the event (required).
* `duration` (Number): Duration of the event in days (required).
* `location` (Object):
    * `type` (String): Always "Point".
    * `coordinates` (Array of Numbers): Longitude and latitude coordinates (required).
    * `formattedAddress` (String): Formatted address of the location (required).
* `capacity` (Number): Maximum capacity of the event (required).
* `organizers` (Array of ObjectIds): References to User documents representing organizers.
* `registrations` (Array of ObjectIds): References to Registration documents.
* `createdAt` (Date): Date when the event was created.
* `category` (String): Category of the event (required).
* `price` (Number): Price of the event (required).
* `eventStatus` (String): Status of the event, can be:
    * `Scheduled`: Event is planned and open for registration (default).
    * `Cancelled`: Event has been cancelled.
    * `Completed`: Event has finished.
    * `Postponed`: Event has been rescheduled.
* `tags` (Array of Strings): Event tags.
* `imageUrl` (String): URL of the event's image.
* `images` (Array of Strings): Additional event image URLs.
* `agenda` (String): Event agenda.
* `speakers` (Array of Strings): Names of event speakers.
* `sponsors` (Array of Strings): Names of event sponsors.
* `ratingsAverage` (Number): Average rating of the event (default: 4.5, rounded to one decimal place).
* `ratingsQuantity` (Number): Number of ratings for the event (default: 0).
* `registrationDeadline` (Date): Deadline for registering for the event (required).

**Indexes:**

* `price` and `ratingsAverage` for sorting events by price and average rating.
* Geospatial index for location search.

**Virtual Populate:**

* Includes `reviews` information when `toJSON` or `toObject` is called.

**Query Middleware:**

* Populates `organizers` information, excluding unnecessary fields, during event retrieval.
## userModel.js

This file defines the schema for users within the event management system. A user represents an individual who can interact with the system.

**Schema Properties:**

* `_id` (ObjectId): Unique identifier for the user (primary key).
* `name` (String): User's name (required).
* `email` (String): User's email (required, unique, lowercase, validated).
* `photo` (String): URL of the user's photo (optional, default provided).
* `password` (String): Hashed user password (required, min length 8, selected: false).
* `passwordConfirm` (String): Password confirmation for validation purposes (required, removed after save).
* `role` (String): User's role (e.g., "admin", "organizer", "participant", default: "participant").
* `createdAt` (Date): Date when the user was created.
* `passwordChangedAt` (Date): Date when the password was last changed.
* `passwordResetToken` (String): Token for password reset (optional).
* `passwordResetExpires` (Date): Expiration time for password reset token (optional).
* `active` (Boolean): Indicates if the user is active (default: true, selected: false).

**Indexes:**

* Unique index on `email` for ensuring email uniqueness.

**Methods:**

* `correctPassword`: Checks if the provided password matches the hashed password.
* `changedPasswordAfter`: Checks if the user's password was changed after a specific timestamp.
* `createPasswordResetToken`: Generates a password reset token and sets expiration time.

**Middleware:**

* Pre-save middleware to hash the password before saving.
* Pre-save middleware to set `passwordChangedAt` when the password is changed.
* Query middleware to exclude inactive users from results.

## reviewModel.js

This file defines the schema for reviews within the event management system. A review represents a user's feedback and rating for an event.

**Schema Properties:**

* `_id` (ObjectId): Unique identifier for the review (primary key).
* `review` (String): The review text (required).
* `rating` (Number): The rating given by the user (between 1 and 5).
* `createdAt` (Date): The date when the review was created (default: current date).
* `user` (ObjectId): Reference to the User document who created the review (required).
* `event` (ObjectId): Reference to the Event document the review is for (required).

**Indexes:**

* Unique index on `event` and `user` to prevent duplicate reviews from the same user for the same event.

**Methods:**

* `calcAverageRatings`: Calculates the average rating for an event based on its reviews.

**Middleware:**

* Pre-save middleware to populate user information.
* Post-save middleware to recalculate average ratings after a review is saved.
* Pre-save middleware to get the document before it is updated for recalculation.
* Post-save middleware to recalculate average ratings after a review is updated or deleted.
## registrationModel.js

This file defines the schema for registrations within the event management system. A registration represents a user's enrollment for a specific event.

**Schema Properties:**

* `_id` (ObjectId): Unique identifier for the registration (primary key).
* `user` (ObjectId): Reference to the User document who registered.
* `event` (ObjectId): Reference to the Event document for which the user registered.
* `registrationStatus` (String): Status of the registration, can be:
    * `registered`: User has completed the initial registration process.
    * `cancelled`: User has cancelled their registration.
    * `confirmed`: Registration is confirmed and the user is eligible to attend. (Default)
* `registeredAt` (Date): Date when the user registered (default is current date and time).

**Relationships:**

* One User can have many Registrations.
* One Event can have many Registrations.

**Query Middleware:**

* Populates `user` and `event` information in registration documents during retrieval.


## bookingModel.js

This file defines the schema for bookings within the event management system. A booking represents a user's reservation for an event.

**Schema Properties:**

* `_id` (ObjectId): Unique identifier for the booking (primary key).
* `event` (ObjectId): Reference to the Event document for which the booking is made (required).
* `user` (ObjectId): Reference to the User document who made the booking (required).
* `price` (Number): Price of the booking (required).
* `paymentStatus` (String): Status of the payment (e.g., "paid", "unpaid", "failed", "refunded", default: "unpaid").
* `createdAt` (Date): Date when the booking was created (default: current date).

**Relationships:**

* One User can have many Bookings.
* One Event can have many Bookings.

**Query Middleware:**

* Populates `user` and `event` information in booking documents during retrieval.


  
