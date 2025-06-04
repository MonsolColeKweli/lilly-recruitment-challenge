
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

function searchMedicine() {
            const name = document.getElementById('search-medicine').value;
            fetch(`http://0.0.0.0:8000/medicines/${encodeURIComponent(name)}`)
                .then(response => response.json())
                .then(data => {
                    alert(`Medicine: ${data.name}\nPrice: ${data.price}`);
                })
                .catch(error => {
                    alert('Medicine not found.');
                });
        }

        function updateMedicine() {
            const name = document.getElementById('update-med-ID').value;
            const price = document.getElementById('update-new-price').value;
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);

            fetch('http://0.0.0.0:8000/update', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message);
                } else if (data.error) {
                    alert(data.error);
                }
            })
            .catch(error => {
                alert('Error updating medicine.');
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            if (typeof getMeds === 'function') {
                getMeds('medicines');
            }
        });
