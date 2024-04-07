import {React} from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

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
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            <div className="logout-message">
            <h2>You are currently logged in.</h2>
            <p>To access the login or signup page, please log out first.</p>
            </div>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
};

export default Logout;