let codeReader;
let lastProductName = "";
let previewElem;

window.onload = () => {
  previewElem = document.getElementById('preview');
  loadComponent('header', 'components/header.html');
  loadComponent('footer', 'components/footer.html');
};

function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => document.getElementById(id).innerHTML = html);
}

function openScanner() {
  document.getElementById('startScanBtn').style.display = 'none';
  document.getElementById('scannerUI').style.display = 'block';
  document.getElementById("productInfo").innerHTML = "Searching for chemical...";

  codeReader = new ZXing.BrowserMultiFormatReader();
  codeReader.decodeOnceFromVideoDevice(undefined, previewElem)
    .then(result => {
      codeReader.reset();
      const barcode = result.text;
      document.getElementById('barcode').value = barcode;

      fetch(`https://script.google.com/macros/s/AKfycbylVi6R5O2weg4d0gDdCjRz3imuBbZBKzsEJKjvYlbPrvNeLZ-7LZ1l4xiahUe6MI8S/exec?barcode=${encodeURIComponent(barcode)}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === "found") {
            lastProductName = data.product;
            document.getElementById("productInfo").innerHTML = `✅ <strong>${lastProductName}</strong>`;
          } else {
            document.getElementById("productInfo").innerHTML = "❌ Product not found";
          }
        })
        .catch(() => {
          document.getElementById("productInfo").innerHTML = "❌ Error checking inventory";
        });
    })
    .catch(err => {
      console.error(err);
      document.getElementById("productInfo").innerHTML = "❌ Error starting camera";
    });
}

function submitData() {
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting...";

  const user = localStorage.getItem("employeeName") || "Unknown";
  const quantity = document.getElementById("quantity").value.trim();
  const barcode = document.getElementById("barcode").value.trim();

  if (!user || !quantity || !barcode) {
    document.getElementById("result").innerText = "Please fill out all fields.";
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbx_Bl4QAbqVSZndyQT97xMBKow-8AjLC3A6oHHbpGAziaIOCi1Mvqqnt9ofYA4vT9gUvA/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `user=${encodeURIComponent(user)}&quantity=${encodeURIComponent(quantity)}&barcode=${encodeURIComponent(barcode)}`
  })
  .then(() => {
    document.getElementById("result").innerHTML =
      `✅ Submitted:<br><strong>${lastProductName || barcode}</strong><br>📦 Qty: ${quantity} | 👤 ${user}`;

    document.getElementById("quantity").value = "";
    document.getElementById("barcode").value = "";
    document.getElementById("productInfo").innerHTML = "";

    document.getElementById("scannerUI").style.display = "none";
    document.getElementById("startScanBtn").style.display = "inline-block";
  })
  .catch((err) => {
    console.error("Send error:", err);
    document.getElementById("result").innerText = "❌ Error sending data.";
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
  });
}

function goBack() {
  window.location.href = 'index.html';
}
