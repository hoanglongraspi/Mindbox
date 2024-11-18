## [MindBox.study](https://mindbox.study/vi)

![Alt text](/assert/img/mindbox.png)

## Inspiration
As students ourselves, we understand the struggle of juggling multiple tools for studying, note-taking, time management, and staying organized. From using separate apps for flashcards, timers, and syllabus organization to wishing for AI-assisted note processing, it often felt overwhelming and fragmented. We envisioned a streamlined, all-in-one study platform where all essential tools are seamlessly integrated. That dream led to the creation of *MindBox*—an open-source project we not only built for our own needs but also designed to grow over time and be accessible to everyone.

## What It Does
*MindBox* is a comprehensive study toolkit designed to optimize student productivity and organization. It features:
- **Mind Map**: An interactive web-like view that visualizes connections between key terms and notes, grouped by subject and dynamically generated.
- **Take Note**: A robust note-taking and uploading feature with AI-powered summarization, flashcard generation, and formatting options.
- **View Notes**: A section to access past notes organized neatly in folders by subject, with options to edit, delete, or customize the formatting.
- **Study Clock**: A Pomodoro timer that helps manage study sessions, track productivity, and encourage healthy study habits.
- **Syllabus Scanner**: A tool that parses course syllabi, extracts important dates, and creates a detailed grading table, integrating with external calendars for automatic reminders.

## How We Built It
We built *MindBox* using core web technologies:
- **HTML, CSS, and JavaScript**: Formed the foundation of the website and its responsive design.
- **Gemini AI**: Integrated for natural language processing, enabling note summarization, flashcard generation, and data optimization.

## Challenges We Ran Into
One major challenge was implementing a secure and user-friendly authentication system using Auth0, especially within the constraints of a fast-paced hackathon environment. We also faced hurdles in fine-tuning our AI models to provide consistent and well-structured output, as getting the prompts just right required multiple iterations and testing. Another area that proved tricky was processing and parsing syllabus content accurately for the Syllabus Scanner tool.

## Accomplishments That We're Proud Of
We’re particularly proud of the **Syllabus Scanner** tool. It was a complex feature to implement, as parsing textual information and converting it into actionable data (like dates and grading tables) was challenging yet extremely rewarding. We’re also proud of the seamless integration of various features and the overall simplicity and usability of the platform, making studying feel more manageable and organized.

## What We Learned
This was the first hackathon experience for some of our team members, and we learned a great deal about collaboration and rapid development under pressure. We gained insights into implementing and leveraging AI technologies effectively and became more familiar with secure authentication practices using Auth0. It was a journey of learning new frameworks and strengthening our problem-solving skills.

## What's Next for MindBox
We plan to refine *MindBox*, ironing out any remaining issues and optimizing performance to ensure it runs smoothly. Future developments include adding even more AI-driven features, like personalized study recommendations and deeper content analytics. Our vision is to create the ultimate centralized toolkit for students—one that eliminates the need for multiple apps and provides an efficient, all-in-one study experience.
