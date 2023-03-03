const express = require('express');

const app = express();
const PORT = process.env.PORT;

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'));


const html_dir  = __dirname + '/templates/';
console.log(html_dir);

app.get('/', (req, res) => {
    res.sendFile(html_dir + 'homepage.html');
});


// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));