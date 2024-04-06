import {React} from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        console.log('Logout');
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set Content-Type to JSON
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();
            if (data.success) {
                navigate('/');
            }
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    
        
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;