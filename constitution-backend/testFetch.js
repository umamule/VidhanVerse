import fetch from "node-fetch";

fetch("http://localhost:5000/api/resources")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
