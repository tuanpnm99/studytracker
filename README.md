# Study Tracker
StudyTracker is a web application that allows student to keep track of their scores in class and generate the recommended study plan for a week based on their performance in each class and its given credit hours.
## How To Use
### 1. Register for an account
To register for an account, the user must provide their username, password, and the confirm password.
### 2. Input the classes information
After registration, the user will be redirected to the new user page to enter their classes information including class name (e.g CS265) and its credit hours (e.g 3 Credit Hours).
### 3. Functionalities
  - **Index Page** is where the user can choose to go to either **Show Class**, **Edit Class Info**, or **Generate A Study Plan**.
  - **Show Class** is where the user can see their class information including the class Grade (e.g A), the Total Score (e.g 90/100), and        the scores that the user had so far. The user can also change their score information by clicking the **Edit Score** anchor tag          under the class name.
  - **Edit Score** is where the user can add the type of score for each class (e.g Quiz, Midterm Exam, Final Exam, Lab, etc.) and its            associated weight. For each type of score, the user can also add the scores (e.g 100/100, 90/100, 85/100). 
  - **Edit Class Info** is where the user can add a new class or change their class information including the class Name and the class          Credit Hours. 
  - **Generate a Study Plan** is where the user can see the recommended study plan for a week for each class. 
    It indicates 3 important categories:
     1. Time for reading and studying the materials (25% of the total study time)
     2. Time for Homework Assignments (50% of the total study time)
     3. Time for Review and Test Preparation (25% of the total study time)
## How It Works
  - **Validating and Storing the data**: The input is validated when the user enters the input. For credit hour inputs, the user     can only enter a number in 0.5 step. Otherwise, it is an invalid input (e.g 4 and 4.5 is valid, but 4.2 is invalid). The total         credit hours for all of the classes they had is automatically calculated and shown in the bottom. The user can only submit their           changes if the credit hours <= 20 Credit Hours. The same process happens for Edit Score information to make sure that for each class,       the total percentage of the weights for quizzes, exams, etc. is 100%. Once the data is submitted, it is sure to be valid, and it is         stored in the database associated with the id that the system is automatically created for the user which makes it  easier to retrieve       the data when needed.
  - **Generating the Study Plan**: When the user clicks to the **Generate a Study Plan** Tag, the backend will automatically retrive the       information about the user for each of the class including the grade and the total score. The total time study is determined by the         class credit hours and the current grade of the user. The basic study time is calculated based on the credit hours of the class, and       the extra study time is calculated based on the grade of the user for that class. If the grade is high (e.g A), the system won't add any extra time for that class. If the grade is lower (e.g C), the system will add an extra amount of time which is proportional to     the basic study time for that class with the weight associated with each grade (e.g C will have more extra study time than that of B and so on). The total     study time, then, is divided into 3 categories to make it clearer for the user on how to spend their study time, and the priority for each class is determined greedily     based on the total study time. 
