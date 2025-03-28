// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', function(event) {
        // Prevent the form from submitting immediately
        event.preventDefault();
        
        // Basic form validation
        const name = form.querySelector('input[name="name"]').value.trim();
        const email = form.querySelector('input[name="email"]').value.trim();
        const company = form.querySelector('input[name="company"]').value.trim();
        const jobTitle = form.querySelector('input[name="jobtitle"]').value.trim();
        const engineers = form.querySelector('input[name="engineers"]').value.trim();
        
        if (!name || !email || !company || !jobTitle || !engineers) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Simple email validation
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,6}$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Ensure number of engineers is a positive number
        if (isNaN(engineers) || engineers <= 0) {
            alert('Please enter a valid number of engineers.');
            return;
        }
        
        // If all validations pass, submit the form
        form.submit();
    });
});
