document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log(response);

      // Check if the response is ok
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      console.log(response);
      const data = await response.json();
      console.log(data);
      displayData(data);
      console.log("after display");
    } catch (error) {
      console.log(error);
      console.error("There was a problem with the fetch operation:", error);
    }
  });

function displayData(data) {
  const keys = Object.keys(data[0]);

  // Create table columns based on the keys
  const columns = keys.map((key) => ({
    title: key,
    field: key,
    editor: "input",
  }));

  const filteredData = data.map((item) => ({
    Title: item["Title"],
    Brand: item["Brand"],
    "Number of items": item["Number of Items"],
    "FBA Fees": item["FBA Fees:"],
    "Buy Box": item["Buy Box: Current"],
    COG: item["COG"],
  }));

  new Tabulator("#productTable", {
    data: filteredData,
    columns: [
      { title: "Title", field: "Title" },
      { title: "Brand", field: "Brand" },
      { title: "Number of items", field: "Number of items" },
      { title: "FBA Fees", field: "FBA Fees" },
      { title: "Buy Box", field: "Buy Box" },
      { title: "COG", field: "COG" },
    ],
    layout: "fitColumns",
    pagination: "local",
    paginationSize: 50,
    movableColumns: true,
    resizableRows: true,
    height: "80vh",
  });

  // download button
  document
    .getElementById("downloadButton")
    .addEventListener("click", downloadFilteredData);

  function downloadFilteredData() {
    console.log("download data");
    // Convert the filteredData array to JSON string
    const jsonData = JSON.stringify(filteredData);

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "filtered_data.json";

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

// function displayData(data) {
//   const table = document.getElementById('productTable');
//   table.innerHTML = '';

//   if (data.length === 0) {
//     table.innerHTML = '<tr><td>No data found</td></tr>';
//     return;
//   }

//   const keys = Object.keys(data[0]);
//   const headerRow = document.createElement('tr');

//   keys.forEach(key => {
//     const headerCell = document.createElement('th');
//     headerCell.textContent = key;
//     headerRow.appendChild(headerCell);
//   });
//   table.appendChild(headerRow);

//   data.forEach(row => {
//     const tableRow = document.createElement('tr');

//     keys.forEach(key => {
//       const tableCell = document.createElement('td');
//       tableCell.contentEditable = true; // Make the cell editable
//       tableCell.textContent = row[key];
//       tableRow.appendChild(tableCell);
//     });
//     table.appendChild(tableRow);
//   });
// }

// function displayData(data) {
//   const table = $('#productTable');
//   table.empty();

//   if (data.length === 0) {
//     table.append('<thead><tr><th>No data found</th></tr></thead>');
//     table.append('<tbody></tbody>');
//     return;
//   }

//   const keys = Object.keys(data[0]);
//   const thead = $('<thead><tr></tr></thead>');
//   const tbody = $('<tbody></tbody>');

//   keys.forEach(key => {
//     thead.find('tr').append(`<th>${key}</th>`);
//   });

//   data.forEach(row => {
//     const tr = $('<tr></tr>');

//     keys.forEach(key => {
//       tr.append(`<td contenteditable="true">${row[key]}</td>`);
//     });

//     tbody.append(tr);
//   });

//   table.append(thead);
//   table.append(tbody);

//   // Initialize DataTables
//   table.DataTable();
// }
