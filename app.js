const express = require("express");
const app = express();
const cors = require("cors");

const mysql = require("mysql2");

const PORT = process.env.PORT || 8085;
const fs = require("fs");

const multer = require("multer");
const { getFileExtension } = require("./helpers");

// Create a multer instance and specify destination for uploaded files
const upload = multer({ dest: "schoolImages/" });

const corsOptions = {
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static("schoolImages"));

// const con = mysql.createConnection();

// Make sure to create this in mysql when using the desired database
//    create table schools (
//      id int not null auto_increment,
//      name text not null,
//      address text not null,
//      city text not null,
//      state text not null,
//      contact varchar(15) not null,
//      image text not null,
//      email text not null,
//      primary key(id)
// );
//
//
let con;
const dbConfig = {
  host: "sql.freedb.tech",
  user: "freedb_welter",
  password: "wReBrg5%Gewn!d@",
  database: "freedb_testdb1234",
  multipleStatements: true,
};

function handleDisconnect() {
  con = mysql.createConnection(dbConfig); // Recreate the connection, since the old one cannot be reused.
  con.connect(function onConnect(err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  con.on("error", function onError(err) {
    console.log("db error", err);
    // if (err.code == "PROTOCOL_CONNECTION_LOST") {
    //   // Connection to the MySQL server is usually
    //   handleDisconnect(); // lost due to either server restart, or a
    // } else {
    //   // connnection idle timeout (the wait_timeout
    //   throw err; // server variable configures this)
    // }
    handleDisconnect();
  });
}
handleDisconnect();

con.on("connection", () => {
  console.log("db connected");
});
// con.on("error",(err)=>{
//   console.log("err: ",err)
//   con.connect()
// })

app.post("/addSchool", upload.single("image"), (req, res) => {
  const body = req.body;
  const file = req.file;

  console.log("body: ", body);
  console.log("file: ", file);

  const fileExtension = getFileExtension(file.originalname);
  const imagePath = `schoolImages/${file.filename}`;
  const imagebuffer = fs.readFileSync(imagePath);
  fs.unlinkSync(imagePath);
  const newImagePath = `${imagePath}.${fileExtension}`;
  fs.writeFileSync(newImagePath, imagebuffer);
  const newImageName = `${file.filename}.${fileExtension}`;
  const sqlQueryAdd = `use ${dbConfig["database"]};
                    insert into schools (name,address,city,state,contact,image,email)
                    values ( '${body.name}', '${body.address}',  '${body.city}','${body.state}','${body.contact}','${newImageName}', '${body.email}');
  `;

  con.query(sqlQueryAdd, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "something wrong" });
    } else {
      console.log(result);
      res.json({ status: "ok", message: "School details successfully added" });
    }
  });

  // res.json({ status: 200, message: "ok" });
});

app.get("/getSchools", (req, res) => {
  const sqlQueryGet = `use ${dbConfig["database"]};
  select name,address,city,image from schools;`;

  con.query(sqlQueryGet, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "something wrong" });
    } else {
      console.log(result);
      res.json(result);
    }
  });
});

app.listen(PORT, () => {
  console.log("app is running in PORT ", PORT);
});
