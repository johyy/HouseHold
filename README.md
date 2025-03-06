# HouseHold - Home Inventory Management

HouseHold is a home inventory management system built as a **Full Stack Open** project at the University of Helsinki.  
The backend architecture follows a microservices approach and incorporates CQRS (Command Query Responsibility Segregation) pattern, developed as part of the **Software Architecture Project** course at the University of Helsinki.

**[Read the full User Guide](user_guide.md)** 

## Microservices Overview

### User Service
- **Description:** The User Service manages all user-related data, including accounts, authentication, and user preferences.
- **API Link:** [https://household-users.onrender.com](https://household-users.onrender.com)

### Product Service
- **Description:** The Product Service handles user-created items, including their locations and categories.
- **API Link:** [https://household-products.onrender.com](https://household-products.onrender.com)
