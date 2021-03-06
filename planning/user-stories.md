# user-stories.md

#Quiz App
This app lets you create quizzes and share them between friends. The creator of the quiz can view and share all the results at the end of the quiz.

#### Requirements:
- users can create quizzes
- users can make their quiz unlisted (make them private and not available on the home page, but if someone knows the quiz URL they can visit and take the quiz)
- users can share a link to a single quiz
- users can see a list of public quizzes
- users can see a list of public quizzes on the home page
- users can attempt a quiz
- users can see the results of their recent attempt
- users can share a link to the result of their attempt

# Users-stories

Any user can make how many quizzes he want and share the link with anyone.

###### - As a teacher, I can measure my students performance, because I have info by user, group average performance, who fails or pass the quiz.

###### - As a student, I can make many quizzes to memorize about some subjects, because I can interchange quizzes with my friends.

###### - As a future driver, I can make quizzes about ICBC Knowledge Test, because I have a quiz designed with my weakness points in the test.

###### - As a star wars fan, I can play/ test and encourage other fans, because the quiz have thematic pictures in every question and quiz.

# User experience

As a *logged-in* user, I can **create** and **check** every quiz that I made.
I could **delete**/ **update** questions or **delete entire** quiz.
As a user quiz taker, I could **see** and **answer** the questions, at the final I will be able to know my **results**.

- **action words:** logged, create, check (quiz), delete (piece/whole) , update, see (questions), answer (question), know (results)
- **nouns:** user, quiz, questions, answers (quiz), results.

### illustrative figure
!["illustrative figure"](https://github.com/BlakeSartin/Mid-Term-Project/blob/master/planning/img/icbc_example.jpg)

*this is not the real appearance of the app, but it is a good representation of the main idea app.

GET — / | displayHome()
GET — /users | getUsers()
GET — /questions/:id | getQuestionsByQuizId()
GET — /users/results/:id | getResultsByQuizId()
POST — quizzes | createQuiz()
POST — test | createTest()
POST — answers | addAnswers()
PUT — /users/:id | updateUser()
PUT — /quizzes/:id | updateQuiz()
PUT — /questions/:id | updateQuestions()
DELETE — /questions/:id | deleteQuestions()
DELETE — /quizzes/:id | deleteQuiz()
