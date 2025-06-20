
// function to retrieve data propagate list
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
        
        const list = document.getElementById('medicines');
        list.innerHTML = ""; // clears list if anything is there
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

// funciton to search json data for matching medicine from user form
function searchMedicine() {
const name = document.getElementById('search-medicine').value;

// retrieve response then do this, no response, then catch
fetch(`http://localhost:8000/medicines/${encodeURIComponent(name)}`)
    .then(response => response.json())
    .then(data => {
        if (data.error || data.name == "") {
            console.error(data.error);
            alert(data.error);
            return;
        }
        // Assuming medicine name found but has no price
        if(data.price == null){
            alert(`Medicine: ${data.name} -- NO PRICE INFORMATION FOUND`)
            return;
        }

        // Assuming safe, parse data and give alert with answer
        alert(`Medicine: ${data.name}\nPrice: ${data.price}`);
    })
    .catch(error => {
        alert('Medicine not found.');
    });
}

// function to update medicine information in json file
function updateMedicine() {
    const name = document.getElementById('update-med-ID').value;
    const price = document.getElementById('update-new-price').value;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);

    //get response
    fetch('http://localhost:8000/update', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                getMeds();
                alert(data.message);
            } else if (data.error) {
                alert(data.error);
            }
        })
        .catch(error => {
            alert('Error updating medicine.');
        });
}

// create med
async function createMedicine() {
    const name = document.getElementById('medicine-name-create').value;
    const price = document.getElementById('medicine-price-create').value;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);

    //get response
    fetch('http://localhost:8000/create', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                getMeds(); 
                alert(data.message);
            } else{
                console.error('Error adding medicine to JSON')
                throw new error('');
            }
        })
        .catch(error => {
            alert('Error adding medicine.');
        });
}

//delte function
function deleteItem() {
    const name = document.getElementById('delete-medicine-id').value;
    const formData = new FormData();
    formData.append('name', name);
    fetch('http://localhost:8000/delete', {
            method: 'DELETE',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else if (data.error) {
                throw new Error(data.error);
            }
            getMeds()  // Refresh the list
        })
        .catch(error => {
            alert(`Error deleting medicine. ${error}`);
        });  
}

// average funciton
async function avgCalc(){
    fetch('http://localhost:8000/avg', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if(data.error){
            throw new Error(data.error);
        }
        if(data.message){
            console.log(data);
            alert(data.message);
        }

    }).catch(error => {
        console.error(error);
        alert(`Error fetching avg med price:`);
    });
        
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof getMeds === 'function') {
        getMeds('medicines');
    }
});
