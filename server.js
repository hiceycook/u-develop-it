//dependencies and PORT setup
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());





//routes









// Default response for a bad request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});


//start express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});