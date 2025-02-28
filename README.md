# :star: Introduction
- API created to manage devices in a database
- The language used for this project is TypeScript v5.7.3
- The database used is MySQL v8.0

# :exclamation: DISCLAIMER :exclamation:
So, the first interviewer told me this was a NodeJS position but this is
actually a TypeScript test. The reason why it lacks so much regarding TS, is because I was more than 3 years without touching any TS code. Only pure NodeJS, if this was a pure Node project I guarantee you it would be waaay better. Nonetheless I tried to do that and I learned a lot of things in those past 3 days, if I had more, I problably could do better :D. But keep in mind that pretty much everything I did for this project was learned within those 3 days and also while doing other stuff.
The technologies selected for this project were based on research as well since I'm not very familiar with the "TS usual environment and it's tools". 
One thing that is essential to mention, is that unfortunately I tried to put the whole application in containers, but for some odd reason ```knex``` was not working on the container in order to make the migrations and seeds. So my work around was to put the mysql container out of the main application. You can make the application do both things but we would have to manually add tables and feed those tables. My goal here since I had problems with that was to make the REST API function proper and respecting all the business rules (time constraint was a factor). But if you try ```docker-compose up``` on the root folder it will run on the container, both api and database, the problem is that the migrations are not working.
Testing was also a problem because I left that for doing last and unfortunately my time was up to deliver the project.
Okay but let's get into what is really interesting.

## :wrench: Requirements
- NodeJS v18+
- TypeScript v5+ installed in your machine and ability to perform ```tsc``` without problems.
- You should have Docker v20+ installed on your machine
- NPM should also be installed on your machine (at least v10)


## :zap: Usage
Verify you fullfill all the requirements needed to execute ```telcom-be``` repo.

1. **After downloading the repo, go to your repo root folder, open a terminal and type**:

```
npm install
```
This will get you all the packages necessary to run the application.

2. **Environment variables:**

Create a ```.env``` file to provide the necessary environment variables to execute the next steps.
Fill them with your information. You can use the ```.env.example``` file to know which variables are required. 

3. **Run your DB**:

This could be done using the docker-compose from the root folder, or using the one inside of ./containers/mysql (would be a single container running)

Single container option (with open terminal):
```
cd containers/mysql
```
After that, type:

```
docker-compose up
```

Okay so now our DB should be running!

4. **Run migrations and seeds:**

Go to your root folder. After that:

```
knex migrations:latest && knex seed:run
```

If you are a Windows user you should run one command at a time.
Make sure they all worked.

5. **Run the API:**

```
npm run dev
```

If you see the message ```Server running at: localhost:4000``` then we are good to go.

6. **Check the endpoints available:**

Now that our API is running you can check for the endpoints available at ```http://localhost:4000/api-docs```

7. **Test the endpoints:**

Use a tool of your choice (Postman, Insomnia) to hit the apis. You can also use the Swagger UI to see the api documentation and usage of endpoints.

# :fire: Final thoughts

Although it was a hard time learning new things while doing the application in 3 days, I learned so much from this! It's fun to think that 3 days ago I did not know pretty much any of this hahaha. Thanks!


