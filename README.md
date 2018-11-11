# Study Tracker 
StudyTracker is a web application that allows student to keep track of their scores in class and generate the recommendation study plan for a week based on their performance in each class and its given credit hours.
# How To Use
## 1. Register for an account
To register for an account, the user must provide their username, password, and the confirm password.
## 2. Input the classes information
After registration, the user will be redirected to the new user page to enter their classes information including class name (e.g CS265) and its credit hours (e.g 3 Credit Hours).
## 3. Functionalities
  - **Index Page** is where the user can choose to go the either **Show Class**, **Edit Class Info**, or **Generate A Study Plan**.
  - **Show Class** is where the user can see their class information including the class Grade (e.g A), the Total Score (e.g 90/100), and        the scores that the user had so far. The user can also change their score information by clicking the **Edit Score** anchor tag under      the class name.
  - **Edit Class Info** is there the user can add a new class or change their class information including the class Name and the class          Credit Hours. The total credit hours for all of the classes they had is automatically calculated and shown in the bottom. The user can      only submit their changes if the credit hours <= 20 Credit Hours. This is a part of the process to validate the input.
  - **Generate a Study Plan** is where the user can see the recommendation study plan for a week for each class. 
    It indicates 3 important catagories:
     1. Time for reading and studying the materials (25% of the total study time)
     2. Time for Homework Assignments (50% of the total study time)
     3. Time for Review and Test Preparation (25% of the total study time)
