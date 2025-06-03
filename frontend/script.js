
async function getMeds() {
    try {
        // Fetch the list of medicines from the backend
        const response = await fetch('http://0.0.0.0:8000/medicines');
        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const list = document.getElementById('medicines');
        list.innerHTML = '';
        data.data_list.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    // catch any errors in the fetch operation
    } catch (error) {
        console.error('Error fetching medicines:', error);
        const list = document.getElementById('medicines');
        list.innerHTML = '<li>Error loading medicines</li>';
    }

    setInterval(getMeds, 3000); // Refresh every 3 seconds
    getMeds(); // Initial load
}
