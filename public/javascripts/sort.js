// Function to convert images to PDF
function convertImagesToPdf() {
	const images = document.querySelectorAll('img');
	const loader = document.querySelector('span.loader');
	const convertText = document.querySelector('span.text');
	const downloadButton = document.querySelector('a.download');
  
	const filenames = Array.from(images).map((image) => image.dataset.name);
  
	// Activate loading animation
	loader.style.display = 'inline-block';
	convertText.style.display = 'none';
  
	// Send the filenames to the server and receive the PDF link
	fetch('/pdf', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(filenames),
	})
	  .then((resp) => resp.text())
	  .then((data) => {
		loader.style.display = 'none';
		convertText.style display = 'inline-block';
		downloadButton.style.display = 'inline-block';
		downloadButton.href = data;
	  })
	  .catch((error) => {
		console.error(error.message);
	  });
  }
  
  // Event listener for the convert button
  document.querySelector('a.convert').addEventListener('click', convertImagesToPdf);
  