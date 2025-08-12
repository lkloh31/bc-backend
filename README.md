1. create database bc
2. npm install
3. npm install mapbox-gl
4. npm install framer-motion
5. npm install axios
6. npm run db:reset
7. npm run dev

Instructions for the .env file:

1. Go to https://newsapi.org > sign up and get the API key
2. Go to https://www.exchangerate-api.com > sign up and get the API key
3. Create an .env file in the backend folder
4. Update .env as follows:

   DATABASE_URL=postgres://username@localhost:5432/bc // update the USERNAME
   JWT_SECRET=lincolnrock$
   NEWS_API_KEY=15b33c1f684a44d8b01d153500ec7d77 // update the API_KEY
   EXCHANGE_API_KEY=e1df6ca5eb4a6b0b676ccf10 // update the API_KEY
   MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoibGtsb2gzMSIsImEiOiJjbWUzMHFhYzIwMjhzMnNvbjVhenoxNGx6In0.prhOo6V_pATa5V7HZijTtA
