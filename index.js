function check() {
  const barcode = document.getElementById('barcode').value;
  const user = document.getElementById('user').value;
  const quantity = document.getElementById('quantity').value;

  if (!barcode || !user || !quantity) {
    document.getElementById('output').innerText = "⚠️ Please fill all fields.";
    return;
  }

  document.getElementById('output').innerHTML = `
    ✅ Product Checked:<br>
    📦 Barcode: ${barcode}<br>
    👤 User: ${user}<br>
    📊 Quantity: ${quantity}
  `;
}
