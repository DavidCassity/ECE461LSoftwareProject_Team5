import { useState } from "react";
const RequestHardwareButton = ({ projectId, onRequestHardware }) => {
    const [loading, setLoading] = useState(false);

    const handleRequestHardware = async () => {
        try {
        setLoading(true);
        // Make a request to the backend API to check for available hardware
        // Replace the following line with your actual API call
        const response = await fetch(`/api/hardware/request/${projectId}`, {
            method: 'POST',
            // Add headers or other configurations as needed
        });
        
        const data = await response.json();
        
        // Handle the response from the backend
        onRequestHardware(data.success); // You can pass a boolean indicating success or failure
        } catch (error) {
        console.error('Error requesting hardware:', error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <button onClick={handleRequestHardware} disabled={loading}>
        {loading ? 'Requesting Hardware...' : 'Request Hardware'}
        </button>
    );
};

export default RequestHardwareButton