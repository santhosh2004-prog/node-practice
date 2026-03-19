async function saveText() {

  const text = document.getElementById("text").value;

  const response = await fetch("http://localhost:3000/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  const data = await response.json();

  alert(data.message);
}

async function readFile() {

  const res = await fetch("http://localhost:3000/read");
  const data = await res.json();

  document.getElementById("output").textContent = data.content;
}



async function uploadFile() {

  const fileInput = document.getElementById("fileInput");

  if (!fileInput.files.length) {
    alert("Please select a file");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  const response = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  document.getElementById("output").textContent = data.content;
}
