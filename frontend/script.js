
async function getMeds() {
    try {
        // Fetch the list of medicines from the backend
        const response = await fetch('http://localhost:8000/medicines');
        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // parse data as JSON
        // const jsonData = JSON.parse(data);
        // data is in array format so we need to seperate the elements

        // log view for data:
        console.log(data);
        console.log(data.medicines);
        
        // loop to parse data and add to items to list:
        for(let item of data.medicines) {
            // error handling for null items name/price
            if(item.name == null || item.price == null){
                console.error('Null Item', item.name, item.price);
                continue; // skip to next item
            }
            if(item.name == ""){
                console.error('No Name', item)
                continue; // skip to next item
            }

            const list = document.getElementById('medicines');
            const li = document.createElement('li');
            
            li.textContent = `${item.name} - $${item.price}`;
            list.appendChild(li);
        }
        /*old code below:*/
    //     const list = document.getElementById('medicines');
    //     list.innerHTML = '';
    //     jsonData.forEach(item => {
    //         const li = document.createElement('li');
    //         li.textContent = item;
    //         list.appendChild(li);
    //     });
    // catch any errors in the fetch operation
    } catch (error) {
        console.error('Error fetching medicines:', error);
        const list = document.getElementById('medicines');
        list.innerHTML = '<li>Error loading medicines</li>';
    }

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

    fetch('http://localhost:8000/update', {
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
