function enterStage() {
  window.location.href = "stage.html";
}

function enterAdmin() {
  const password = prompt("ENTER PASSWORD");

  if (password === "1234") {
    window.location.href = "admin.html";
  } else if (password !== null) {
    alert("ACCESS DENIED");
  }
}