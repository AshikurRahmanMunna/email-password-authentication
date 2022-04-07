import "./App.css";
import app from "./firebase.init";
import "bootstrap/dist/css/bootstrap.min.css";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState([]);
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
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
    } else if (!/(?=.*?[0-9])/.test(password)) {
      setError("Password should have at least one number");
      return;
    } else if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError("Password should have at least one special character");
      return;
    }
    setError("");
    setValidated(true);
    if(registered) {
      signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        console.log(res.user);
        setEmail("");
        setPassword("");
        // Notification
        Notification.requestPermission().then(function (result) {
          if (result === "granted") {
            new Notification(
              `Successfully logged in with ${res.user.email}`
            );
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
    else {
      createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        console.log(res.user);
        setEmail("");
        setPassword("");
        // Notification
        Notification.requestPermission().then(function (result) {
          if (result === "granted") {
            new Notification(
              `Successfully registered by ${res.user.email}`
            );
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
  const handleRegisteredChange = event => {
    setRegistered(event.target.checked);
  }
  return (
    <div>
      <div className="registration w-50 mx-auto">
        <h2 className="text-primary my-3">Please {registered ? 'Login' : 'Register'}!!</h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
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
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered" />
          </Form.Group>
          <p className="text-danger">{error}</p>
          <Button variant="primary" type="submit">
            { registered ? 'Login' : 'Register' }
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
