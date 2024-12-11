// document.addEventListener("DOMContentLoaded", () => {
//     const app = document.getElementById("app");

//     // Function to render the sign-up form
//     function renderSignupForm() {
//         app.innerHTML = `
//             <div class="container">
//                 <h1>Sign Up</h1>
//                 <form id="signup-form">
//                     <input id="nname" name="nickname" placeholder="Nickname" required>
//                     <input id="fname" name="first_name" placeholder="First Name" required>
//                     <input id="lname" name="last_name" placeholder="Last Name" required>
//                     <input id="email" name="email" placeholder="Email" required>
//                     <input id="password" name="password" placeholder="Password" type="password" required>
//                     <div class="dropdown-container">
//                         <input id="age-input" name="age" placeholder="Age" type="number" required>
//                         <select id="gender-dropdown" name="gender" required>
//                             <option value="" disabled selected>Gender</option>
//                             <option value="male">Male</option>
//                             <option value="female">Female</option>
//                         </select>
//                     </div>
//                     <button id="submit" type="submit">Sign Up</button>
//                 </form>
//             </div>
//         `;

//         // Attach event listener for the sign-up form
//         const signupForm = document.getElementById("signup-form");
//         signupForm.addEventListener("submit", async (e) => {
//             e.preventDefault();
//             const formData = new FormData(signupForm);

//             try {
//                 const response = await fetch("/", {
//                     method: "POST",
//                     body: formData,
//                 });

//                 if (response.ok) {
//                     alert("Account created successfully!");
//                     renderLoginForm(); // Switch to the login form
//                 } else {
//                     const errorText = await response.text();
//                     alert(`Error: ${errorText}`);
//                 }
//             } catch (err) {
//                 console.error("Sign-up error:", err);
//             }
//         });
//     }

//     // Function to render the login form
//     function renderLoginForm() {
//         app.innerHTML = `
//             <div class="container">
//                 <h1>Log in</h1>
//                 <form id="login-form">
//                     <input id="nname" name="nickname" placeholder="Nickname" required>
//                     <input id="password" name="password" placeholder="Password" type="password" required>
//                     <button id="login-submit" type="submit">Log In</button>
//                 </form>
//             </div>
//         `;

//         // Attach event listener for the login form
//         const loginForm = document.getElementById("login-form");
//         loginForm.addEventListener("submit", async (e) => {
//             e.preventDefault();
//             const formData = new FormData(loginForm);

//             try {
//                 const response = await fetch("/login", {
//                     method: "POST",
//                     body: formData,
//                 });

//                 if (response.ok) {
//                     alert("Logged in successfully!");
//                     // Redirect or handle login success
//                 } else {
//                     const errorText = await response.text();
//                     alert(`Error: ${errorText}`);
//                 }
//             } catch (err) {
//                 console.error("Login error:", err);
//             }
//         });
//     }

//     // Initially render the sign-up form
//     renderSignupForm();
// });
