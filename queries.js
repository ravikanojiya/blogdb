const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "blogdb",
  password: "root",
  port: 5432,
});

const newcontacts = (req, res) => {
  const { name, email, mobile } = req.body;
  pool.query(
    "insert into contacts (name,email,mobile) values($1,$2,$3)",
    [name, email, mobile],
    (error, result) => {
      if (error) {
        throw error;
      }
      res.status(201).send("contact added......");
    }
  );
};
const getcontacts = (req, res) => {
  pool.query("select * from contacts order by cid asc", (error, result) => {
    if (error) {
      throw error;
    }
    res.status(201).json(result.rows);
  });
};
const getcontactbyid = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("select * from contacts where cid=$1", [id], (error, result) => {
    if (error) {
      throw error;
    }
    res.status(200).json(result.rows);
  });
};
const updatecontact = (req, res) => {
  const cid = parseInt(req.body.cid);
  const { name, email, mobile } = req.body;
  pool.query(
    "update contacts set name=$1,email=$2,mobile=$3 where cid=$4",
    [name, email, mobile, cid],
    (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Contacts Updated....${cid}`);
    }
  );
};

const deletecontact = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("delete from contacts where cid=$1", [id], (error, result) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Contacts Deleted....${id}`);
  });
};
const createblog = (req, res) => {
  const {
    title,
    id,
    cid,
    description,
    image,
    is_featured,
    is_active,
    created_at,
  } = req.body;
  // console.log("db" + image);
  // console.log("db" + typeof(image));
  // var x=image.valueOf();
  // console.log(x[0]);
  // console.log("dd"+typeof(x[0]));
  pool.query(
    "insert into blogs (title, id, cid, description, image, is_featured, is_active, created_at) values($1,$2,$3,$4,$5,$6,$7,$8)",
    [title, id, cid, description, image[0], is_featured, is_active, created_at],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      res.status(201).send(`Blog added ...`);
    }
  );
};
const upload = (req, res) => {
  if (!req.file) {
    console.log("No file Recived");
    return res.send({
      success: false,
    });
  } else {
    return res.send({
      success: true,
      name: req.file.filename,
    });
  }
};

const addcat = (req, res) => {
  const { category_name } = req.body;
  pool.query(
    "insert into categories (category_name) values($1)",
    [category_name],
    (error, result) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`Category added...`);
    }
  );
};
const getUsers = (req, res) => {
  const { name, email } = req.body;
  pool.query(
    "select * from users where name=$1 AND email=$2",
    [name, email],
    (error, result) => {
      if (error) {
        console.log(error);
        // res.send({ status: 200, msg: "login denied", data: '' });
      }
      res.send({ status: 201, msg: "login success", data: result.rows });
      console.log(result.rows);
      // console.log(result);

      // res.status(201).send(req.body);
    }
  );
};
const getblogs = (req, res) => {
  pool.query("select * from blogs order by bid desc", (error, result) => {
    if (error) {
      throw error;
    }
    res.status(200).json(result.rows);
  });
};
const deleteblogs = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("delete from blogs where bid=$1", [id], (error, result) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Blog deleted${id}`);
  });
};
const getblogbyid = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("select * from blogs where bid=$1", [id], (error, result) => {
    if (error) {
      throw error;
    }
    res.status(200).json(result.rows);
  });
};
const getcategory = (req, res) => {
  pool.query("select * from categories order by cid asc", (error, result) => {
    if (error) {
      throw error;
    }
    res.status(200).json(result.rows);
  });
};
const getfeaturedblog = (req, res) => {
  const is_featured = 1;
  pool.query(
    "select * from blogs where is_featured=$1 order by bid desc",
    [is_featured],
    (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json(result.rows);
    }
  );
};
const getactiveblog = (req, res) => {
  const is_active = 1;
  pool.query(
    "select * from blogs where is_active=$1 order by bid desc",
    [is_active],
    (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json(result.rows);
    }
  );
};
const countblogs = (req, res) => {
  pool.query("select count(*) as blogcount from blogs", (error, result) => {
    if (error) {
      throw error;
    }
    res.status(200).json(result.rows);
  });
};

const countactive = (req, res) => {
  const is_active = 1;
  pool.query(
    "select count(*) as activeblogcount from blogs where is_active=$1",
    [is_active],
    (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json(result.rows);
    }
  );
};
const countfeatured = (req, res) => {
  const is_featured = 1;
  pool.query(
    "select count(*) as featuredblogcount from blogs where is_featured=$1",
    [is_featured],
    (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).json(result.rows);
    }
  );
};
const updateblog = (req, res) => {
  const bid = parseInt(req.body.bid);
  const {
    title,
    id,
    cid,
    description,
    image,
    is_featured,
    is_active,
    created_at,
  } = req.body;
  pool.query(
    "update blogs set title=$1,id=$2,cid=$3,description=$4,image=$5,is_featured=$6,is_active=$7,created_at=$8 where bid=$9",
    [
      title,
      id,
      cid,
      description,
      image[0],
      is_featured,
      is_active,
      created_at,
      bid,
    ],
    (error, result) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Blog Updated....${bid}`);
    }
  );
};

module.exports = {
  newcontacts,
  getcontacts,
  getcontactbyid,
  updatecontact,
  deletecontact,
  getUsers,
  countblogs,
  countactive,
  countfeatured,
  createblog,
  upload,
  getblogs,
  deleteblogs,
  getblogbyid,
  addcat,
  getcategory,
  updateblog,
  getfeaturedblog,
  getactiveblog,
};
