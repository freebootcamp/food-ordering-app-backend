// server.js
const jwt = require("jsonwebtoken");
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const { db } = router;
const middlewares = jsonServer.defaults();
const JWT_SECRET_KEY = "json-server-auth-123456";
const JWT_EXPIRES_IN = "1d";
server.use(jsonServer.bodyParser);
server.use(middlewares);

function isAuthorized(req) {
  console.log("Inside isAuthorized ");

  let reqPath = req.path;
  reqPath = reqPath.replace(/\/\d+/g, "/:id");
  console.log(`after replacement ${reqPath}`);

  const route = db.get("roleMapping").find({ route: reqPath }).value();
  if (typeof route === undefined || !route) {
    return "This route has not configured in the roles mapping";
  }

  const authHeader = req.header("Authorization");
  if (authHeader != undefined) {
    const tokenArr = authHeader.split(" ");
    if (tokenArr[1]) {
      try {
        const payload = jwt.verify(tokenArr[1], JWT_SECRET_KEY);

        if (!payload.role) {
          return "role is missing in user data. At the time of signup don't forget to add role";
        }
        // if (!route) return "AUTHORIZED";
        console.log(`route is ${JSON.stringify(route, null, 2)}`);
        console.log(
          `route.authorization[req.method] is ${JSON.stringify(
            route.authorization[req.method],
            null,
            2
          )}, typeof route.authorization[req.method] is ${typeof route
            .authorization[req.method]}`
        );
        console.log(
          `payload is ${JSON.stringify(
            payload,
            null,
            2
          )}. type is : ${typeof payload.role}`
        );

        console.log(`req.method is ${req.method}`);
        if (route.authorization[req.method].includes(payload.role)) {
          return "AUTHORIZED";
        } else {
          return "Unauthorized to access this resource";
        }
      } catch (err) {
        return err.message;
      }
    } else {
      return "JSON web token missing";
    }
  } else {
    return "Authorization header is empty";
  }
}

server.post("/signup", (req, res) => {
  console.log("Inside signup");
  const { username, password, ...rest } = req.body;
  const existingUser = db.get("users").find({ username }).value();
  if (existingUser) {
    res.status(400).jsonp("username already exists");
    return;
  }

  db.get("users").insert(req.body).write();
  console.log(`Printing after inserting`);
  console.log(db.get("users").find().value());

  res.json(req.body);
});

server.post("/login", (req, res) => {
  console.log("Inside login");
  const { username, password } = req.body;
  console.log(req.body);
  const user = db.get("users").find({ username }).value();
  if (user == undefined || user == null) {
    res.status(400).jsonp("username does not exist");
    return;
  }

  if (user.password !== password) {
    res.status(400).jsonp("Invalid credentials");
    return;
  }

  var token = jwt.sign({ username, role: user.role }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN,
    subject: String(user.id),
  });

  res.json({ message: "login successful", token });
});

server.use((req, res, next) => {
  console.log(`req.path is ${req.path}`);
  const authorizationResult = isAuthorized(req);
  console.log(`authorizationResult: ${authorizationResult}`);
  if (authorizationResult === "AUTHORIZED" || req.path === "/login") {
    next(); // continue to JSON Server router
  } else {
    res.status(401);
    res.send({ message: authorizationResult });
  }
});

server.use(router);

server.listen(5000, () => {
  console.log("JSON Server is running");
});
