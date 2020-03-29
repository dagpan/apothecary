# apothecary-frontend
 Mod-3-Project-Apothicary-App-frontend

# The Apothecary App

*   The Apothecary App will let you navigate a map and search for Pharmacies
  in the area of the map you navigate in and you can check them for offered services besides 
  selling drugs and beauty products, like Flu vaccination, COVID-19 testing, 
  Blood Sugar Testing, Blood Pressure Reading, e.t.c.
  Enjoy!



# Configuration

*   Warning: 
  Google Maps requires a special Google Maps API key. Without this key, you cannot display Google Maps on your website. There used to be two separate keys, the Google Maps API browser key and the Google Maps API GeoCoding key. Since Yoast Local SEO 11.9, only 1 Google Maps API key is required.
  You must have a Google account with billing enabled to generate a key for Google Maps API.

*  You have to place your Google Cloud Platform provided API KEY like the bellow example
  src="https://maps.googleapis.com/maps/api/js?key=YOUR-API-KEY&libraries=places&callback=initMap"
  in the script tag with id="apiHolder" at line 15 in the index.html file.
  So please do the following : 
  create a file named config.js in the frontend/src directory
  Add the bellow 2 lines to the file and replace the YOUR_API_KEY with the one 
  Google Cloud Platform will provide. 
   `const apiKeySrc = document.querySelector("#apiHolder")`
   `apiKeySrc.src ="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap"`


#  Information about the backend 

*  Platform -- ruby on Rails
*  Ruby Version  2.6.1
*  Rails Version 6.0.2
*  Database created with PostgreSQL
*  PostgreSQL. Versions 9.3 and up are supported

# Database creation and initialization

*  You need to install postgresql to manage the database if you don't have it installed already.
   You have to setup the user account you have for creating and managing databases in postgresql
   in the database.yml file in the config directory

*  Important! When using postgres for our database, we need to run rails db:create before migrating. 

*  You need to run the following commands in your Terminal. Run `rails db:create` then
  `rails db:migrate` to set up your database
   and also you can run `rails db:seed` with example data 
   for Pharmacies, Users and Services in the default area the map opens up

*  Then you need to run `rails server` and the Rails server will start and will be listening at
   http://localhost:3000/
   The default port is 3000 but if you want to change it, you can do so in the 
   puma.rb file in the config directory or in the command line.

#  open the index.html file in the frontend directory in your browser (recommend Chrome)
#  and JavaScript will do the rest.
* And if you find any bugs, please let me know !