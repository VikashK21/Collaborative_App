import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState([]);
  const [opponentMsg, setOpponentMsg] = useState([]);
  const [notify, setNotify] = useState("");
  const [inpVal, setInpVal] = useState("");
  // const name = prompt("Enter your name to join");

  const formSubmit = (message) => {
    message.preventDefault();
    setMessage((prev) => [...prev, inpVal]);
    socket.emit("send", inpVal);
    setInpVal("");
    // console.log(inpVal, "after");
  };

  const onChangeInp = (e) => {
    setInpVal(e.target.value);
  };

  useEffect(() => {
    socket.on("user-joined", (name) => {
      setNotify(`${name} joined the chat`);
    });
    socket.emit("new-user-joined", "Vikash");
    socket.on("receive", (data) => {
      console.log(data, "data");
      setOpponentMsg((prev) => [...prev, data]);
      console.log(opponentMsg, "msg");
    });
    socket.on("leave", (name) => {
      setNotify(`${name} left the chat`);
    });
  }, []);

  return (
    <>
      <div>
        <h1>Welcome to YourSelf</h1>
        <div class="container">
          {notify.length > 1 && <div className="message left">{notify}</div>}
          {message &&
            message.length > 0 &&
            message.map((value, key) => (
              <div key={key} class="message right">
                <div>
                  <span style={{ color: "orange", fontWeight: "bold" }}>
                    You:{" "}
                  </span>{" "}
                  {value}
                </div>
              </div>
            ))}
          {opponentMsg &&
            opponentMsg.length > 0 &&
            opponentMsg.map((value) => (
              <div class="message left">
                <div>
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {value.name}:{" "}
                  </span>{" "}
                  {value.message}
                </div>
              </div>
            ))}
        </div>

        <div class="send">
          <form action="#" id="send-container" onSubmit={formSubmit}>
            <input
              type="text"
              onChange={onChangeInp}
              value={inpVal}
              id="messageInp"
            />
            <button class="btn" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
