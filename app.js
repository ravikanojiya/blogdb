const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const db = require("./queries");
const cors = require("cors");
const app = express();
const port = 3636;
const DIR = "./uploads";
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
let upload = multer({ storage: storage });
app.use(cors());
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.use(express.static(__dirname+"./uploads"))

app.get("/uploads/:imagename", function (req, res) {
  res.sendFile(__dirname + "/uploads/" + req.params.imagename);
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.post("/newcontacts",db.newcontacts);
app.get('/getcontacts',db.getcontacts);
app.get('/getcontactbyid/:id',db.getcontactbyid);
app.put('/updatecontact',db.updatecontact);
app.delete('/deletecontact/:id',db.deletecontact);
app.post("/getUsers", db.getUsers);
app.get("/getblogs", db.getblogs);
app.post("/createblog", db.createblog);
app.post("/upload", upload.single("image"), db.upload);
app.delete("/deleteblogs/:id", db.deleteblogs);
app.get("/getblogbyid/:id", db.getblogbyid);
app.post("/addcat", db.addcat);
app.get("/getcategory", db.getcategory);
app.put("/updateblog", db.updateblog);
app.get("/getfeaturedblog", db.getfeaturedblog);
app.get("/countblogs", db.countblogs);
app.get("/countactive", db.countactive);
app.get("/countfeatured", db.countfeatured);
app.get("/getactiveblog", db.getactiveblog);
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.post("/send", (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact details</h3>
    <ul>
        <li>Name:${req.body.name}</li>
        <li>Email:${req.body.email}</li>
        <li>Phone:${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <li>Messege:${req.body.message}</li>
    `;
  let transporter = nodemailer.createTransport({
    host: "localhost:5432",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "rkitedu.311@gmail.com", // generated ethereal user
      pass: "ravineha1545", // generated ethereal password
    },
    // tls:{rejectUnauthorized:false}
  });

  // send mail with defined transport object
  let mailOptions = {
    from: '"ModeMailer" <ravikanojiya45@gmail.com>', // sender address
    to: "rkitedu.311@gmail.com", // list of receivers
    subject: "Node Contact req", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("contact", { msg: "Email hasbeen Sent" });
  });
});
app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
