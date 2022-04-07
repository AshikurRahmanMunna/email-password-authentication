import "./App.css";
import app from "./firebase.init";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState([]);
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");
  const handleEmailBlur = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordBlur = (e) => {
    setPassword(e.target.value);
  };
  const handleFormSubmit = (event) => {
    console.log("form submitted");
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    if (!/.{8,}/.test(password)) {
      setError("Password should bigger than 8 character");
      return;
    } else if (!/(?=.*?[A-Z])/.test(password)) {
      setError("Password should have at least one uppercase letter");
      return;
    } else if (!/(?=.*?[a-z])/.test(password)) {
      setError("Password should have at least one lowercase letter");
      return;
    }
    setError("");
    setValidated(true);
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
          console.log(res.user);
          setEmail("");
          setPassword("");
          setSuccess("Login Success");
          // Notification
          if (res.user.emailVerified === true) {
            Notification.requestPermission().then(function (result) {
              if (result === "granted") {
                new Notification(
                  `Successfully logged in with ${res.user.email}`
                );
              } else if (result === "denied") {
                return;
              }
            });
          }
        })
        .catch((error) => {
          setError(error.message);
          console.error(error);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          console.log(res.user);
          setEmail("");
          setPassword("");
          verifyEmail();
          setSuccess(`Email Verification sent to ${res.user.email}`);
          // Notification
          Notification.requestPermission().then(function (result) {
            if (result === "granted") {
              new Notification(`Email verification sent to ${res.user.email}`);
            } else if (result === "denied") {
              return;
            }
          });
        })
        .catch((error) => {
          setError(error.message);
          console.error(error);
        });
    }
  };
  const handleRegisteredChange = (event) => {
    setRegistered(event.target.checked);
  };
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log(`email verification sent`);
    });
  };
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("email sent");
    });
  };
  const handleNameBlur = (event) => {
    setName(event.target.value);
  };
  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log("Updating name");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  return (
    <div>
      <div className="registration w-50 mx-auto">
        <h2 className="text-primary my-3">
          Please {registered ? "Login" : "Register"}!!
        </h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          {!registered && (
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                onBlur={handleNameBlur}
                type="text"
                placeholder="Enter Your Name"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide your name.
              </Form.Control.Feedback>
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Email.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePasswordBlur}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="my-3" controlId="formBasicCheckbox">
            <Form.Check
              onChange={handleRegisteredChange}
              type="checkbox"
              label="Already Registered"
            />
          </Form.Group>
          <p className="text-success">{success}</p>
          <p className="text-danger">{error}</p>
          <Button onClick={handlePasswordReset} variant="link">
            Forget Password?
          </Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? "Login" : "Register"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
