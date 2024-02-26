# ECE 461L: Team Project
## Team Members: Paul McCulley, Alfonso Herrera, Maximino Sanchez, David Cassity

##Building
To build the server, run 'npm start build'. To run the server, run 'flask --app app run'

## Motivation
The well-known **Software-as-a-Service** (SaaS) model has now expanded to several online services,
including Infrastructure-as-a-Service (IaaS), Platform-as-a-Service (PaaS) and Hardware-as-a-
Services (HaaS). With the cloud now supporting these and many other services, the term
Everything as a Service (XaaS) was coined to refer to the extensive variety of emerging services
and applications that people can access on demand over the Internet as opposed to being housed
on-premises. According to a new report by Research Insights titled “Global Everything-as-a-
service (XaaS) Market Research Report 2019-2026", the XaaS market is expected to grow to more
than $345 billion (about $1,100 per person in the US) over the next few years. Many industries
are now adopting the on-demand approach of acquiring services through cloud computing
because it offers agility and flexibility, allowing companies to acquire technology quickly and with
fewer up-front costs than they would with a purchase and license agreement.

## Team Project
In this project, we will bring together the tools and techniques (marked in italics in this document)
that we are learning in the class to implement a Proof of Concept (PoC) for a web application
(henceforth, referred to as the app) for a functioning HaaS system. This PoC app is inspired by
the University of Utah POWDER program (https://powderwireless.net/ ). The overall nature of
the app is predefined, but your team can be creative in adding features that exceed the
_stakeholder needs_.

A simplified software architecture of the app is shown in Figure 1 below.

![Screenshot 2024-01-31 125603](https://github.com/DavidCassity/ECE461LSoftwareProject_Team5/assets/93953735/8f9c0638-99d9-4566-89c5-ca0e9301087d)

This project will be done with an assigned project team, and you will submit just one
deliverable for the entire team during each phase. Each team should contain between 5 and 6
students. All the team members must be in the same section. This will help with coordination as
you will have to Identify 2 one-hour blocks when you can all meet weekly.

## HaaS System Project Description

Create a PoC for an app for a functioning HaaS system to enable users to achieve the following
Stakeholder Needs (SN).

SN1: Create and maintain secure user accounts and projects on the system<br />
SN2: View the status of all hardware resources in the system<br />
SN3: Request available hardware resources and datasets from published sources<br />
SN4: Once approved, checkout and manage these resources<br />
SN5: Check-in the resources and get status of all hardware resources in the system<br />
SN6: Deliver PoC within schedule constraints, with support for scalability<br />

Based on these stakeholder needs, your team will define system requirements. The table below
lists some of the system requirements to help you get started. You can use these requirements
as a starting point and further refine them and add more. As discussed in the class, you should
map each requirement to one or more stakeholder needs. Likewise, you should ensure that all
stakeholder needs are met.

![Screenshot 2024-01-31 130743](https://github.com/DavidCassity/ECE461LSoftwareProject_Team5/assets/93953735/873568b7-8508-4d9a-b89d-530887bf938a)

## Minimum Viable Product (MVP)

The features described next are needed to deliver a Minimum Viable Product (MVP) for the
PoC. Note that you can be creative in expanding the scope of these features.

![Screenshot 2024-01-31 131018](https://github.com/DavidCassity/ECE461LSoftwareProject_Team5/assets/93953735/fd7fe294-b7f5-44f0-b3e7-f332f86e5e34)

The user management section, shown in Figure 2, should have the following features:

1. A sign-in area where users can sign in by providing their username, userid and
password. If the user clicks on New User, display a pop-up that allows them to enter a
new userid and password.
2. An area where users can create new projects, by providing project name, description,
and projectID.
3. An area where users can choose to login to existing projects.
4. A database where you can save user information and project information.
5. An API to access information stored in the database.
6. Security features to encrypt the userid and password.

![Screenshot 2024-01-31 131141](https://github.com/DavidCassity/ECE461LSoftwareProject_Team5/assets/93953735/1e36fd73-526d-49ff-b63f-d6a4759bb19e)

The resource management section, shown in Figure 3, should have the following features:
1. A display area which shows the capacity of HWSet1 and HWSet2.
2. A display area which shows the availability of HWSet1 and HWSet2.
3. A database where the HW information can be stored and can be retrieved from.
4. A display area which shows how many units of HWSet1 and HWSet2 user wants to
checkout and later check-in.

## General Requirements

One repository for the project - used for all three phases. Please add us (Dr. Samant and
the TAs) to your repo.

* Collaborate with your team using: 
  * daily standups, for example using Zoom or Slack
  * GitHub boards
* Use an issue tracker to keep track of open issues. An issue is a shortfall which prevents
the software from fulfilling its required function. Use issues to track bugs and needed
improvements.
  * Depending on the bug or improvement, an issue may or may not need to be closed
    in a particular project phase (it depends on the phase requirements.)
  * You may want to use a project board to track issues. Please do not combine them
   on a board with user stories.
* User stories - on project boards
  * Ideally, a user story is fine-grained so you can more easily estimate the time to
    completion and assign it to one team member or pair.
  * All the user stories should be defined by the end of Phase1. User stories can be
    refined as you work on the project. The user stories for each phase correspond to
    work that will be started and completed during the phase.
* Read https://www.mountaingoatsoftware.com/agile/user-stories carefully!
  * User story must be described in three sentences or less
  * discuss, include assumptions, refine
  
You are strongly urged to use tools learning during the class, such as Python, React.js,
MongoDB, PyTest, Heruko Cloud Deploy. If your team would like to use a different stack, please
discuss this with your TA.

## Specific Phase Requirements and Grading

### Phase 1 (5 pts)

![Screenshot 2024-01-31 135000](https://github.com/DavidCassity/ECE461LSoftwareProject_Team5/assets/93953735/b3051626-c2e1-43d7-aea2-cb1e8a340401)

### Phase 2 (8 pts)

All general requirements for the project must be satisfied at the end of this phase

![Screenshot 2024-01-31 131927](https://github.com/DavidCassity/ECE461LSoftwareProject_Team5/assets/93953735/81cff510-c7f8-4323-898f-362072382ac8)

### Phase 3 (7 pts)

![Screenshot 2024-01-31 132122](https://github.com/DavidCassity/ECE461LSoftwareProject_Team5/assets/93953735/4041acf3-8807-4844-86f7-38506122a2d1)

Useful Design Pattern Considerations:<br />

Apply the principle of _information hiding_ in your project design. Some things you may want to
consider and describe during Checkpoint3 are:

* Which design decisions do/did you anticipate may change, and how have you
encapsulated these aspects within modules?
* Does your modularization scheme make your program robust to changes so that
additional features can be easily added? How?
* What disadvantages does your modularization approach have? How will you mitigate
them?
* How would you incorporate Refactoring in your code? During Checkpoint3 discussions,
you should highlight a few example candidates for refactoring.
* Cite your sources: What sources did you use? Provide links to tutorials, books, Stack
Overflow pages that you used and indicate how each source was used.
* Reflection: What did your team learn? Three things you want to continue doing, three
things you struggled with and need to improve?
* Your team will participate in a Question/Answer session with TA and instructor during
the week of April 22. You must be present and participate in a significant way to receive
credit. Checkpoint3 discussions are limited to 30 minutes.
