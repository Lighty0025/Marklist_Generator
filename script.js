// script.js

let currentLanguage = 'en';

function addSubjectRow() {
  const table = document.getElementById("subjectRows");
  const row = table.insertRow();

  row.innerHTML = `
    <td><input type="text" class="subjectName" placeholder="Subject" /></td>
    <td><input type="number" class="subjectMarks" min="0" oninput="updatePercentages()" /></td>
    <td><input type="number" class="subjectOutOf" min="1" value="100" oninput="updatePercentages()" /></td>
    <td><span class="subjectPercent">0%</span></td>
    <td><span class="subjectGrade">F</span></td>
    <td><button class="delete-btn" onclick="deleteRow(this)">X</button></td>
  `;
  playPop();
}

function updatePercentages() {
  const rows = document.querySelectorAll("#subjectRows tr");
  rows.forEach(row => {
    const marks = row.querySelector(".subjectMarks").value;
    const outOf = row.querySelector(".subjectOutOf").value;
    const percentSpan = row.querySelector(".subjectPercent");
    const gradeSpan = row.querySelector(".subjectGrade");

    const percentage = (marks / outOf) * 100 || 0;
    percentSpan.innerText = percentage.toFixed(2) + "%";
    gradeSpan.innerText = getGrade(percentage);
  });
}

function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
}

function deleteRow(btn) {
  const row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function generateMarksheet() {
  const name = document.getElementById("studentName").value;
  const roll = document.getElementById("rollNo").value;
  const term = document.getElementById("examTerm").value;
  const t = translations[currentLanguage];

  let html = `
    <h3>${t.title} - ${term}</h3>
    <p><strong>${t.name}</strong> ${name} | <strong>${t.roll}</strong> ${roll}</p>
    <table>
      <tr>
        <th>${t.subject}</th>
        <th>${t.marks}</th>
        <th>${t.outof}</th>
        <th>${t.percent}</th>
        <th>${t.grade}</th>
      </tr>
  `;

  const rows = document.querySelectorAll("#subjectRows tr");
  rows.forEach(row => {
    const subject = row.querySelector(".subjectName").value;
    const marks = row.querySelector(".subjectMarks").value;
    const outOf = row.querySelector(".subjectOutOf").value;
    const percentage = row.querySelector(".subjectPercent").innerText;
    const grade = row.querySelector(".subjectGrade").innerText;

    html += `
      <tr>
        <td>${subject}</td>
        <td>${marks}</td>
        <td>${outOf}</td>
        <td>${percentage}</td>
        <td>${grade}</td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById("result").innerHTML = html;
  playPop();
}

function downloadAsPNG() {
  const node = document.getElementById("result");
  html2canvas(node).then(canvas => {
    const link = document.createElement("a");
    link.download = "marksheet.png";
    link.href = canvas.toDataURL();
    link.click();
  });
  playPop();
}

function downloadAsPDF() {
  const result = document.getElementById("result");
  const opt = {
    margin: 1,
    filename: 'marksheet.pdf',
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(result).set(opt).save();
  playPop();
}

function downloadAllAsZip() {
  const zip = new JSZip();
  const result = document.getElementById("result");

  html2canvas(result).then(canvas => {
    canvas.toBlob(blob => {
      zip.file("marksheet.png", blob);
      zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, "marksheets.zip");
      });
    });
  });
  playPop();
}

function changeLanguage(lang) {
  currentLanguage = lang;
  const t = translations[lang];
  document.querySelector("h2").innerText = t.title;
  document.querySelector("label[for='studentName']").innerText = t.name;
  document.querySelector("label[for='rollNo']").innerText = t.roll;
  document.querySelector("label[for='examTerm']").innerText = t.term;
  updatePercentages();
  playPop();
}

function toggleSettings() {
  const panel = document.getElementById("settingsPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
  playPop();
}

function toggleDarkMode(btn) {
  document.body.classList.toggle("dark-mode");
  btn.innerText = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
  playPop();
}

function playPop() {
  const audio = new Audio("pop.wav");
  audio.play();
}

function setBackgroundImage(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("result").style.backgroundImage = `url('${e.target.result}')`;
    };
    reader.readAsDataURL(file);
  }
}

function setBackgroundColor(color) {
  document.getElementById("result").style.backgroundColor = color;
}
