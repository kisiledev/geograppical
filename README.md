# Geograppical

Geograppical is a geography app developed primarily as a way for me to learn React. The app doubles as a learning tool for students, and allows them to learn about countries in depth, test their knowledge through a variety of tests, and save their favorite countries and best scores in their personal accounts. The app uses React, React Simple Maps, and Bootstrap for the front-end, and connects to a Google Firestore database. 

## Features

- Uses CIA Factbook data converted to a JSON from the [CIA World Factbook API](https://github.com/iancoleman/cia_world_factbook_api)
- Uses React Flags for flag images
- Has an interactive map with links to each individual entry in the factbook, a search tool, and a continental directory. 
- Has 3 quiz modes that allow user to choose to keep time and score 
  - Name the Capital
  - Finding a Country on Map
  - Match a Country to Name
- User can create account with multiple credentials (Google, Twitter, Facebook, Email)
- User can save scores and countries to their profiles. 

## History 

- App began with hard-coded country info, and a form to add your own country to database. 
- Later, I connected it with a simple Countries REST API: I wanted more data to search and display, so I expanded it to a CIA Factbook JSON file. 
- I imported country codes from one database, and linked them with the countries in the Factbook JSON file to create consistent entries for each country. 
- I then programmatically linked countries in the JSON to countries in the map files. 
- I began to add other features (authentication, games, saving) to the app as well. 
