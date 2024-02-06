// app.get("/", (req, res) => {
// 	const sess = req.session;
// 	if (sess.username && sess.password) {
// 			if (sess.username) {
// 					res.write(`<h1>Welcome ${sess.username} </h1><br>`)
// 					res.write(
// 							`<h3>This is the Home page</h3>`
// 					);
// 					res.end('<a href=' + '/logout' + '>Click here to log out</a >')
// 			}
// 	} else {
// 			res.sendFile(__dirname + "/login.html")
// 	}
// });
// app.post("/login", (req, res) => {
// 	const sess = req.session;
// 	const { username, password } = req.body
// 	sess.username = username
// 	sess.password = password
// 	// add username and password validation logic here if you want.If user is authenticated send the response as success
// 	res.end("success")
// });
// app.get("/logout", (req, res) => {
// 	req.session.destroy(err => {
// 			if (err) {
// 					return console.log(err);
// 			}
// 			res.redirect("/")
// 	});
// });

export {};
