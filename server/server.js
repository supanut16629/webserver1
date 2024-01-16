const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const port = 5000;
//connect mongoDB
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.URI_DATABASE_2214);
const db = mongoose.connection;
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on('error', ()=>{console.log('MongoDB connection error:')});
//end connect mongoDB

//collection users
const userSchema = new mongoose.Schema({
  firstname: String,
  surname: String,
  email: String,
  password: String,
  isAdmin: Number,
});
const UserModel = mongoose.model("users", userSchema);

//collection roles
const roleSchema = new mongoose.Schema({
  role_Name: String,
  number_Of_People: Number,
});
const RoleModel = mongoose.model("roles", roleSchema);

//collection Person in role
const personInRoleSchema = new mongoose.Schema({
  role_ID: String,
  user_ID: String,
});
const PersonInRoleModel = mongoose.model("person_in_roles", personInRoleSchema);

//relationshipGroup
const relationshipGroupSchema = new mongoose.Schema({
  relationship_Name: String,
})
const RelationshipGroupModel = mongoose.model("relationship_groups",relationshipGroupSchema);

//relationship_group_step
const relationshipGroupStepSchema = new mongoose.Schema({
  step_ID: Number,
  relationship_ID: String,
  role1_ID: String,
  relationship_Type: String,
  role2_ID:String,
  fixed_Person_Role2_ID:String,
})

const RelationshipGroupStepModel = mongoose.model("relationship_group_step",relationshipGroupStepSchema)


//flows
const flowSchema = new mongoose.Schema({
  flow_Name: String,
})

const FlowModel = mongoose.model("flows",flowSchema)

//flow-step ////

//initial step
const flowStepSchema = new mongoose.Schema({
  flow_ID: String,
  step_ID: Number,
  step_Type: String,
  //init
  relationship_ID: String,
  is_Add_Text: String,
  topic_Add_Text: String,
  is_Add_Other_File: String,
  topic_Add_Other_File: String,
  // approval
  topic_Send_To_Approve: String,
  role_Approver_ID: String,

})

const FlowStepModel = mongoose.model("flow_step",flowStepSchema)



//////
app.use(cors());
app.use(express.json());
//by part Axios
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/signup", async (req, res) => {
  const { firstname, surname, email, isAdmin, password } = req.body;

  try {
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      ///
      const newUser = new UserModel({
        firstname: firstname,
        surname: surname,
        email: email,
        password: hash,
        isAdmin: isAdmin,
      });
      await newUser.save();
      return res.json({
        status: "ok",
        message: "New user Successfully created!",
      });
    });
  } catch (err) {
    console.error("Error = ", err);
    return res.json({ status: "error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    //Authenticate User
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      // No user found with the specified email
      return res.json({
        status: "error",
        message: "no user found (status 401)",
      });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        // Passwords match, generate and return a JWT token
        const token = jwt.sign(
          { email: user.email },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: 3600 }
        );
        console.log("User from Backend", user);
        return res.json({ status: "ok", token, data: user });
      } else {
        // Passwords do not match
        res.json({ status: "error", message: "no user found (status 401)" });
      }
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({status : "Token error", message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ status : "token error", message: "Invalid token." });
  }
};

// API Middleware to verify JWT
app.post("/auth", function (req, res, next) {
  const authHeader = req.headers["authorization"];
  /*split because authHeader = Bearer {token}
        const token = {token}
    */
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401).json({status:"token error"});
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) return res.json({ status: "error", message: err });
    //data = email ,iat,exp
    /////////////////////////////////////////////////////////////////////////////////
    res.json({ status: "ok", data });
  });
});

app.post("/checkEmailRepeat", async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      // Email is already in use
      return res.json({ status: "repeat" });
    } else {
      // Email is not in use
      return res.json({ status: "ok" });
    }
  } catch (error) {
    console.error("Error checking email repetition:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/fetchRoles", verifyToken, async (req, res) => {
  try {
    // Use Mongoose to find all roles
    const roles = await RoleModel.find();

    // Return the roles as JSON
    res.json({ results: roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/fetchPersonFromRole", verifyToken, async (req, res) => {
  try {
    const { role_ID } = req.body;
    const listPerson = await PersonInRoleModel.find({ role_ID });
    if (!listPerson) return res.json({});

    const listUserID = listPerson.map((item, index) => item.user_ID);

    const listUsers = await UserModel.find({ _id: { $in: listUserID } });

    return res.json({ users: listUsers });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json(error);
  }
});

app.put("/api/updateRole/:id", verifyToken, async (req, res) => {
  try {
    const role_ID = req.params.id;
    const { role_Name, personToAdd } = req.body;

    //check Role_name ซ้ำ ยังไม่มี

    //Update(เพิ่ม) คนในrole ก่อน (ถ้าลบคนออกอีก Api)
    //insert PersonInRole (Many Document)
    const personInRolePromises = personToAdd.map(async (user_ID) => {
      const newPersonInRole = new PersonInRoleModel({
        role_ID: role_ID,
        user_ID: user_ID
      })
      return await newPersonInRole.save();
    })

    // Wait for all inserts to complete
    await Promise.all(personInRolePromises); 
    ///////
    const listPersons = await PersonInRoleModel.find({ role_ID: role_ID });
    const countNumberPersons = listPersons.length;


    //Update number_Of_People
    const updatedRole = await RoleModel.findOneAndUpdate(
      { _id: role_ID },
      { role_Name: role_Name, number_Of_People: countNumberPersons },
      { new: true }
    );

    return res.json({ updatedRole });
  } catch (error) {
    console.error("Error updating documents:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/createRoleAndInsertPerson", verifyToken, async (req, res) => {
  const { role_Name, personToAdd } = req.body;

  try{
    //check Role_name ซ้ำ ยังไม่มี

    //insert Role
    const newRole = new RoleModel({
      role_Name:role_Name,
      number_Of_People: personToAdd.length
    })
    await newRole.save();
    
    //find newRole
    const newRoleFound = await RoleModel.findOne({role_Name:role_Name})
    
    //insert PersonInRole (Many Document)
    const personInRolePromises = personToAdd.map(async (user_ID) => {
      const newPersonInRole = new PersonInRoleModel({
        role_ID: newRoleFound._id,
        user_ID: user_ID
      })
      return await newPersonInRole.save();
    })

    // Wait for all inserts to complete
    await Promise.all(personInRolePromises); 

    return res.json({msg:"ok success",role_Name,number : personToAdd.length})
  }catch(error){
    console.error("Error create documents:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

});

app.post("/api/delUserFromRoleUpdate",verifyToken ,async (req,res) => {
  try{
    const { listIdToDel,role_ID } = req.body
    // Delete documents where role_ID matches and user_ID is in the listIdToDel array
    const result = await PersonInRoleModel.deleteMany({
      role_ID: role_ID,
      user_ID: { $in: listIdToDel },
    });

    //Update
    const listPersons = await PersonInRoleModel.find({ role_ID: role_ID });
    const countNumberPersons = listPersons.length;
    //Update number_Of_People
    const updatedRole = await RoleModel.findOneAndUpdate(
      { _id: role_ID },
      { number_Of_People: countNumberPersons },
      { new: true }
    );

    return res.json({ updatedRole });

  }catch(error){
    console.error("Error deleting and updating documents:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
})

app.post("/api/fetchUserWithOutRole", verifyToken, async (req, res) => {
  const { listUserInRoleID } = req.body;
  const listUsersWithOutRole = await UserModel.find({
    _id: { $nin: listUserInRoleID },
  });
  return res.json({ users: listUsersWithOutRole });
});

app.post("/api/createRelationshipGroup", verifyToken,async (req, res) => {
  const relationship_Name = req.body.nameRelationship;
  try{
    const findNameRepeat = await RelationshipGroupModel.find({relationship_Name:relationship_Name})
    if(findNameRepeat.length !== 0){
      return res.status(201).json({status:"repeat",check:findNameRepeat})
    }

    const newRelationship = new RelationshipGroupModel({
      relationship_Name: relationship_Name,
    });
    const savedRelationship = await newRelationship.save();
    return res.status(201).json({status:"ok",result: savedRelationship})
  }catch(error){
    console.error(error);
    res.status(500).json({status:"error", message: 'Internal server error' });
  }
})

app.get("/api/fetchRelationship",verifyToken, async (req, res) => {
  try {
    // Use Mongoose to find all roles
    const relationshipGroups = await RelationshipGroupModel.find();

    // Return the roles as JSON
    res.json({ results: relationshipGroups ,status:"ok"});
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({status:"error", error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Example server listen port ${port}`);
});

///////////////////////////////////////////////////////////////////////////

// Test
app.post("/insertPersonToRole", async (req, res) => {
  try {
    const { email, role_Name } = req.body;
    const user = await UserModel.findOne({ email });
    const role = await RoleModel.findOne({ role_Name });

    if (!user) {
      return res.json({ status: "error", message: "User not found" });
    }

    const newPersonInRole = new PersonInRoleModel({
      role_ID: role.id, // Replace with the actual role ID
      user_ID: user._id,
    });
    await newPersonInRole.save();

    return res.json({
      status: "ok",
      message: "User successfully inserted into role",
    });
  } catch (error) {
    console.error("Error inserting person into role:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
});

// app.post("/createRoleName", async (req, res) => {
//   const { role_Name, number_Of_People } = req.body;
//   try {
//     const role = await RoleModel.findOne({ role_Name });
//     console.log(role_Name, number_Of_People);
//     // const newRole = new RoleModel({
//     //   role_Name: role_Name,
//     //   number_Of_People:number_Of_People,
//     // });
//     if (role) {
//       role.number_Of_People = number_Of_People;

//       // Save the updated role back to the database
//       const updatedRole = await role.save();
//       console.log('Role updated:', updatedRole);
//     }
//     return res.json({
//       status: "ok",
//       message: "New user Successfully created!",
//     });
//   } catch (err) {
//     console.error("Error = ", err);
//     return res.json({ status: "error" });
//   }
// });
