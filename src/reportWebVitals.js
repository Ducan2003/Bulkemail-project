document.getElementById('student-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const hostEmailInput = document.getElementById('hostEmail');
  const fileInput = document.getElementById('excelFile');

  if (!firstNameInput || !lastNameInput || !hostEmailInput) {
    console.error('One or more required input elements not found.');
    alert('Please fill out all required fields.');
    return;
  }

  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const hostEmail = hostEmailInput.value;
  const file = fileInput.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/upload-excel', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      console.log(result);
      alert('Emails created from Excel file');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create emails from Excel file' + error.message);
    }
  } else if (firstName && lastName && hostEmail) {
    const data = {
      firstName,
      lastName,
      hostEmail
    };

    try {
      const response = await fetch('/create-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Failed to create email');
      }

      const result = await response.json();
      console.log(result);
      alert('Email created successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create email: ' + error.message);
    }
  } else {
    alert('Please provide first name, last name, and host email or upload an Excel file');
  }
});
